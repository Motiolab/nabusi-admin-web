import { Table, Tag, Flex, Typography, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import type { IGetAllMemberListByCenterIdAdminResponseV1, IWellnessTicketIssuance } from '@/entities/member/api';

const { Text } = Typography;

export const MemberTableWidget = ({ data, loading }: { data: IGetAllMemberListByCenterIdAdminResponseV1[], loading: boolean }) => {
    const columns: ColumnsType<IGetAllMemberListByCenterIdAdminResponseV1> = [
        {
            title: 'No.',
            key: 'no',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            render: (text, record) => (
                <Link to={`/member/detail/${record.id}`}>
                    <Text strong style={{ color: '#879B7E' }}>{text}</Text>
                </Link>
            ),
        },
        {
            title: '휴대폰 번호',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 160,
        },
        {
            title: '유효 수강권',
            dataIndex: 'wellnessTicketIssuanceList',
            key: 'tickets',
            width: 160,
            render: (tickets: IWellnessTicketIssuance[]) => (
                <Flex vertical gap={8}>
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <Flex key={ticket.id} gap={8} align="center">
                                <Tag color="#F8FAFC" style={{ color: '#475569', border: '1px solid #E2E8F0', borderRadius: '4px', margin: 0 }}>
                                    {ticket.name}
                                </Tag>
                                <Tag color="#FAFCF9" style={{ color: '#879B7E', border: '1px solid #D1DBCE', borderRadius: '4px', margin: 0 }}>
                                    {ticket.remainingDate}일 남음
                                </Tag>
                                <Tag color="#F1F5F9" style={{ color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '4px', margin: 0 }}>
                                    {ticket.remainingCnt}회 / {ticket.totalUsableCnt}회
                                </Tag>
                            </Flex>
                        ))
                    ) : (
                        <Text type="secondary">-</Text>
                    )}
                </Flex>
            ),
        },
        {
            title: '메모',
            dataIndex: 'memberMemoList',
            key: 'memo',
            width: 160,
            render: (memos) => (
                <div style={{ maxWidth: 300 }}>
                    {memos.length > 0 ? (
                        <Text ellipsis={{ tooltip: memos[0].content }} type="secondary" style={{ fontSize: '13px' }}>
                            {memos[0].content}
                        </Text>
                    ) : (
                        <Text type="secondary">-</Text>
                    )}
                </div>
            ),
        },
        {
            title: '역할',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 120,
            render: (role) => <Badge status="default" text={role} />,
        },
        {
            title: '등록일',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 120,
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1330 }}
            pagination={{
                pageSize: 10,
                position: ['bottomCenter'],
                showSizeChanger: false,
            }}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
        />
    );
};
