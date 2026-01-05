import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, Flex, Typography, message, Card, TimePicker, Checkbox, Divider } from 'antd';
import { MapPin, Phone, Clock, Plus, Trash2, Edit2, X } from 'lucide-react';
import { ImageUploader } from '@/shared/ui/ImageUploader';
import type { RootState } from '@/app/store';
import { getCenterInfo, updateCenterInfo } from '@/entities/center/api';
import type { ICenterInfoJoinAll } from '@/entities/center/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const CenterInfoForm = () => {
    const [form] = Form.useForm();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [centerData, setCenterData] = useState<ICenterInfoJoinAll | null>(null);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    // Day of week labels
    const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

    useEffect(() => {
        if (selectedCenterId) {
            fetchCenterInfo();
        }
    }, [selectedCenterId]);

    const fetchCenterInfo = async () => {
        setInitialLoading(true);
        try {
            const res = await getCenterInfo(selectedCenterId);
            setCenterData(res.data);
            setUploadedUrls(res.data.imageUrlList || []);

            // Format data for form
            const formattedOpenInfo = days.map((_, index) => {
                const info = res.data.openInfoList.find(i => i.day === index);
                return {
                    day: index,
                    openTime: info ? dayjs(info.openTime) : dayjs().hour(9).minute(0),
                    closeTime: info ? dayjs(info.closeTime) : dayjs().hour(22).minute(0),
                    isDayOff: info ? info.isDayOff : false
                };
            });

            form.setFieldsValue({
                name: res.data.name,
                address: res.data.address,
                detailAddress: res.data.detailAddress,
                contactNumbers: res.data.contactNumberList.map(c => ({
                    type: c.contactType,
                    number: c.number
                })),
                description: res.data.description,
                openInfo: formattedOpenInfo,
                rooms: res.data.roomList
            });
        } catch (error) {
            console.error('Failed to fetch center info:', error);
            message.error('센터 정보를 불러오는데 실패했습니다.');
        } finally {
            setInitialLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        if (!selectedCenterId || !centerData) return;

        setLoading(true);
        try {
            const request: ICenterInfoJoinAll = {
                ...centerData,
                name: values.name,
                address: values.address,
                detailAddress: values.detailAddress,
                description: values.description,
                imageUrlList: uploadedUrls,
                contactNumberList: values.contactNumbers.map((c: any, index: number) => ({
                    id: centerData.contactNumberList[index]?.id,
                    contactType: c.type,
                    number: c.number
                })),
                openInfoList: values.openInfo.map((info: any) => ({
                    id: centerData.openInfoList.find(i => i.day === info.day)?.id,
                    day: info.day,
                    openTime: info.openTime.format('YYYY-MM-DDTHH:mm:00Z'),
                    closeTime: info.closeTime.format('YYYY-MM-DDTHH:mm:00Z'),
                    isDayOff: info.isDayOff
                })),
                roomList: values.rooms
            };

            await updateCenterInfo(selectedCenterId, request);
            message.success('센터 정보가 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('Failed to update center info:', error);
            message.error('센터 정보 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <Card loading={true} />;
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: '1200px' }}
        >
            <Flex gap={24} wrap="wrap">
                {/* Basic Info & Location */}
                <Flex vertical gap={24} style={{ flex: '1 1 500px' }}>
                    <Card title="기본 정보 및 위치" variant="outlined" style={{ borderRadius: '16px' }}>
                        <Form.Item label="상호명" name="name" rules={[{ required: true }]}>
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label="주소" name="address" rules={[{ required: true }]}>
                            <Input
                                size="large"
                                prefix={<MapPin size={18} color="#94A3B8" />}
                                disabled
                                suffix={<Button type="link">검색</Button>}
                            />
                        </Form.Item>

                        <Form.Item label="상세 주소" name="detailAddress">
                            <Input size="large" />
                        </Form.Item>

                        <Divider />

                        <Title level={5} style={{ marginBottom: '16px' }}>연락처</Title>
                        <Form.List name="contactNumbers">
                            {(fields) => (
                                <Flex vertical gap={12}>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Flex key={key} gap={8}>
                                            <Form.Item {...restField} name={[name, 'type']} noStyle>
                                                <Input style={{ width: '100px' }} size="large" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'number']} noStyle>
                                                <Input
                                                    style={{ flex: 1 }}
                                                    size="large"
                                                    prefix={<Phone size={18} color="#94A3B8" />}
                                                />
                                            </Form.Item>
                                        </Flex>
                                    ))}
                                </Flex>
                            )}
                        </Form.List>
                    </Card>

                    <Card title="센터 소개" variant="outlined" style={{ borderRadius: '16px' }}>
                        <Form.Item label="이미지 (최대 5장)" required>
                            <Flex gap={12} wrap="wrap">
                                {uploadedUrls.map((url, index) => (
                                    <div key={index} style={{ position: 'relative' }}>
                                        <img src={url} alt="center" style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />
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
                        </Form.Item>

                        <Divider />

                        <Form.Item label="센터 소개글" name="description">
                            <TextArea rows={6} placeholder="회원들에게 보여질 센터 소개글을 입력해주세요." />
                        </Form.Item>
                    </Card>
                </Flex>

                {/* Operating Hours & Rooms */}
                <Flex vertical gap={24} style={{ flex: '1 1 500px' }}>
                    <Card title="운영 시간" variant="outlined" style={{ borderRadius: '16px' }}>
                        <Form.List name="openInfo">
                            {(fields) => (
                                <Flex vertical gap={8}>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Form.Item shouldUpdate noStyle key={key}>
                                            {() => {
                                                const isDayOff = form.getFieldValue(['openInfo', name, 'isDayOff']);
                                                return (
                                                    <Flex align="center" gap={12} style={{
                                                        padding: '12px',
                                                        backgroundColor: isDayOff ? '#F8FAFC' : '#FFFFFF',
                                                        borderRadius: '8px',
                                                        border: '1px solid #F1F5F9'
                                                    }}>
                                                        <Text style={{ width: '60px', fontWeight: 600 }}>{days[name]}</Text>
                                                        <Flex gap={8} align="center" style={{ flex: 1, opacity: isDayOff ? 0.3 : 1 }}>
                                                            <Clock size={16} color="#94A3B8" />
                                                            <Form.Item {...restField} name={[name, 'openTime']} noStyle>
                                                                <TimePicker format="HH:mm" minuteStep={30} variant="borderless" disabled={isDayOff} />
                                                            </Form.Item>
                                                            <Text type="secondary">-</Text>
                                                            <Form.Item {...restField} name={[name, 'closeTime']} noStyle>
                                                                <TimePicker format="HH:mm" minuteStep={30} variant="borderless" disabled={isDayOff} />
                                                            </Form.Item>
                                                        </Flex>
                                                        <Form.Item {...restField} name={[name, 'isDayOff']} valuePropName="checked" noStyle>
                                                            <Checkbox>휴무</Checkbox>
                                                        </Form.Item>
                                                    </Flex>
                                                );
                                            }}
                                        </Form.Item>
                                    ))}
                                </Flex>
                            )}
                        </Form.List>
                    </Card>

                    <Card
                        title="수업 장소 (강의실)"
                        variant="outlined"
                        style={{ borderRadius: '16px' }}
                        extra={<Button type="link" icon={<Plus size={16} />}>장소 추가</Button>}
                    >
                        <Form.List name="rooms">
                            {(fields, { remove }) => (
                                <Flex vertical gap={8}>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Flex key={key} align="center" gap={12} style={{
                                            padding: '8px 12px',
                                            backgroundColor: '#F8FAFC',
                                            borderRadius: '8px'
                                        }}>
                                            <Form.Item {...restField} name={[name, 'name']} noStyle>
                                                <Input variant="borderless" style={{ fontWeight: 600 }} />
                                            </Form.Item>
                                            <Flex gap={8}>
                                                <Button size="small" type="text" icon={<Edit2 size={14} color="#64748B" />} />
                                                <Button size="small" type="text" icon={<Trash2 size={14} color="#EF4444" />} onClick={() => remove(name)} />
                                            </Flex>
                                        </Flex>
                                    ))}
                                </Flex>
                            )}
                        </Form.List>
                    </Card>
                </Flex>
            </Flex>

            <Divider style={{ margin: '32px 0' }} />

            <Flex justify="flex-end">
                <Button
                    type="primary"
                    size="large"
                    loading={loading}
                    htmlType="submit"
                    style={{ backgroundColor: '#879B7E', width: '200px', borderRadius: '8px' }}
                >
                    저장하기
                </Button>
            </Flex>
        </Form>
    );
};
