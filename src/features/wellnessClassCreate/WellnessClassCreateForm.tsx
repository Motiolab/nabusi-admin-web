import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Select, DatePicker, Button, Flex, Typography, message, Divider, Cascader } from 'antd';
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
                centerId: selectedCenterId,
                maxReservationCnt: Number(values.maxReservationCnt),
                room: values.room,
                classImageUrlList: uploadedUrls,
                teacherId: values.teacherId,
                wellnessLectureTypeId: values.wellnessLectureTypeId,
                startDateTime: values.period[0].startOf('day').toISOString(),
                endDateTime: values.period[1].endOf('day').toISOString(),
                timeRangeWithDays: timeRanges.map((r: TimeRange) => ({
                    dayOfWeek: r.dayOfWeek,
                    startTime: r.startTime?.set('y', values.period[0].get('y')).set('M', values.period[0].get('M')).set('D', values.period[0].get('D')).toISOString(),
                    endTime: r.endTime?.set('y', values.period[0].get('y')).set('M', values.period[0].get('M')).set('D', values.period[0].get('D')).toISOString(),
                })),
                wellnessTicketManagementIdList: ticketIds,
                price: values.price ? Number(values.price) : 0
            };

            await createWellnessLectureListWithWellnessClass(request);

            message.success('수업이 성공적으로 생성되었습니다.');
            navigate('/wellness-class');
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
            style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #F1F5F9' }}
        >
            <Flex vertical gap={24}>
                <section>
                    <Title level={4} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        기본 정보
                        <Text type="secondary" style={{ fontSize: '12px', fontWeight: 400 }}>※ 모든 정보는 회원 앱에 노출됩니다</Text>
                    </Title>
                    <Flex gap={24} wrap="wrap">
                        <Form.Item
                            label="그룹 수업"
                            name="wellnessClassId"
                            rules={[{ required: true, message: '그룹 수업을 선택해주세요' }]}
                            style={{ flex: '1 1 300px' }}
                        >
                            <Select placeholder="그룹 수업 선택" options={classNames} onChange={onClassChange} showSearch optionFilterProp="label" />
                        </Form.Item>
                        <Form.Item
                            label="수업명"
                            name="name"
                            rules={[{ required: true, message: '수업명을 입력해주세요' }]}
                            style={{ flex: '2 1 400px' }}
                        >
                            <Input placeholder="수업명을 입력해주세요" />
                        </Form.Item>
                    </Flex>
                    <Flex gap={24} wrap="wrap">
                        <Form.Item
                            label="수업 종류"
                            name="wellnessLectureTypeId"
                            rules={[{ required: true, message: '수업 종류를 선택해주세요' }]}
                            style={{ flex: '1 1 200px' }}
                        >
                            <Select placeholder="수업 종류 선택" options={lectureTypes} />
                        </Form.Item>
                        <Form.Item
                            label="코치"
                            name="teacherId"
                            rules={[{ required: true, message: '코치를 선택해주세요' }]}
                            style={{ flex: '1 1 200px' }}
                        >
                            <Select placeholder="코치 선택" options={teachers} showSearch optionFilterProp="label" />
                        </Form.Item>
                        <Form.Item
                            label="정원"
                            name="maxReservationCnt"
                            rules={[{ required: true, message: '정원을 입력해주세요' }]}
                            style={{ flex: '1 1 100px' }}
                        >
                            <Input type="number" suffix="명" min={1} />
                        </Form.Item>
                    </Flex>
                </section>

                <Divider style={{ margin: 0 }} />

                <section>
                    <Title level={4} style={{ marginBottom: '20px' }}>일정 및 장소</Title>
                    <Flex gap={24} wrap="wrap" align="flex-start">
                        <Form.Item
                            label="수업 기간"
                            name="period"
                            rules={[{ required: true, message: '수업 기간을 선택해주세요' }]}
                            style={{ flex: '1 1 300px' }}
                        >
                            <DatePicker.RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="수업 장소"
                            name="room"
                            rules={[{ required: true, message: '장소를 선택해주세요' }]}
                            style={{ flex: '1 1 200px' }}
                        >
                            <Select placeholder="장소 선택" options={rooms} />
                        </Form.Item>
                    </Flex>
                    <Form.Item label="수업 일정" required>
                        <TimeRangeList timeRanges={timeRanges} setTimeRanges={setTimeRanges} />
                    </Form.Item>
                </section>

                <Divider style={{ margin: 0 }} />

                <section>
                    <Title level={4} style={{ marginBottom: '20px' }}>상품 정보</Title>
                    <Flex gap={24} wrap="wrap">
                        <Form.Item
                            label="1회 가격"
                            name="price"
                            rules={[{ required: true, message: '가격을 입력해주세요' }]}
                            style={{ flex: '1 1 200px' }}
                        >
                            <Input type="number" suffix="원" placeholder="숫자만 입력해주세요" min={0} />
                        </Form.Item>
                        <Form.Item
                            label="예약 가능 정기권"
                            name="tickets"
                            rules={[{ required: true, message: '수강권을 선택해주세요' }]}
                            style={{ flex: '2 1 400px' }}
                        >
                            <Cascader
                                options={ticketOptions}
                                multiple
                                placeholder="수강권 선택"
                                maxTagCount="responsive"
                                showSearch
                            />
                        </Form.Item>
                    </Flex>
                    <Form.Item label="수업 이미지" required>
                        <Flex gap={12} wrap="wrap">
                            {uploadedUrls.map((url, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img src={url} alt="class" style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <Button
                                        type="primary"
                                        danger
                                        shape="circle"
                                        icon={<X size={12} />}
                                        size="small"
                                        style={{ position: 'absolute', top: -8, right: -8 }}
                                        onClick={() => setUploadedUrls(uploadedUrls.filter((_, i) => i !== index))}
                                    />
                                </div>
                            ))}
                            {uploadedUrls.length < 5 && (
                                <ImageUploader onUploadSuccess={(url) => setUploadedUrls([...uploadedUrls, url])} size={100} />
                            )}
                        </Flex>
                        <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>최대 5장까지 업로드 가능합니다.</Text>
                    </Form.Item>
                    <Form.Item label="수업 소개" name="description">
                        <TextArea rows={4} placeholder="수업에 대해 간단하게 소개해 주세요." />
                    </Form.Item>
                </section>

                <Flex justify="flex-end" gap={12} style={{ marginTop: '24px' }}>
                    <Button size="large" onClick={() => navigate(-1)} style={{ width: '120px', borderRadius: '8px' }}>
                        취소
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        htmlType="submit"
                        style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', width: '120px', borderRadius: '8px' }}
                    >
                        추가하기
                    </Button>
                </Flex>
            </Flex>
        </Form>
    );
};
