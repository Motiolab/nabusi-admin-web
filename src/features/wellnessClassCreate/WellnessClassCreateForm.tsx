import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Select, DatePicker, Button, Flex, Typography, message, Divider, Cascader, Row, Col } from 'antd';
import { X } from 'lucide-react';
import type { RootState } from '@/app/store';
import { useNavigate } from 'react-router-dom';

import { getWellnessClassNameListByCenterId, getWellnessClassDetailByCenterId } from '@/entities/wellnessClass/api';
import type { IGetWellnessClassNameByCenterIdAdminResponseV1 } from '@/entities/wellnessClass/api';
import { getWellnessLectureTypeNameListByCenterId } from '@/entities/wellnessLectureType/api';
import type { IGetWellnessLectureTypeNameListByCenterIdAdminResponseV1 } from '@/entities/wellnessLectureType/api';
import { getRoomListByCenterId } from '@/entities/center/api';
import type { ICenterRoom } from '@/entities/center/api';
import { getWellnessTicketManagementNameListByCenterId } from '@/entities/wellnessTicketManagement/api';
import type { IGetWellnessTicketManagementNameByCenterIdAdminResponseV1 } from '@/entities/wellnessTicketManagement/api';
import { getTeacherListByCenterId } from '@/entities/teacher/api';
import type { IGetTeacherListByCenterIdAdminResponseV1 } from '@/entities/teacher/api';
import { createWellnessLectureListWithWellnessClass } from '@/entities/wellnessLecture/api';
import type { ICreateWellnessLectureListWithWellnessClassAdminRequestV1 } from '@/entities/wellnessLecture/api';

