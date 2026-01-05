import { Drawer, Table, Tag, Typography, Empty, Flex, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getReservationListByWellnessLectureId } from '@/entities/reservation/api';
import type { IGetReservationListByWellnessLectureIdAdminResponseV1 } from '@/entities/reservation/api';

const { Text, Title } = Typography;

interface IProps {
    centerId: number;
    lectureId: number | null;
    lectureName: string;
    onClose: () => void;
}

export const LectureReservationWidget = ({ centerId, lectureId, lectureName, onClose }: IProps) => {
    const [reservations, setReservations] = useState<IGetReservationListByWellnessLectureIdAdminResponseV1[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (centerId && lectureId) {
            fetchReservations();
        }
    }, [centerId, lectureId]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await getReservationListByWellnessLectureId(centerId, lectureId!);
            setReservations(res.data);
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: '회원명',
            dataIndex: 'memberName',
            key: 'memberName',
            render: (text: string, record: IGetReservationListByWellnessLectureIdAdminResponseV1) => (
                <Flex vertical>
                    <Text strong>{text}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{record.memberMobile}</Text>
                </Flex>
            ),
        },
        {
            title: '수강권',
            dataIndex: 'wellnessTicketIssuanceName',
            key: 'wellnessTicketIssuanceName',
            render: (text: string, record: IGetReservationListByWellnessLectureIdAdminResponseV1) => (
                <Tag
                    color={record.wellnessTicketIssuanceBackgroundColor || 'blue'}
                    style={{
                        color: record.wellnessTicketIssuanceTextColor,
                        borderRadius: '4px',
                        border: 'none',
                        fontWeight: '500'
                    }}
                >
                    {text}
                </Tag>
            ),
        },
        {
            title: '상태',
            dataIndex: 'reservationStatus',
            key: 'reservationStatus',
            render: (status: string) => {
                let color = 'default';
                let label = status;

                if (status === 'RESERVATION') {
                    color = 'processing';
                    label = '예약완료';
                } else if (status === 'ATTENDANCE') {
                    color = 'success';
                    label = '출석';
                } else if (status === 'ABSENCE') {
                    color = 'error';
                    label = '결석';
                } else if (status === 'CANCEL') {
                    color = 'warning';
                    label = '취소';
                }

                return <Tag color={color}>{label}</Tag>;
            },
        },
    ];

    return (
        <Drawer
            title={
                <Flex vertical gap={4}>
                    <Title level={5} style={{ margin: 0 }}>{lectureName}</Title>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: '400' }}>예약 및 출석 현황</Text>
                </Flex>
            }
            placement="right"
            onClose={onClose}
            open={!!lectureId}
            width={480}
            bodyStyle={{ padding: '0 24px' }}
        >
            {loading ? (
                <Flex justify="center" align="center" style={{ height: '300px' }}>
                    <Spin tip="예약 목록을 불러오는 중..." />
                </Flex>
            ) : reservations.length === 0 ? (
                <Empty
                    description="예약된 현황이 없습니다."
                    style={{ marginTop: 100 }}
                />
            ) : (
                <Table
                    dataSource={reservations}
                    columns={columns}
                    rowKey="reservationId"
                    pagination={false}
                    style={{ marginTop: 16 }}
                />
            )}
        </Drawer>
    );
};
