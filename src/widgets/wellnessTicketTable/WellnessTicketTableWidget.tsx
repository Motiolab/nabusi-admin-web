import { Table, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { IGetWellnessTicketAdminResponseV1 } from '@/entities/wellnessTicket/api';
import type { TableColumnsType } from 'antd';

const { Text } = Typography;

interface WellnessTicketTableWidgetProps {
    data: IGetWellnessTicketAdminResponseV1[];
    loading?: boolean;
}

const ticketTypeMap: Record<string, string> = {
    'COUNT': '횟수권',
    'PERIOD': '기간권',
};

export const WellnessTicketTableWidget = ({ data, loading }: WellnessTicketTableWidgetProps) => {
    const columns: TableColumnsType<IGetWellnessTicketAdminResponseV1> = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            width: 70,
            align: 'center',
            render: (_: any, __: any, index: number) => <Text style={{ color: '#64748B' }}>{index + 1}</Text>,
        },
        {
            title: '유형',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type: string) => (
                <Tag color={type === 'COUNT' ? 'blue' : 'green'} style={{ borderRadius: '4px', fontWeight: 500 }}>
                    {ticketTypeMap[type] || type}
                </Tag>
            ),
        },
        {
            title: '수강권명',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record) => (
                <Link to={`/wellness-ticket/${record.id}`} style={{ fontWeight: 600, color: '#1E293B' }}>
                    {name}
                </Link>
            ),
        },
        {
            title: '판매 가격',
            dataIndex: 'salesPrice',
            key: 'salesPrice',
            width: 140,
            align: 'right',
            render: (price: number) => <Text style={{ fontWeight: 600 }}>{price.toLocaleString()} 원</Text>,
        },
        {
            title: '이용 제한',
            dataIndex: 'limitCnt',
            key: 'limitCnt',
            width: 120,
            render: (cnt: number, record) => (
                <Text>{record.limitType === 'UNLIMITED' ? '제한 없음' : `${cnt}회`}</Text>
            ),
        },
        {
            title: '사용 기한',
            dataIndex: 'usableDate',
            key: 'usableDate',
            width: 120,
            render: (days: number) => <Text>{days}일</Text>,
        },
        {
            title: '등록일',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 140,
            render: (date: string) => <Text style={{ color: '#64748B' }}>{date.split('T')[0].replaceAll('-', '.')}</Text>,
        },
        {
            title: '상태',
            dataIndex: 'isDelete',
            key: 'isDelete',
            width: 120,
            align: 'center',
            render: (isDelete: boolean) => (
                <Tag
                    color={!isDelete ? 'success' : 'error'}
                    style={{
                        borderRadius: '20px',
                        padding: '2px 12px',
                        border: 'none',
                        fontWeight: 600
                    }}
                >
                    {!isDelete ? '판매중' : '판매정지'}
                </Tag>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data.map(item => ({ ...item, key: item.id }))}
            loading={loading}
            pagination={{
                position: ['bottomCenter'],
                pageSize: 10,
                showSizeChanger: false,
                style: { marginTop: '24px' },
            }}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #F1F5F9'
            }}
            scroll={{ x: 1000 }}
        />
    );
};
