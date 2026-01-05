import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Flex, Typography, message, Card, Select, Divider, Checkbox } from 'antd';
import { CalendarClock, UserX } from 'lucide-react';
import type { RootState } from '@/app/store';
import { getPolicyClassByCenterId, updatePolicyClassByCenterId } from '@/entities/policy/api';
import type { IClassPolicy } from '@/entities/policy/api';

const { Text } = Typography;

export const ClassPolicyForm = () => {
    const [form] = Form.useForm();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (selectedCenterId) {
            fetchClassPolicy();
        }
    }, [selectedCenterId]);

    const fetchClassPolicy = async () => {
        setInitialLoading(true);
        try {
            const res = await getPolicyClassByCenterId(selectedCenterId);
            form.setFieldsValue({
                ...res.data,
                reservationStart: String(res.data.reservationStart),
                reservationEnd: String(res.data.reservationEnd),
                reservationCancelLimit: String(res.data.reservationCancelLimit),
                autoReserveBeforeClassTime: String(res.data.autoReserveBeforeClassTime),
                autoAbsentLimit: String(res.data.autoAbsentLimit),
            });
        } catch (error) {
            console.error('Failed to fetch class policy:', error);
            message.error('수업 정책 정보를 불러오는데 실패했습니다.');
        } finally {
            setInitialLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        if (!selectedCenterId) return;

        setLoading(true);
        try {
            const request: IClassPolicy = {
                id: form.getFieldValue('id'),
                centerId: selectedCenterId,
                reservationStart: Number(values.reservationStart),
                reservationEnd: Number(values.reservationEnd),
                reservationCancelLimit: Number(values.reservationCancelLimit),
                autoReserveBeforeClassTime: Number(values.autoReserveBeforeClassTime),
                autoAbsentLimit: Number(values.autoAbsentLimit),
                isActiveAutoReservation: values.isActiveAutoReservation,
            };

            await updatePolicyClassByCenterId(selectedCenterId, request);
            message.success('수업 정책이 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('Failed to update class policy:', error);
            message.error('수업 정책 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const generateOptions = (start: number, end: number, step: number, suffix: string) => {
        const options = [];
        for (let i = start; i <= end; i += step) {
            options.push({ value: String(i), label: `${i}${suffix}` });
        }
        return options;
    };

    if (initialLoading) {
        return <Card loading={true} />;
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: '800px' }}
        >
            <Flex vertical gap={24}>
                <Card
                    title={
                        <Flex align="center" gap={8}>
                            <CalendarClock size={20} color="#1E293B" />
                            <Text strong>예약 시간 정책</Text>
                        </Flex>
                    }
                    variant="outlined"
                    style={{ borderRadius: '16px' }}
                >
                    <Flex vertical gap={24}>
                        <Flex vertical gap={8}>
                            <Text strong>예약 가능 시간</Text>
                            <Flex align="center" gap={12}>
                                <Text type="secondary">수업 시작</Text>
                                <Form.Item name="reservationStart" noStyle>
                                    <Select style={{ width: 100 }} options={generateOptions(1, 30, 1, '일')} />
                                </Form.Item>
                                <Text type="secondary">전부터 - 수업 시작</Text>
                                <Form.Item name="reservationEnd" noStyle>
                                    <Select style={{ width: 100 }} options={generateOptions(0, 60, 5, '분')} />
                                </Form.Item>
                                <Text type="secondary">후까지 예약 가능합니다.</Text>
                            </Flex>
                        </Flex>

                        <Divider style={{ margin: 0 }} />

                        <Flex vertical gap={8}>
                            <Text strong>예약 취소 가능 시간</Text>
                            <Flex align="center" gap={12}>
                                <Text type="secondary">수업 시작</Text>
                                <Form.Item name="reservationCancelLimit" noStyle>
                                    <Select style={{ width: 100 }} options={generateOptions(0, 120, 5, '분')} />
                                </Form.Item>
                                <Text type="secondary">전까지 취소 가능합니다.</Text>
                            </Flex>
                        </Flex>

                        <Divider style={{ margin: 0 }} />

                        <Flex vertical gap={8}>
                            <Text strong>예약 대기 정책</Text>
                            <Flex align="center" gap={12}>
                                <Text type="secondary">공석 발생 시 수업 시작</Text>
                                <Form.Item name="autoReserveBeforeClassTime" noStyle>
                                    <Select style={{ width: 100 }} options={generateOptions(0, 120, 5, '분')} />
                                </Form.Item>
                                <Text type="secondary">전까지 자동 예약됩니다.</Text>
                                <Form.Item name="isActiveAutoReservation" valuePropName="checked" noStyle>
                                    <Checkbox>예약 대기 사용 안함</Checkbox>
                                </Form.Item>
                            </Flex>
                        </Flex>
                    </Flex>
                </Card>

                <Card
                    title={
                        <Flex align="center" gap={8}>
                            <UserX size={20} color="#1E293B" />
                            <Text strong>자동 결석 정책</Text>
                        </Flex>
                    }
                    variant="outlined"
                    style={{ borderRadius: '16px' }}
                >
                    <Flex align="center" gap={12}>
                        <Text type="secondary">수업 시작</Text>
                        <Form.Item name="autoAbsentLimit" noStyle>
                            <Select style={{ width: 100 }} options={generateOptions(0, 60, 5, '분')} />
                        </Form.Item>
                        <Text type="secondary">후까지 출석하지 않으면 자동 결석 처리됩니다.</Text>
                    </Flex>
                </Card>
            </Flex>

            <Divider style={{ margin: '32px 0' }} />

            <Flex justify="flex-end">
                <Button
                    type="primary"
                    size="large"
                    loading={loading}
                    htmlType="submit"
                    style={{ backgroundColor: '#1E293B', width: '200px', borderRadius: '8px' }}
                >
                    저장하기
                </Button>
            </Flex>
        </Form>
    );
};
