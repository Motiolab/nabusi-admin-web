import { useState, useMemo } from 'react';
import {
    Input,
    Row,
    Col,
    Typography,
    Flex,
    Card,
    Tag,
    Button,
    Empty,
    InputNumber,
    Space
} from 'antd';
import { SearchOutlined, CheckCircleFilled } from '@ant-design/icons';
import type { IGetWellnessTicketAdminResponseV1 } from '@/entities/wellnessTicket/api';

const { Text, Title } = Typography;

interface SelectTicketStepProps {
    tickets: IGetWellnessTicketAdminResponseV1[];
    selectedTicketId?: number;
    discountValue: number;
    onSelect: (ticket: IGetWellnessTicketAdminResponseV1) => void;
    onDiscountChange: (value: number) => void;
    onNext: () => void;
}

export const SelectTicketStep = ({
    tickets,
    selectedTicketId,
    discountValue,
    onSelect,
    onDiscountChange,
    onNext
}: SelectTicketStepProps) => {
    const [searchText, setSearchText] = useState('');

    const filteredTickets = useMemo(() => {
        return tickets.filter(t =>
            !t.isDelete && t.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [tickets, searchText]);

    const selectedTicket = useMemo(() => {
        return tickets.find(t => t.id === selectedTicketId);
    }, [tickets, selectedTicketId]);

    const finalPrice = useMemo(() => {
        if (!selectedTicket) return 0;
        const price = selectedTicket.price;
        return discountValue === 0 ? price : price - (price * (discountValue / 100));
    }, [selectedTicket, discountValue]);

    return (
        <Flex gap={24} style={{ height: '600px' }}>
            {/* Left side: Ticket List */}
            <Flex vertical gap={16} style={{ flex: 1.5 }}>
                <Input
                    placeholder="수강권명으로 검색"
                    prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large"
                    style={{ borderRadius: '8px' }}
                />

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                    {filteredTickets.length > 0 ? (
                        <Row gutter={[12, 12]}>
                            {filteredTickets.map((ticket) => (
                                <Col span={8} key={ticket.id}>
                                    <Card
                                        hoverable
                                        size="small"
                                        style={{
                                            borderRadius: '12px',
                                            border: selectedTicketId === ticket.id ? '2px solid #879B7E' : '1px solid #E2E8F0',
                                            position: 'relative',
                                            height: '100%',
                                            transition: 'all 0.2s'
                                        }}
                                        onClick={() => onSelect(ticket)}
                                    >
                                        {selectedTicketId === ticket.id && (
                                            <CheckCircleFilled
                                                style={{
                                                    position: 'absolute',
                                                    top: -8,
                                                    right: -8,
                                                    color: '#879B7E',
                                                    fontSize: '20px',
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%'
                                                }}
                                            />
                                        )}
                                        <Flex vertical gap={4}>
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                {ticket.type === 'COUNT' ? '횟수형' : '기간형'}
                                            </Text>
                                            <Text strong ellipsis style={{ fontSize: '14px' }}>
                                                {ticket.name}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                {ticket.price.toLocaleString()}원
                                            </Text>
                                        </Flex>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty description="수강권이 없습니다." style={{ marginTop: 48 }} />
                    )}
                </div>
            </Flex>

            {/* Right side: Summary & Discount */}
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
                    {selectedTicket ? (
                        <>
                            <Flex vertical gap={24} style={{ flex: 1 }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>선택된 수강권</Text>
                                    <Title level={4} style={{ margin: '4px 0 0 0' }}>{selectedTicket.name}</Title>
                                    <Tag color="#FAFCF9" style={{ color: '#879B7E', border: '1px solid #D1DBCE', marginTop: 8 }}>
                                        {selectedTicket.type === 'COUNT' ? '횟수형' : '기간형'}
                                    </Tag>
                                </div>

                                <Flex vertical gap={8}>
                                    <Text strong type="secondary">기본 금액</Text>
                                    <Title level={3} style={{ margin: 0 }}>{selectedTicket.price.toLocaleString()}원</Title>
                                </Flex>

                                <Flex vertical gap={8}>
                                    <Text strong type="secondary">할인율 설정</Text>
                                    <Space size={8} align="center">
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            value={discountValue}
                                            onChange={(v) => onDiscountChange(v || 0)}
                                            size="large"
                                            style={{ width: 120, borderRadius: '8px' }}
                                        />
                                        <Text strong style={{ fontSize: '18px' }}>%</Text>
                                    </Space>
                                </Flex>

                                <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px dashed #CBD5E1' }}>
                                    <Flex justify="space-between" align="center">
                                        <Text strong>최종 결제 금액</Text>
                                        <Title level={3} style={{ margin: 0, color: '#879B7E' }}>
                                            {finalPrice.toLocaleString()}원
                                        </Title>
                                    </Flex>
                                </div>
                            </Flex>

                            <Button
                                type="primary"
                                size="large"
                                onClick={onNext}
                                style={{
                                    height: '56px',
                                    borderRadius: '12px',
                                    backgroundColor: '#879B7E',
                                    borderColor: '#879B7E',
                                    marginTop: 24,
                                    fontSize: '16px',
                                    fontWeight: 600
                                }}
                            >
                                다음 단계로
                            </Button>
                        </>
                    ) : (
                        <Flex vertical align="center" justify="center" style={{ height: '100%' }} gap={16}>
                            <div style={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                backgroundColor: '#E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <CheckCircleFilled style={{ fontSize: '32px', color: '#94A3B8' }} />
                            </div>
                            <Text type="secondary">발급할 수강권을 선택해주세요.</Text>
                        </Flex>
                    )}
                </Card>
            </Flex>
        </Flex>
    );
};
