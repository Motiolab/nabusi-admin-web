import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Flex, Typography, message, Card, Switch, Input, Divider, Alert } from 'antd';
import { Bell, Info, Mail, MessageSquareText } from 'lucide-react';
import type { RootState } from '@/app/store';
import { getNotificationPolicyByCenterId, patchOrCreateNotificationPolicy } from '@/entities/policy/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const NotificationPolicyForm = () => {
    const [form] = Form.useForm();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (selectedCenterId) {
            fetchNotificationPolicy();
        }
    }, [selectedCenterId]);

    const fetchNotificationPolicy = async () => {
        setInitialLoading(true);
        try {
            const res = await getNotificationPolicyByCenterId(selectedCenterId);
            form.setFieldsValue(res.data);
        } catch (error) {
            console.error('Failed to fetch notification policy:', error);
            message.error('알림 정책 정보를 불러오는데 실패했습니다.');
        } finally {
            setInitialLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        if (!selectedCenterId) return;

        setLoading(true);
        try {
            await patchOrCreateNotificationPolicy(selectedCenterId, {
                ...values,
                centerId: selectedCenterId,
                id: form.getFieldValue('id'),
            });
            message.success('알림 정책이 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('Failed to update notification policy:', error);
            message.error('알림 정책 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const NotificationItem = ({ label, name, switchName, description }: {
        label: string;
        name: string;
        switchName: string;
        description: string;
    }) => (
        <Card size="small" variant="outlined" style={{ borderRadius: '12px', marginBottom: '16px' }}>
            <Flex vertical gap={12}>
                <Flex justify="space-between" align="center">
                    <Flex vertical>
                        <Text strong style={{ fontSize: '15px' }}>{label}</Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>{description}</Text>
                    </Flex>
                    <Form.Item name={switchName} valuePropName="checked" noStyle>
                        <Switch />
                    </Form.Item>
                </Flex>
                <Form.Item name={name} noStyle>
                    <TextArea
                        rows={3}
                        style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}
                        placeholder="알림 메세지를 입력해주세요."
                    />
                </Form.Item>
            </Flex>
        </Card>
    );

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
                <Alert
                    message="회원 앱을 통해 발급되는 푸시(Push) 알림으로 별도의 비용이 발생하지 않습니다."
                    type="info"
                    showIcon
                    icon={<Info size={16} />}
                    style={{ borderRadius: '12px' }}
                />

                <section>
                    <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <MessageSquareText size={18} color="#64748B" />
                        수업 관련 알림
                    </Title>
                    <NotificationItem
                        label="대기 → 예약 전환 알림"
                        name="autoReservationText"
                        switchName="isActiveAutoReservation"
                        description="대기 상태에서 공석이 생겨 예약으로 전환되었을 때 발송됩니다."
                    />
                    <NotificationItem
                        label="수업 시작 전 리마인드"
                        name="startClassBeforeText"
                        switchName="isStartClassBefore"
                        description="수업 시작 30분 전에 회원에게 리마인드 알림을 보냅니다."
                    />
                    <NotificationItem
                        label="자동 폐강 알림"
                        name="classAutoCancelText"
                        switchName="isClassAutoCancel"
                        description="수강 인원 미달로 수업이 자동 취소되었을 때 발송됩니다."
                    />
                </section>

                <Divider style={{ margin: '8px 0' }} />

                <section>
                    <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Mail size={18} color="#64748B" />
                        수강권 관련 알림
                    </Title>
                    <NotificationItem
                        label="수강권 만료 5일 전"
                        name="ticketExpireText"
                        switchName="isTicketExpire"
                        description="수강권 유효기간 만료 5일 전 오전 11시에 발송됩니다."
                    />
                    <NotificationItem
                        label="잔여 횟수 부족 알림"
                        name="ticketRemainingText"
                        switchName="isTicketRemaining"
                        description="수강권 잔여 횟수가 3회 이하로 남았을 때 발송됩니다."
                    />
                    <NotificationItem
                        label="정지 기간 만료 알림"
                        name="ticketStopExpireText"
                        switchName="isTicketStopExpire"
                        description="수강권 정지 기간 만료 5일 전 오전 11시에 발송됩니다."
                    />
                </section>

                <Divider style={{ margin: '8px 0' }} />

                <section>
                    <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Bell size={18} color="#64748B" />
                        기타 알림
                    </Title>
                    <NotificationItem
                        label="생일 축하 알림"
                        name="happyBirthdayText"
                        switchName="isHappyBirthday"
                        description="회원의 생일 당일 오전 11시에 축하 알림을 보냅니다."
                    />
                </section>
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
