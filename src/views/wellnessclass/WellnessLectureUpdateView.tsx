import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, DatePicker, Button, Flex, Typography, message, Divider, Cascader, TimePicker, Row, Col } from 'antd';
import { ArrowLeft, X } from 'lucide-react';
import type { RootState } from '@/app/store';
import dayjs from 'dayjs';

import { getWellnessLectureDetailById, updateWellnessLecture } from '@/entities/wellnessLecture/api';
import type { IUpdateWellnessLectureAdminRequestV1 } from '@/entities/wellnessLecture/api';
import { getWellnessLectureTypeNameListByCenterId } from '@/entities/wellnessLectureType/api';
import { getRoomListByCenterId } from '@/entities/center/api';
import { getWellnessTicketManagementNameListByCenterId } from '@/entities/wellnessTicketManagement/api';
import { getTeacherListByCenterId } from '@/entities/teacher/api';

import { ImageUploader } from '@/shared/ui/ImageUploader';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function WellnessLectureUpdateView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    // Options
    const [lectureTypes, setLectureTypes] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [ticketOptions, setTicketOptions] = useState<any[]>([]);

    useEffect(() => {
        if (selectedCenterId && id) {
            fetchData();
        }
    }, [selectedCenterId, id]);

    const fetchData = async () => {
        try {
            const [typesRes, roomsRes, teachersRes, ticketsRes, detailRes] = await Promise.all([
                getWellnessLectureTypeNameListByCenterId(selectedCenterId),
                getRoomListByCenterId(selectedCenterId),
                getTeacherListByCenterId(selectedCenterId),
                getWellnessTicketManagementNameListByCenterId(selectedCenterId),
                getWellnessLectureDetailById(selectedCenterId!, Number(id))
            ]);

            setLectureTypes(typesRes.data.map(t => ({ label: t.name, value: t.id })));
            setRooms(roomsRes.data.map(r => ({ label: r.name, value: r.name })));
            setTeachers(teachersRes.data.map(t => ({ label: t.name, value: t.id })));

            // Extract tickets logic (Reuse from create)
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
            const lecture = detailRes.data;
            const start = dayjs(lecture.startDateTime);
            const end = dayjs(lecture.endDateTime);

            // Reconstruct ticket selection for cascader
            // Note: This matches the leaf node ID. Cascader needs full path sometimes, but usually leaf is enough if unique or using 'showCheckedStrategy'.
            // Here we assume mapping back to [ticketTypeId, issuanceId] pattern if needed, but for simplicity let's try direct leaf ID if backend supports flat list or reconstruct paths.
            // Simplified: We need to find the parent ID for each available ticket to set the Cascader value [parent, child].

            const selectedTicketPaths: any[] = [];

            if (lecture.wellnessTicketAvailableList) {
                lecture.wellnessTicketAvailableList.forEach(avail => {
                    selectedTicketPaths.push([avail.wellnessTicketId, avail.wellnessTicketManagementId]);
                });
            }

            form.setFieldsValue({
                name: lecture.name,
                wellnessLectureTypeId: lecture.wellnessLectureTypeId,
                teacherId: lecture.teacherId,
                maxReservationCnt: lecture.maxReservationCnt,
                price: lecture.price,
                description: lecture.description,
                room: lecture.room,
                date: start, // Single date
                timeRange: [start, end],
                tickets: selectedTicketPaths
            });
            setUploadedUrls(lecture.lectureImageUrlList || []);

        } catch (error) {
            console.error('Failed to fetch data:', error);
            message.error('정보를 불러오는데 실패했습니다.');
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Combine Date + Time
            const date = values.date;
            const startTime = values.timeRange[0];
            const endTime = values.timeRange[1];

            const startDateTime = date.hour(startTime.hour()).minute(startTime.minute()).second(0).toISOString();
            const endDateTime = date.hour(endTime.hour()).minute(endTime.minute()).second(0).toISOString();

            const ticketIds = values.tickets.map((t: any[]) => t[t.length - 1]);

            const request: IUpdateWellnessLectureAdminRequestV1 = {
                id: Number(id),
                name: values.name,
                description: values.description || '',
                centerId: selectedCenterId,
                maxReservationCnt: Number(values.maxReservationCnt),
                room: values.room,
                lectureImageUrlList: uploadedUrls,
                teacherId: values.teacherId,
                wellnessLectureTypeId: values.wellnessLectureTypeId,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                wellnessTicketManagementIdList: ticketIds,
                price: values.price ? Number(values.price) : 0
            };

            await updateWellnessLecture(request);
            message.success('강의가 성공적으로 수정되었습니다.');
            navigate(-1); // Go back to detail
        } catch (error) {
            console.error('Failed to update lecture:', error);
            message.error('강의 수정에 실패했습니다.');
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
                        <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>강의 수정</Title>
                        <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>개별 강의 정보를 수정합니다.</Text>
                    </div>
                </Flex>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9' }}
                >
                    <Row gutter={20}>
                        {/* Left Column: Essential Settings */}
                        <Col span={14}>
                            <Flex vertical gap={12}>
                                <section>
                                    <Title level={5} style={{ marginBottom: '12px', fontSize: '15px' }}>기본 정보</Title>
                                    <Row gutter={12}>
                                        <Col span={16}>
                                            <Form.Item
                                                label="강의명"
                                                name="name"
                                                rules={[{ required: true, message: '강의명을 입력해주세요' }]}
                                                style={{ marginBottom: '12px' }}
                                            >
                                                <Input placeholder="강의명을 입력해주세요" />
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
                                    <Title level={5} style={{ marginBottom: '12px', fontSize: '15px' }}>일정 및 장소</Title>
                                    <Row gutter={12}>
                                        <Col span={9}>
                                            <Form.Item
                                                label="날짜"
                                                name="date"
                                                rules={[{ required: true, message: '날짜를 선택해주세요' }]}
                                                style={{ marginBottom: '12px' }}
                                            >
                                                <DatePicker style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                label="시간"
                                                name="timeRange"
                                                rules={[{ required: true, message: '시간을 선택해주세요' }]}
                                                style={{ marginBottom: '12px' }}
                                            >
                                                <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
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

                        {/* Right Column: Supplementary Settings */}
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
                                    <Form.Item label="강의 이미지" required style={{ marginBottom: '12px' }}>
                                        <Flex gap={8} wrap="wrap">
                                            {uploadedUrls.map((url, index) => (
                                                <div key={index} style={{ position: 'relative' }}>
                                                    <img src={url} alt="class" style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                                                    <Button
                                                        type="primary"
                                                        danger
                                                        shape="circle"
                                                        icon={<X size={10} />}
                                                        size="small"
                                                        style={{ position: 'absolute', top: -4, right: -4, width: '16px', height: '16px', minWidth: '16px' }}
                                                        onClick={() => setUploadedUrls(uploadedUrls.filter((_, i) => i !== index))}
                                                    />
                                                </div>
                                            ))}
                                            {uploadedUrls.length < 5 && (
                                                <ImageUploader onUploadSuccess={(url) => setUploadedUrls([...uploadedUrls, url])} size={60} />
                                            )}
                                        </Flex>
                                    </Form.Item>
                                    <Form.Item label="강의 소개" name="description" style={{ marginBottom: 0 }}>
                                        <TextArea rows={5} placeholder="강의 소개를 입력해주세요." style={{ borderRadius: '6px' }} />
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
