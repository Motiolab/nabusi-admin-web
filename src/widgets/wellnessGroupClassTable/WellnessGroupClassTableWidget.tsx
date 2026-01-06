import { Table, Tag, Typography, Flex } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import type { IGetWellnessClassAllAdminResponseV1 } from '@/entities/wellnessClass/api';

const { Text } = Typography;

interface WellnessGroupClassTableWidgetProps {
    data: IGetWellnessClassAllAdminResponseV1[];
    loading: boolean;
}

export const WellnessGroupClassTableWidget = ({ data, loading }: WellnessGroupClassTableWidgetProps) => {
    const columns: ColumnsType<IGetWellnessClassAllAdminResponseV1> = [
        {
            title: 'No.',
            key: 'no',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: '종류',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (text) => <Text style={{ fontSize: '14px' }}>{text}</Text>,
        },
        {
            title: '수업명',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => (
                <Link to={`/wellness-class/detail/${record.id}`}>
                    <Text strong style={{ color: '#879B7E' }}>{text}</Text>
                </Link>
            ),
        },
        {
            title: '설명',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (text) => <Text type="secondary" ellipsis={{ tooltip: text }} style={{ fontSize: '13px' }}>{text}</Text>,
        },
        {
            title: '담당 강사',
            dataIndex: 'teacherName',
            key: 'teacherName',
            width: 120,
            render: (text) => <Text style={{ color: '#64748B' }}>{text}</Text>,
        },
        {
            title: '강의실',
            dataIndex: 'room',
            key: 'room',
            width: 120,
            render: (text) => <Text style={{ color: '#64748B' }}>{text}</Text>,
        },
        {
            title: '이용 가능 수강권',
            dataIndex: 'ticketList',
            key: 'ticketList',
            render: (ticketList: IGetWellnessClassAllAdminResponseV1['ticketList']) => (
                <Flex gap={4} wrap="wrap">
                    {ticketList.map((ticket, index) => (
                        <Tag
                            key={index}
                            style={{
                                margin: 0,
                                backgroundColor: ticket.backgroundColor,
                                color: ticket.textColor,
                                border: `1px solid ${ticket.backgroundColor}`
                            }}
                        >
                            {ticket.name}
                        </Tag>
                    ))}
                </Flex>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            pagination={{
                pageSize: 10,
                position: ['bottomCenter'],
                showSizeChanger: false,
            }}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                border: '1px solid #F1F5F9'
            }}
            locale={{ emptyText: '등록된 그룹 수업이 없습니다.' }}
        />
    );
};
