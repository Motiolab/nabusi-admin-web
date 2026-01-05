import { Table, Tag, Typography, Flex, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { IGetWellnessTicketIssuanceListByWellnessTicketIdAdminResponseV1 } from '@/entities/wellnessTicketIssuance/api';
import type { TableColumnsType } from 'antd';

const { Text } = Typography;

interface WellnessTicketIssuanceTableWidgetProps {
    data: IGetWellnessTicketIssuanceListByWellnessTicketIdAdminResponseV1[];
    loading?: boolean;
    searchText: string;
    onSearchChange: (value: string) => void;
}

const ticketTypeMap: Record<string, string> = {
    'COUNT': '횟수권',
    'PERIOD': '기간권',
};

export const WellnessTicketIssuanceTableWidget = ({ data, loading, searchText, onSearchChange }: WellnessTicketIssuanceTableWidgetProps) => {
    const columns: TableColumnsType<IGetWellnessTicketIssuanceListByWellnessTicketIdAdminResponseV1> = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            width: 70,
            align: 'center',
            render: (_: any, __: any, index: number) => <Text style={{ color: '#64748B' }}>{index + 1}</Text>,
        },
        {
            title: '이름',
            dataIndex: 'memberName',
            key: 'memberName',
            render: (name: string) => <Text style={{ fontWeight: 600 }}>{name}</Text>,
        },
        {
            title: '전화번호',
            dataIndex: 'mobile',
            key: 'mobile',
            render: (mobile: string) => <Text>{mobile}</Text>,
        },
        {
            title: '수강권',
            dataIndex: 'wellnessTicketIssuanceName',
            key: 'wellnessTicketIssuanceName',
            render: (name: string, record) => (
                <Link to={`/wellness-ticket-issuance/update/${record.id}`} style={{ fontWeight: 600, color: '#879B7E' }}>
                    {name}
                </Link>
            ),
        },
        {
            title: '구분',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Text>{ticketTypeMap[type] || type}</Text>,
        },
        {
            title: '잔여',
            dataIndex: 'remainingDate',
            key: 'remainingDate',
            width: 300,
            render: (_: any, record) => (
                <Flex gap={8}>
                    <Tag bordered={false} style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>
                        {record.remainingDate}일 남음
                    </Tag>
                    <Tag bordered={false} style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>
                        {record.remainingCnt}회 / {record.totalUsableCnt}회
                    </Tag>
                    {record.limitType !== 'NONE' && (
                        <Tag bordered={false} color="error" style={{ opacity: 0.8 }}>
                            {record.limitType === 'WEEK' ? '주간' : '월간'} {record.limitCnt}회 제한
                        </Tag>
                    )}
                </Flex>
            ),
        },
        {
            title: '결제일',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (date: string) => <Text style={{ color: '#64748B' }}>{date?.split('T')[0]}</Text>,
        },
        {
            title: '상태',
            key: 'status',
            align: 'center',
            render: (_: any, record) => (
                <Flex gap={4} justify="center">
                    {!record.isDelete ? (
                        <Tag color="processing" bordered={false}>이용중</Tag>
                    ) : (
                        <Tag color="default" bordered={false}>
                            {record.remainingCnt > 0 ? '사용 불가' : '사용 완료'}
                        </Tag>
                    )}
                    {record.unpaidValue > 0 && <Tag color="error" bordered={false}>미수금</Tag>}
                </Flex>
            ),
        },
    ];

    const filteredData = data.filter(item =>
        item.memberName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.mobile.includes(searchText)
    );

    return (
        <Flex vertical gap={16}>
            <Flex justify="space-between" align="center">
                <Text style={{ fontSize: '18px', fontWeight: 700 }}>발급 목록 ({filteredData.length})</Text>
                <Input
                    placeholder="이름 또는 휴대폰번호 검색"
                    prefix={<Search size={16} style={{ color: '#94A3B8' }} />}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{ width: '300px', height: '40px', borderRadius: '8px' }}
                />
            </Flex>
            <Table
                columns={columns}
                dataSource={filteredData.map(item => ({ ...item, key: item.id }))}
                loading={loading}
                pagination={{
                    position: ['bottomCenter'],
                    pageSize: 10,
                    showSizeChanger: false,
                }}
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #F1F5F9'
                }}
                scroll={{ x: 1000 }}
            />
        </Flex>
    );
};
