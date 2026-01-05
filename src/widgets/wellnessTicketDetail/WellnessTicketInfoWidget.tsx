import { Card, Descriptions, Tag, Typography, Flex } from 'antd';
import type { IGetWellnessTicketDetailAdminResponseV1 } from '@/entities/wellnessTicket/api';

const { Title, Text } = Typography;

interface WellnessTicketInfoWidgetProps {
    data: IGetWellnessTicketDetailAdminResponseV1;
}

const ticketTypeMap: Record<string, string> = {
    'COUNT': '횟수권',
    'PERIOD': '기간권',
};

const limitTypeMap: Record<string, string> = {
    'WEEK': '주간',
    'MONTH': '월간',
    'NONE': '제한 없음',
};

export const WellnessTicketInfoWidget = ({ data }: WellnessTicketInfoWidgetProps) => {
    return (
        <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <Descriptions title={<Title level={4} style={{ margin: 0 }}>기본 정보</Title>} column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                <Descriptions.Item label="수강권명">
                    <Text style={{ fontWeight: 600 }}>{data.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="수강권 종류">
                    <Tag color="blue">{ticketTypeMap[data.type] || data.type}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="판매가">
                    <Text style={{ fontWeight: 700, color: '#1E293B' }}>{data.salesPrice.toLocaleString()} 원</Text>
                    {data.discountValue > 0 && (
                        <Text delete style={{ marginLeft: '8px', color: '#94A3B8', fontSize: '12px' }}>
                            {data.price.toLocaleString()} 원 ({data.discountValue}%)
                        </Text>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="사용 기한">
                    <Text>{data.usableDate}일</Text>
                </Descriptions.Item>
                <Descriptions.Item label="이용 가능 횟수">
                    <Text>{data.type === 'COUNT' ? `${data.totalUsableCnt}회` : '-'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="이용 제한">
                    <Text>
                        {data.limitType === 'NONE'
                            ? limitTypeMap[data.limitType]
                            : `${limitTypeMap[data.limitType]} ${data.limitCnt}회`}
                    </Text>
                </Descriptions.Item>
                <Descriptions.Item label="예약 가능 수업" span={2}>
                    <Flex gap={8} wrap="wrap">
                        {data.wellnessClassNameList.map((item) => (
                            <Tag key={item.id} style={{ borderRadius: '4px', backgroundColor: '#F1F5F9', border: 'none', color: '#475569' }}>
                                {item.name}
                            </Tag>
                        ))}
                    </Flex>
                </Descriptions.Item>
                <Descriptions.Item label="상태">
                    <Tag
                        color={!data.isDelete ? 'success' : 'error'}
                        style={{ borderRadius: '20px', padding: '2px 12px', fontWeight: 600 }}
                    >
                        {!data.isDelete ? '판매중' : '판매정지'}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="등록일">
                    <Text style={{ color: '#64748B' }}>{data.createdDate.split('T')[0].replaceAll('-', '.')}</Text>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};