import { TimeRangeList } from './TimeRangeList';
import type { TimeRange } from './TimeRangeList';
import { ImageUploader } from '@/shared/ui/ImageUploader';
import { CreateWellnessClassModal } from './components/CreateWellnessClassModal';
import { CreateWellnessLectureTypeModal } from './components/CreateWellnessLectureTypeModal';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const WellnessClassCreateForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [classNames, setClassNames] = useState<any[]>([]);
    const [lectureTypes, setLectureTypes] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [ticketOptions, setTicketOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [timeRanges, setTimeRanges] = useState<TimeRange[]>([{ dayOfWeek: '', startTime: null, endTime: null }]);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    useEffect(() => {
        if (selectedCenterId) {
            fetchOptions();
        }
    }, [selectedCenterId]);

    const fetchOptions = async () => {
        try {
            const [classesRes, typesRes, roomsRes, teachersRes, ticketsRes] = await Promise.all([
                getWellnessClassNameListByCenterId(selectedCenterId),
                getWellnessLectureTypeNameListByCenterId(selectedCenterId),
                getRoomListByCenterId(selectedCenterId),
                getTeacherListByCenterId(selectedCenterId),
                getWellnessTicketManagementNameListByCenterId(selectedCenterId),
            ]);

            setClassNames(classesRes.data.map((c: IGetWellnessClassNameByCenterIdAdminResponseV1) => ({ label: c.name, value: c.id })));
            setLectureTypes(typesRes.data.map((t: IGetWellnessLectureTypeNameListByCenterIdAdminResponseV1) => ({ label: t.name, value: t.id })));
            setRooms(roomsRes.data.map((r: ICenterRoom) => ({ label: r.name, value: r.name })));
            setTeachers(teachersRes.data.map((t: IGetTeacherListByCenterIdAdminResponseV1) => ({ label: t.name, value: t.id })));

            // Format tickets for Cascader
            const tickets = ticketsRes.data;
            const result: any[] = [];
            const ticketMap = new Map<number, any>();

            tickets.forEach((item: IGetWellnessTicketManagementNameByCenterIdAdminResponseV1) => {
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
        } catch (error) {
            console.error('Failed to fetch options:', error);
            message.error('필요한 정보를 불러오는데 실패했습니다.');
        }
    };

    const onClassChange = async (classId: number) => {
        try {
            const res = await getWellnessClassDetailByCenterId(selectedCenterId, classId);
            form.setFieldsValue({
                name: res.data.name,
                maxReservationCnt: res.data.maxReservationCnt,
                room: res.data.room,
                teacherId: res.data.teacherId,
            });
        } catch (error) {
            console.error('Failed to fetch class detail:', error);
        }
    };

    const onFinish = async (values: any) => {
        if (timeRanges.some(r => !r.dayOfWeek || !r.startTime || !r.endTime)) {
            return message.error('수업 일정을 모두 입력해주세요.');
        }
        if (uploadedUrls.length === 0) {
            return message.error('수업 이미지를 최소 한 장 업로드해주세요.');
        }

        setLoading(true);
        try {
            // Flatten the selected tickets from Cascader (Cascader multiple returns array of arrays)
            const ticketIds = values.tickets.map((t: any[]) => t[t.length - 1]);

            const request: ICreateWellnessLectureListWithWellnessClassAdminRequestV1 = {
                wellnessClassId: values.wellnessClassId,
                name: values.name,
                description: values.description || '',
                centerId: selectedCenterId!,
                maxReservationCnt: Number(values.maxReservationCnt),
                room: values.room,
                classImageUrlList: uploadedUrls,
                teacherId: values.teacherId,
                wellnessLectureTypeId: values.wellnessLectureTypeId,
                startDateTime: values.period[0].startOf('day'),
                endDateTime: values.period[1].endOf('day'),
                timeRangeWithDays: timeRanges.map((r: TimeRange) => ({
                    dayOfWeek: r.dayOfWeek,
                    startTime: r.startTime?.set('y', values.period[0].get('y')).set('M', values.period[0].get('M')).set('D', values.period[0].get('D')).toISOString() || '',
                    endTime: r.endTime?.set('y', values.period[0].get('y')).set('M', values.period[0].get('M')).set('D', values.period[0].get('D')).toISOString() || '',
                })),
                wellnessTicketManagementIdList: ticketIds,
                price: values.price ? Number(values.price) : 0
            };

            await createWellnessLectureListWithWellnessClass(request);

            message.success('수업이 성공적으로 생성되었습니다.');
            navigate('/wellness-lecture');
        } catch (error) {
            console.error('Failed to create class:', error);
            message.error('수업 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                maxReservationCnt: 1,
            }}
            style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9' }}
        >
            <Row gutter={20}>
                {/* Left Column: Basic Class & Schedule */}
                <Col span={14}>
                    <Flex vertical gap={12}>
                        <section>
                            <Title level={5} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                기본 정보
                                <Text type="secondary" style={{ fontSize: '11px', fontWeight: 400 }}>※ 회원 앱 노출 정보</Text>
                            </Title>
                            <Row gutter={12}>
                                <Col span={10}>
                                    <Form.Item
                                        label={
                                            <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                                                <span>그룹 수업</span>
                                                <CreateWellnessClassModal centerId={selectedCenterId!} onCreated={fetchOptions} />
                                            </Flex>
                                        }
                                        name="wellnessClassId"
                                        rules={[{ required: true, message: '그룹 수업을 선택해주세요' }]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <Select placeholder="수업 선택" options={classNames} onChange={onClassChange} showSearch optionFilterProp="label" />
                                    </Form.Item>
                                </Col>
                                <Col span={14}>
                                    <Form.Item
                                        label="수업명"
                                        name="name"
                                        rules={[{ required: true, message: '수업명을 입력해주세요' }]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <Input placeholder="수업명을 입력해주세요" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col span={8}>
                                    <Form.Item
                                        label={
                                            <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                                                <span>수업 종류</span>
                                                <CreateWellnessLectureTypeModal centerId={selectedCenterId!} onCreated={fetchOptions} />
                                            </Flex>
                                        }
                                        name="wellnessLectureTypeId"
                                        rules={[{ required: true, message: '수업 종류를 선택해주세요' }]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <Select placeholder="종류 선택" options={lectureTypes} />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item
                                        label="코치"
                                        name="teacherId"
                                        rules={[{ required: true, message: '코치를 선택해주세요' }]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <Select placeholder="코치 선택" options={teachers} showSearch optionFilterProp="label" />
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
                            </Row>
                        </section>

                        <Divider style={{ margin: '4px 0' }} />

                        <section>
                            <Title level={5} style={{ marginBottom: '12px' }}>일정 및 장소</Title>
                            <Row gutter={12}>
                                <Col span={14}>
                                    <Form.Item
                                        label="수업 기간"
                                        name="period"
                                        rules={[{ required: true, message: '수업 기간을 선택해주세요' }]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <DatePicker.RangePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item
                                        label="수업 장소"
                                        name="room"
                                        rules={[{ required: true, message: '장소를 선택해주세요' }]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <Select placeholder="장소 선택" options={rooms} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="수업 일정" required style={{ marginBottom: '4px' }}>
                                <TimeRangeList timeRanges={timeRanges} setTimeRanges={setTimeRanges} />
                            </Form.Item>
                        </section>
                    </Flex>
                </Col>

                {/* Right Column: supplementary details & media */}
                <Col span={10}>
                    <Flex vertical gap={12}>
                        <section>
                            <Title level={5} style={{ marginBottom: '12px' }}>상세 정보</Title>
                            <Row gutter={12}>
                                <Col span={10}>
                                    <Form.Item
                                        label="1회 가격"
                                        name="price"
                                        rules={[{ required: true, message: '가격 입력' }]}
                                        style={{ marginBottom: '12px' }}
                                    >
                                        <Input type="number" suffix="원" placeholder="숫자 가" min={0} />
                                    </Form.Item>
                                </Col>
                                <Col span={14}>
                                    <Form.Item
                                        label="예약 가능 정기권"
                                        name="tickets"
                                        rules={[{ required: true, message: '수강권 선택' }]}
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
                                </Col>
                            </Row>

                            <Form.Item label="수업 이미지" required style={{ marginBottom: '12px' }}>
                                <Flex gap={8} wrap="wrap">
                                    {uploadedUrls.map((url, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img src={url} alt="class" style={{ width: '65px', height: '65px', borderRadius: '6px', objectFit: 'cover' }} />
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
                                        <ImageUploader onUploadSuccess={(url) => setUploadedUrls([...uploadedUrls, url])} size={65} />
                                    )}
                                </Flex>
                                <Text type="secondary" style={{ fontSize: '11px', marginTop: '4px', display: 'block' }}>최대 5장 가능</Text>
                            </Form.Item>

                            <Form.Item label="수업 소개" name="description" style={{ marginBottom: 0 }}>
                                <TextArea rows={7} placeholder="수업에 대해 간단하게 소개해 주세요." style={{ borderRadius: '6px' }} />
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
                    추가하기
                </Button>
            </Flex>
        </Form>
    );
};
