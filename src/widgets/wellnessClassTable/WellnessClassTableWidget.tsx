import { Table, Tag, Flex, Typography, Popover } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import type { IGetWellnessLectureAdminResponseV1 } from '@/entities/wellnessLecture/api';
import { formatTimeRange } from '@/shared/lib/format';

const { Text } = Typography;

interface WellnessClassTableWidgetProps {
    data: IGetWellnessLectureAdminResponseV1[];
    loading: boolean;
}

export const WellnessClassTableWidget = ({ data, loading }: WellnessClassTableWidgetProps) => {
    const columns: ColumnsType<IGetWellnessLectureAdminResponseV1> = [
        {
            title: 'No.',
            key: 'no',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: '종류',
            key: 'type',
            width: 120,
            render: (_, record) => (
                <Flex align="center" gap={4}>
                    <Text style={{ fontSize: '14px' }}>{record.wellnessLectureTypeName}</Text>
                    <Popover
                        content={<div style={{ maxWidth: '200px' }}>{record.wellnessLectureTypeDescription}</div>}
                        title="설명"
                        trigger="hover"
                    >
                        <Info size={14} style={{ color: '#94A3B8', cursor: 'help' }} />
                    </Popover>
                </Flex>
            ),
        },
        {
            title: '수업명',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => (
                <Link to={`/wellness-lecture/detail/${record.id}`}>
                    <Text strong style={{ color: '#879B7E' }}>{text}</Text>
                </Link>
            ),
        },
        {
            title: '담당 강사',
            dataIndex: 'teacherName',
            key: 'teacherName',
            width: 120,
            render: (text, record) => (
                <Link to={`/teacher/detail/${record.teacherId}`}>
                    <Text style={{ color: '#64748B' }}>{text}</Text>
                </Link>
            ),
        },
        {
            title: '수업 시간',
            key: 'time',
            width: 200,
            render: (_, record) => (
                <Text style={{ fontSize: '13px' }}>
                    {formatTimeRange(record.startDateTime, record.endDateTime)}
                </Text>
            ),
        },
        {
            title: '정원',
            dataIndex: 'maxReservationCnt',
            key: 'maxReservationCnt',
            width: 100,
            align: 'center',
            render: (cnt) => `${cnt}명`,
        },
        {
            title: '진행 여부',
            dataIndex: 'isDelete',
            key: 'status',
            width: 100,
            align: 'center',
            render: (isDelete) => (
                !isDelete ? (
                    <Tag color="#FAFCF9" style={{ color: '#879B7E', border: '1px solid #D1DBCE', borderRadius: '4px', margin: 0 }}>
                        진행
                    </Tag>
                ) : (
                    <Tag color="#FFF1F2" style={{ color: '#E11D48', border: '1px solid #FFE4E6', borderRadius: '4px', margin: 0 }}>
                        폐강
                    </Tag>
                )
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
            locale={{ emptyText: '해당 날짜의 수업이 없습니다.' }}
        />
    );
};
