import { useState } from 'react';
import {
    Flex,
    Typography,
    DatePicker,
    InputNumber,
    Radio,
    Divider,
    Input,
    Button,
    Space,
    Card,
    Modal
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { IGetWellnessTicketAdminResponseV1 } from '@/entities/wellnessTicket/api';
import { WalletOutlined, SettingOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface ConfigureTicketStepProps {
    ticket: IGetWellnessTicketAdminResponseV1;
    discountValue: number;
    onBack: () => void;
    onSubmit: (data: any) => void;
    loading: boolean;
}

export const ConfigureTicketStep = ({
    ticket,
    discountValue,
    onBack,
    onSubmit,
    loading
}: ConfigureTicketStepProps) => {
    // Basic settings
    const [period, setPeriod] = useState<[Dayjs | null, Dayjs | null]>([
        dayjs(),
        dayjs().add(ticket.usableDate, 'day')
    ]);
    const [totalUsableCnt, setTotalUsableCnt] = useState<number>(ticket.totalUsableCnt);
    const [limitType, setLimitType] = useState<string>(ticket.limitType);
    const [limitCnt, setLimitCnt] = useState<number>(ticket.limitCnt);

    // Payment settings
    const [cardPay, setCardPay] = useState<number>(0);
    const [cashPay, setCashPay] = useState<number>(0);
    const [isCardInstallment, setIsCardInstallment] = useState(false);
    const [cardInstallment, setCardInstallment] = useState<number>(0);
    const [note, setNote] = useState('');

    const finalPrice = Math.floor(ticket.price * (1 - discountValue / 100));
    const paidAmount = cardPay + cashPay;
    const unpaidAmount = finalPrice - paidAmount;

    const handleIssue = () => {
        if (!period[0] || !period[1]) return;

        const performSubmit = () => {
            onSubmit({
                startDate: period[0]!.format("YYYY-MM-DDTHH:mm:00Z"),
                expireDate: period[1]!.format("YYYY-MM-DDTHH:mm:00Z"),
                limitType,
                limitCnt,
                totalUsableCnt,
                discountRate: discountValue,
                totalPayValue: finalPrice,
                unpaidValue: unpaidAmount,
                cardInstallment,
                cardPayValue: cardPay,
                cashPayValue: cashPay,
                note
            });
        };

        if (paidAmount === 0) {
            Modal.confirm({
                title: '발급 확인',
                content: '결제 금액 없이 수강권을 발급하시겠습니까?',
                okText: '발급하기',
                cancelText: '취소',
                onOk: performSubmit,
                centered: true
            });
        } else {
            performSubmit();
        }
    };

    return (
        <Flex gap={24} style={{ height: '600px' }}>
            {/* Left side: Configuration Forms */}
            <div style={{ flex: 1.5, overflowY: 'auto', paddingRight: '8px' }}>
                <Flex vertical gap={32}>
                    {/* Section 1: Usage Settings */}
                    <section>
                        <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
                            <SettingOutlined style={{ color: '#879B7E' }} />
                            <Text strong>수강권 설정</Text>
                        </Flex>
                        <Flex vertical gap={16}>
                            <Flex align="center" gap={12}>
                                <div style={{ width: 100 }}><Text type="secondary">이용 기간</Text></div>
                                <RangePicker
                                    value={period}
                                    onChange={(dates) => setPeriod(dates ? [dates[0], dates[1]] : [null, null])}
                                    style={{ flex: 1, borderRadius: '8px' }}
                                    size="large"
                                />
                            </Flex>
                            <Flex align="center" gap={12}>
                                <div style={{ width: 100 }}><Text type="secondary">가능 횟수</Text></div>
                                <Space>
                                    <InputNumber
                                        min={0}
                                        value={totalUsableCnt}
                                        onChange={(v) => setTotalUsableCnt(v || 0)}
                                        size="large"
                                        style={{ width: 120, borderRadius: '8px' }}
                                    />
                                    <Text>회</Text>
                                </Space>
                            </Flex>
                            <Flex align="start" gap={12}>
                                <div style={{ width: 100, marginTop: 4 }}><Text type="secondary">이용 제한</Text></div>
                                <Flex vertical gap={12}>
                                    <Radio.Group value={limitType} onChange={(e) => setLimitType(e.target.value)}>
                                        <Radio value="WEEK">주간</Radio>
                                        <Radio value="MONTH">월간</Radio>
                                        <Radio value="NONE">제한 없음</Radio>
                                    </Radio.Group>
                                    {limitType !== 'NONE' && (
                                        <Space>
                                            <InputNumber
                                                min={0}
                                                value={limitCnt}
                                                onChange={(v) => setLimitCnt(v || 0)}
                                                size="large"
                                                style={{ width: 120, borderRadius: '8px' }}
                                            />
                                            <Text>회 이용 가능</Text>
                                        </Space>
                                    )}
                                </Flex>
                            </Flex>
                        </Flex>
                    </section>

                    <Divider style={{ margin: 0 }} />

                    {/* Section 2: Payment Details */}
                    <section>
                        <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
                            <WalletOutlined style={{ color: '#879B7E' }} />
                            <Text strong>결제 정보 입력</Text>
                        </Flex>
                        <Flex vertical gap={16}>
                            <Flex align="start" gap={12}>
                                <div style={{ width: 100, marginTop: 8 }}><Text type="secondary">카드 결제</Text></div>
                                <Flex vertical gap={8} style={{ flex: 1 }}>
                                    <Flex gap={8}>
                                        <InputNumber
                                            placeholder="카드 금액"
                                            value={cardPay}
                                            onChange={(v) => setCardPay(v || 0)}
                                            formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={v => Number(v!.replace(/\$\s?|(,*)/g, ''))}
                                            size="large"
                                            style={{ flex: 1, borderRadius: '8px' }}
                                        />
                                        <Button onClick={() => { setCardPay(finalPrice); setCashPay(0); }}>전액</Button>
                                    </Flex>
                                    <Flex align="center" gap={12}>
                                        <Radio.Group value={isCardInstallment} onChange={(e) => setIsCardInstallment(e.target.value)}>
                                            <Radio value={false}>일시불</Radio>
                                            <Radio value={true}>할부</Radio>
                                        </Radio.Group>
                                        {isCardInstallment && (
                                            <Space>
                                                <InputNumber min={0} max={99} value={cardInstallment} onChange={(v) => setCardInstallment(v || 0)} />
                                                <Text>개월</Text>
                                            </Space>
                                        )}
                                    </Flex>
                                </Flex>
                            </Flex>

                            <Flex align="start" gap={12}>
                                <div style={{ width: 100, marginTop: 8 }}><Text type="secondary">현금/이체</Text></div>
                                <Flex gap={8} style={{ flex: 1 }}>
                                    <InputNumber
                                        placeholder="현금 금액"
                                        value={cashPay}
                                        onChange={(v) => setCashPay(v || 0)}
                                        formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={v => Number(v!.replace(/\$\s?|(,*)/g, ''))}
                                        size="large"
                                        style={{ flex: 1, borderRadius: '8px' }}
                                    />
                                    <Button onClick={() => { setCashPay(finalPrice); setCardPay(0); }}>전액</Button>
                                </Flex>
                            </Flex>

                            <Flex align="start" gap={12}>
                                <div style={{ width: 100, marginTop: 8 }}><Text type="secondary">비고</Text></div>
                                <TextArea
                                    placeholder="특이사항을 입력해 주세요."
                                    rows={2}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    style={{ borderRadius: '8px' }}
                                />
                            </Flex>
                        </Flex>
                    </section>
                </Flex>
            </div>

            {/* Right side: Final Check */}
            <Flex vertical style={{ flex: 1 }}>
                <Card
                    style={{
                        height: '100%',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '16px',
                        border: 'none'
                    }}
                    bodyStyle={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '24px'
                    }}
                >
                    <Flex vertical gap={24} style={{ flex: 1 }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>발급 수강권</Text>
                            <Title level={4} style={{ margin: '4px 0 0 0' }}>{ticket.name}</Title>
                            {period[0] && period[1] && (
                                <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginTop: 4 }}>
                                    {period[0].format('YYYY-MM-DD')} ~ {period[1].format('YYYY-MM-DD')}
                                </Text>
                            )}
                        </div>

                        <Flex vertical gap={12}>
                            <Flex justify="space-between">
                                <Text type="secondary">총 결제 금액</Text>
                                <Text strong>{finalPrice.toLocaleString()}원</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">결제 완료</Text>
                                <Text strong style={{ color: '#0F172A' }}>{paidAmount.toLocaleString()}원</Text>
                            </Flex>
                            <Divider style={{ margin: '8px 0' }} />
                            <Flex justify="space-between">
                                <Text strong>미수금</Text>
                                <Text strong style={{ color: unpaidAmount > 0 ? '#EF4444' : '#879B7E', fontSize: '18px' }}>
                                    {unpaidAmount.toLocaleString()}원
                                </Text>
                            </Flex>
                        </Flex>

                        <div style={{ marginTop: 'auto' }}>
                            <Flex vertical gap={12}>
                                <Button
                                    block
                                    size="large"
                                    type="primary"
                                    onClick={handleIssue}
                                    loading={loading}
                                    style={{
                                        height: '56px',
                                        borderRadius: '12px',
                                        backgroundColor: '#879B7E',
                                        borderColor: '#879B7E',
                                        fontSize: '16px',
                                        fontWeight: 600
                                    }}
                                >
                                    수강권 발급하기
                                </Button>
                                <Button block type="text" onClick={onBack}>이전 단계로</Button>
                            </Flex>
                        </div>
                    </Flex>
                </Card>
            </Flex>
        </Flex>
    );
};
