import { Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import type { IGetCenterNoticeListByCenterIdAdminResponseV1 } from '@/entities/notice/api';

const { Text } = Typography;

interface NoticeTableWidgetProps {
    dataSource: IGetCenterNoticeListByCenterIdAdminResponseV1[];
    loading: boolean;
}

export const NoticeTableWidget = ({ dataSource, loading }: NoticeTableWidgetProps) => {
    const columns: ColumnsType<IGetCenterNoticeListByCenterIdAdminResponseV1> = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            width: 70,
            align: 'center',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: IGetCenterNoticeListByCenterIdAdminResponseV1) => (
                <Link to={`/notice/update/${record.id}`} style={{ color: '#879B7E', fontWeight: 600 }}>
                    {text}
                </Link>
            ),
        },
        {
            title: '내용',
            dataIndex: 'content',
            key: 'content',
            render: (content: string) => (
                <Text ellipsis={{ tooltip: content }} style={{ maxWidth: '300px', color: '#64748B' }}>
                    {content}
                </Text>
            ),
        },
        {
            title: '작성일',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 120,
            render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: '작성자',
            dataIndex: 'registerName',
            key: 'registerName',
            width: 100,
            render: (name: string) => <Text style={{ color: '#64748B' }}>{name}</Text>,
        },
        {
            title: '팝업',
            dataIndex: 'isPopup',
            key: 'isPopup',
            width: 90,
            align: 'center',
            render: (isPopup: boolean) => (
                isPopup ? <Tag color="blue" bordered={false} style={{ borderRadius: '6px' }}>팝업</Tag> : null
            ),
        },
        {
            title: '상태',
            dataIndex: 'isDelete',
            key: 'isDelete',
            width: 90,
            align: 'center',
            render: (isDelete: boolean) => (
                !isDelete
                    ? <Tag color="green" bordered={false} style={{ borderRadius: '6px' }}>게시중</Tag>
                    : <Tag color="default" bordered={false} style={{ borderRadius: '6px' }}>미게시</Tag>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={dataSource.map(item => ({ ...item, key: item.id }))}
            loading={loading}
            pagination={{
                pageSize: 10,
                position: ['bottomCenter'],
                showSizeChanger: false,
            }}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #F1F5F9'
            }}
        />
    );
};
