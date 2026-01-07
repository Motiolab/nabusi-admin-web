import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Select, Button, Flex, Typography, message, Cascader, Row, Col, Divider } from 'antd';
import { ArrowLeft, X } from 'lucide-react';
import type { RootState } from '@/app/store';

import { getWellnessLectureDetailById, updateWellnessLectureList } from '@/entities/wellnessLecture/api';
import { getWellnessLectureTypeNameListByCenterId } from '@/entities/wellnessLectureType/api';
import { getRoomListByCenterId } from '@/entities/center/api';
import { getWellnessTicketManagementNameListByCenterId } from '@/entities/wellnessTicketManagement/api';
import { getTeacherListByCenterId } from '@/entities/teacher/api';

import { ImageUploader } from '@/shared/ui/ImageUploader';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function WellnessLectureListUpdateView() {
    const [searchParams] = useSearchParams();
    const ids = searchParams.get('ids')?.split(',') || [];
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string>('');

    // Options
    const [lectureTypes, setLectureTypes] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [ticketOptions, setTicketOptions] = useState<any[]>([]);

    useEffect(() => {
        if (selectedCenterId && ids.length > 0) {
            fetchData();
        }
    }, [selectedCenterId, searchParams]);

    const fetchData = async () => {
        try {
            const [typesRes, roomsRes, teachersRes, ticketsRes, detailRes] = await Promise.all([
                getWellnessLectureTypeNameListByCenterId(selectedCenterId),
                getRoomListByCenterId(selectedCenterId),
                getTeacherListByCenterId(selectedCenterId),
                getWellnessTicketManagementNameListByCenterId(selectedCenterId),
                getWellnessLectureDetailById(selectedCenterId!, Number(ids[0])) // Load first as template
            ]);

            setLectureTypes(typesRes.data.map((t: any) => ({ label: t.name, value: t.id })));
            setRooms(roomsRes.data.map((r: any) => ({ label: r.name, value: r.name })));
            setTeachers(teachersRes.data.map((t: any) => ({ label: t.name, value: t.id })));

            // Extract tickets logic
            const tickets = ticketsRes.data;
            const result: any[] = [];
            const ticketMap = new Map<number, any>();

            tickets.forEach((item: any) => {
                if (!ticketMap.has(item.wellnessTicketId)) {
                    ticketMap.set(item.wellnessTicketId, {
                        label: item.wellnessTicketName,
                        value: item.wellnessTicketId,
                        children: []
                    });
                    result.push(ticketMap.get(item.wellnessTicketId));
                }
                ticketMap.get(item.wellnessTicketId).children.push({
                    label: item.wellnessTicketIssuanceName,
                    value: item.id
                });
            });
            setTicketOptions(result);

            // Set Form Values
            const data = detailRes.data;

            // Reconstruct ticket selection for cascader
            const selectedTicketPaths: any[] = [];
            if (data.wellnessTicketAvailableList) {
                data.wellnessTicketAvailableList.forEach((avail: any) => {
                    selectedTicketPaths.push([avail.wellnessTicketId, avail.wellnessTicketManagementId]);
                });
            }

            form.setFieldsValue({
                name: data.name,
                wellnessLectureTypeId: data.wellnessLectureTypeId,
                teacherId: data.teacherId,
                maxReservationCnt: data.maxReservationCnt,
                price: data.price,
                description: data.description,
                room: data.room,
                tickets: selectedTicketPaths
            });
            setUploadedUrl(data.lectureImageUrlList?.[0] || '');

        } catch (error) {
            console.error('Failed to fetch data:', error);
            message.error('정보를 불러오는데 실패했습니다.');
        }
    };

    const onFinish = async (values: any) => {
        if (!selectedCenterId) {
            message.error('센터를 선택해주세요.');
            return;
        }

        setLoading(true);
        try {
            // Selected paths from Cascader: [[parentId, issuanceId], ...]
            // Extract the leaf ID (issuanceId) and filter out any invalid values
            const ticketIds = (values.tickets || [])
                .map((path: any[]) => path[path.length - 1])
                .filter((id: any) => id !== null && id !== undefined);

            const request = {
                idList: ids.map(Number),
                name: values.name,
                description: values.description,
                centerId: selectedCenterId,
                maxReservationCnt: Number(values.maxReservationCnt),
                room: values.room,
                lectureImageUrlList: uploadedUrl ? [uploadedUrl] : [],
                teacherId: values.teacherId,
                wellnessLectureTypeId: values.wellnessLectureTypeId,
                wellnessTicketManagementIdList: ticketIds as number[],
                price: values.price ? Number(values.price) : undefined
            };

            await updateWellnessLectureList(request);

            message.success('선택한 강의들이 성공적으로 수정되었습니다.');
            navigate(-1);
        } catch (error) {
            console.error('Failed to update class:', error);
            message.error('그룹 수업 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <Flex vertical gap={16}>
                <Flex align="center" gap={12}>
                    <Button
                        type="text"
                        icon={<ArrowLeft size={18} />}
                        onClick={() => navigate(-1)}
                        style={{ height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                    <div>
                        <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>복수 강의 수정</Title>
                        <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>선택한 여러 강의의 정보를 일괄 수정합니다.</Text>
                    </div>
                </Flex>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9' }}
                >
                    <Row gutter={20}>
                        <Col span={14}>
                            <Flex vertical gap={12}>
                                <section>
                                    <Title level={5} style={{ marginBottom: '12px', fontSize: '15px' }}>기본 정보</Title>
                                    <Row gutter={12}>
                                        <Col span={16}>
                                            <Form.Item
                                                label="그룹 수업명"
                                                name="name"
                                                rules={[{ required: true, message: '그룹 수업명을 입력해주세요' }]}
                                                style={{ marginBottom: '12px' }}
                                            >
                                                <Input placeholder="그룹 수업명을 입력해주세요" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="수업 종류"
                                                name="wellnessLectureTypeId"
                                                rules={[{ required: true, message: '수업 종류를 선택해주세요' }]}
                                                style={{ marginBottom: '12px' }}
                                            >
                                                <Select placeholder="종류 선택" options={lectureTypes} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={12}>
                                        <Col span={10}>
                                            <Form.Item
                                                label="강사"
                                                name="teacherId"
                                                rules={[{ required: true, message: '강사를 선택해주세요' }]}
                                                style={{ marginBottom: '12px' }}
                                            >
                                                <Select placeholder="강사 선택" options={teachers} showSearch optionFilterProp="label" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                label="정원"
                                                name="maxReservationCnt"
                                                rules={[{ required: true, message: '정원을 입력해주세요' }]}
                                                style={{ marginBottom: '12px' }}
                                            >
                                                <Input type="number" suffix="명" min={1} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="1회 가격"
                                                name="price"
                                                rules={[{ required: true, message: '가격을 입력해주세요' }]}
                                                style={{ marginBottom: '12px' }}
                                            >
                                                <Input type="number" suffix="원" min={0} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </section>

                                <Divider style={{ margin: '4px 0' }} />

                                <section>
                                    <Title level={5} style={{ marginBottom: '12px', fontSize: '15px' }}>장소 정보</Title>
                                    <Row gutter={12}>
                                        <Col span={8}>
                                            <Form.Item
                                                label="장소"
                                                name="room"
                                                rules={[{ required: true, message: '장소를 선택해주세요' }]}
                                                style={{ marginBottom: '12px' }}
                                            >
                                                <Select placeholder="장소" options={rooms} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </section>
                            </Flex>
                        </Col>

                        <Col span={10}>
                            <Flex vertical gap={12}>
                                <section>
                                    <Title level={5} style={{ marginBottom: '12px', fontSize: '15px' }}>상세 정보</Title>
                                    <Form.Item
                                        label="이용 가능 수강권"
                                        name="tickets"
                                        rules={[{ required: true, message: '수강권을 선택해주세요' }]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <Cascader
                                            options={ticketOptions}
                                            multiple
                                            placeholder="수강권 선택"
                                            maxTagCount="responsive"
                                            showSearch
                                        />
                                    </Form.Item>
                                    <Form.Item label="그룹 수업 이미지" style={{ marginBottom: '12px' }}>
                                        <Flex gap={8} wrap="wrap">
                                            {uploadedUrl && (
                                                <div style={{ position: 'relative' }}>
                                                    <img src={uploadedUrl} alt="class" style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                                                    <Button
                                                        type="primary"
                                                        danger
                                                        shape="circle"
                                                        icon={<X size={10} />}
                                                        size="small"
                                                        style={{ position: 'absolute', top: -4, right: -4, width: '16px', height: '16px', minWidth: '16px' }}
                                                        onClick={() => setUploadedUrl('')}
                                                    />
                                                </div>
                                            )}
                                            {!uploadedUrl && (
                                                <ImageUploader onUploadSuccess={(url) => setUploadedUrl(url)} size={60} />
                                            )}
                                        </Flex>
                                    </Form.Item>
                                    <Form.Item label="그룹 수업 소개" name="description" style={{ marginBottom: 0 }}>
                                        <TextArea rows={5} placeholder="그룹 수업 소개를 입력해주세요." style={{ borderRadius: '6px' }} />
                                    </Form.Item>
                                </section>
                            </Flex>
                        </Col>
                    </Row>

                    <Flex justify="flex-end" gap={12} style={{ marginTop: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                        <Button onClick={() => navigate(-1)} style={{ width: '100px', borderRadius: '6px' }}>
                            취소
                        </Button>
                        <Button
                            type="primary"
                            loading={loading}
                            htmlType="submit"
                            style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', width: '100px', borderRadius: '6px', fontWeight: 600 }}
                        >
                            저장하기
                        </Button>
                    </Flex>
                </Form>
            </Flex>
        </div>
    );
}
