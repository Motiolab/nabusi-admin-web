import { Table, Tag, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import type { IGetTeacherListByCenterIdAdminResponseV1 } from '@/entities/teacher/api';

const { Text } = Typography;

interface TeacherTableWidgetProps {
    data: IGetTeacherListByCenterIdAdminResponseV1[];
    loading: boolean;
}

export const TeacherTableWidget = ({ data, loading }: TeacherTableWidgetProps) => {
    const columns: ColumnsType<IGetTeacherListByCenterIdAdminResponseV1> = [
        {
            title: 'No.',
            key: 'no',
            width: 70,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: '이름 (닉네임)',
            key: 'nameInfo',
            width: 200,
            render: (_, record) => (
                <Link to={`/teacher/detail/${record.id}`}>
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ color: '#879B7E' }}>{record.name}</Text>
                        {record.nickName && <Text type="secondary" style={{ fontSize: '12px' }}>({record.nickName})</Text>}
                    </Space>
                </Link>
            ),
        },
        {
            title: '담당 수업 수',
            dataIndex: 'lectureCnt',
            key: 'lectureCnt',
            width: 120,
            align: 'center',
            render: (cnt) => <Tag color="blue" style={{ borderRadius: '4px', border: 'none' }}>{cnt}개</Tag>,
        },
        {
            title: '휴대폰 번호',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 160,
        },
        {
            title: '등록일',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 140,
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: '상태',
            dataIndex: 'isDelete',
            key: 'status',
            width: 100,
            render: (isDelete) => (
                isDelete ? <Tag color="error">삭제됨</Tag> : <Tag color="success">활성</Tag>
            ),
        }
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
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
            scroll={{ x: 800 }}
        />
    );
};
