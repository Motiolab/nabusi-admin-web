import { List, Card, Badge, Empty, Spin, Flex, Typography, Collapse, Tag, Divider, Avatar, Image } from 'antd';
import { ClockCircleOutlined, TeamOutlined, EnvironmentOutlined, UserOutlined, PhoneOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getWellnessLectureListByStartDate } from '@/entities/wellnessLecture/api';
import type { IGetWellnessLectureAdminResponseV1 } from '@/entities/wellnessLecture/api';
import { getReservationListByWellnessLectureId } from '@/entities/reservation/api';
import type { IGetReservationListByWellnessLectureIdAdminResponseV1 } from '@/entities/reservation/api';
import { getTeacherDetailById } from '@/entities/teacher/api';
import dayjs from 'dayjs';

const { Text, Title } = Typography;


interface IProps {
    centerId: number;
    selectedDate: string;
    onSelectLecture: (lectureId: number, lectureName: string) => void;
}

interface IWellnessLectureWithReservations extends IGetWellnessLectureAdminResponseV1 {
    reservations: IGetReservationListByWellnessLectureIdAdminResponseV1[];
    teacherProfileImageUrl?: string;
}

export const DailyScheduleWidget = ({ centerId, selectedDate, onSelectLecture }: IProps) => {
    const [lectures, setLectures] = useState<IWellnessLectureWithReservations[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (centerId && selectedDate) {
            fetchLectures();
        }
    }, [centerId, selectedDate]);

    const fetchLectures = async () => {
        setLoading(true);
        try {
            const res = await getWellnessLectureListByStartDate(centerId, selectedDate);

            // Fetch reservations for each lecture
            const lecturesWithReservations = await Promise.all(
                res.data.map(async (lecture) => {
                    try {
                        const reservationRes = await getReservationListByWellnessLectureId(centerId, lecture.id);
                        return {
                            ...lecture,
                            reservations: reservationRes.data
                        };
                    } catch (err) {
                        console.error(`Failed to fetch reservations for lecture ${lecture.id}`, err);
                        return {
                            ...lecture,
                            reservations: []
                        };
                    }
                })
            );

            // Unique teacher IDs
            const teacherIds = Array.from(new Set(lecturesWithReservations.map(l => l.teacherId)));

            // Fetch teacher details
            const teacherMap = new Map<number, string>();
            await Promise.all(
                teacherIds.map(async (tid) => {
                    try {
                        const teacherRes = await getTeacherDetailById(centerId, tid);
                        if (teacherRes.data.imageUrl) {
                            teacherMap.set(tid, teacherRes.data.imageUrl);
                        }
                    } catch (err) {
                        console.error(`Failed to fetch teacher detail for ${tid}`, err);
                    }
                })
            );

            // Merge teacher images
            const finalLectures = lecturesWithReservations.map(l => ({
                ...l,
                teacherProfileImageUrl: teacherMap.get(l.teacherId)
            }));

            // Sort by start time
            const sorted = finalLectures.sort((a, b) =>
                dayjs(a.startDateTime).unix() - dayjs(b.startDateTime).unix()
            );
            setLectures(sorted);
        } catch (error) {
            console.error('Failed to fetch lectures:', error);
        } finally {
            setLoading(false);
        }
    };

    const getReservationStatusStyle = (status: string) => {
        const primaryColor = '#879B7E';
        const primaryBg = 'rgba(135, 155, 126, 0.1)';
        const secondaryColor = '#9CA3AF'; // Using slate-400 equivalent
        const secondaryBg = '#F3F4F6'; // Using slate-100 equivalent

        switch (status) {
            case 'INAPP_RESERVATION':
            case 'INAPP_PAYMENT_RESERVATION':
            case 'ADMIN_RESERVATION':
            case 'ONSITE_RESERVATION':
            case 'CHECK_IN':
                return { color: primaryColor, backgroundColor: primaryBg };
            case 'ADMIN_CANCELED_RESERVATION':
            case 'MEMBER_CANCELED_RESERVATION':
            case 'MEMBER_CANCELED_RESERVATION_REFUND':
            case 'ABSENT':
                return { color: secondaryColor, backgroundColor: secondaryBg };
            default:
                return { color: secondaryColor, backgroundColor: secondaryBg };
        }
    };

    const getReservationStatusText = (status: string) => {
        switch (status) {
            case 'INAPP_RESERVATION': return '인앱 예약';
            case 'INAPP_PAYMENT_RESERVATION': return '인앱 결제 예약';
            case 'ADMIN_RESERVATION': return '관리자 예약';
            case 'ONSITE_RESERVATION': return '현장 예약';
            case 'MEMBER_CANCELED_RESERVATION': return '회원 예약 취소';
            case 'MEMBER_CANCELED_RESERVATION_REFUND': return '회원 예약 취소 및 환불';
            case 'ADMIN_CANCELED_RESERVATION': return '관리자 예약 취소';
            case 'CHECK_IN': return '출석';
            case 'ABSENT': return '결석';
            default: return status;
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ minHeight: '300px' }}>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <div style={{ padding: '0 8px' }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
                <Title level={4} style={{ margin: 0 }}>
                    {dayjs(selectedDate).format('YYYY년 MM월 DD일')} 스케줄
                </Title>
                <Badge count={lectures.length} color="#879B7E" showZero overflowCount={999} />
            </Flex>

            {lectures.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="해당 날짜에 등록된 수업이 없습니다."
                    style={{ marginTop: 60 }}
                />
            ) : (
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={lectures}
                    renderItem={(item) => (
                        <List.Item style={{ marginBottom: 12 }}>
                            <Card
                                hoverable={false}
                                styles={{ body: { padding: 0 } }}
                                style={{
                                    borderRadius: '12px',
                                    border: '1px solid #F1F5F9',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    overflow: 'hidden'
                                }}
                            >
                                <div
                                    style={{ padding: '16px 20px', cursor: 'pointer' }}
                                    onClick={() => onSelectLecture(item.id, item.name)}
                                >
                                    <Flex gap={16} align="start">
                                        {/* Lecture Image */}
                                        {item.lectureImageUrlList && item.lectureImageUrlList.length > 0 ? (
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                flexShrink: 0
                                            }}>
                                                <Image
                                                    src={item.lectureImageUrlList[0]}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    style={{ objectFit: 'cover' }}
                                                    preview={false}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '8px',
                                                backgroundColor: '#F3F4F6',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <EnvironmentOutlined style={{ fontSize: '24px', color: '#CBD5E1' }} />
                                            </div>
                                        )}

                                        <Flex vertical flex={1} justify="space-between" style={{ minHeight: '80px' }}>
                                            <Flex justify="space-between" align="start">
                                                <Flex vertical gap={8}>
                                                    <Badge status={item.isDelete ? "default" : "processing"} color={item.isDelete ? "#CBD5E1" : "#879B7E"} text={
                                                        <Text strong style={{ fontSize: '16px' }}>{item.name}</Text>
                                                    } />

                                                    <Flex gap={16} style={{ color: '#64748B', fontSize: '13px' }}>
                                                        <Flex align="center" gap={4}>
                                                            <ClockCircleOutlined />
                                                            {dayjs(item.startDateTime).format('HH:mm')} - {dayjs(item.endDateTime).format('HH:mm')}
                                                        </Flex>
                                                        <Flex align="center" gap={4}>
                                                            <TeamOutlined />
                                                            {(() => {
                                                                const cancelStatuses = [
                                                                    'ADMIN_CANCELED_RESERVATION',
                                                                    'MEMBER_CANCELED_RESERVATION',
                                                                    'MEMBER_CANCELED_RESERVATION_REFUND'
                                                                ];
                                                                const cancelCount = item.reservations.filter(r => cancelStatuses.includes(r.reservationStatus)).length;
                                                                const activeCount = item.reservations.length - cancelCount;

                                                                return `예약 ${activeCount}${cancelCount > 0 ? ` (취소 ${cancelCount})` : ''} / 정원 ${item.maxReservationCnt}명`;
                                                            })()}
                                                        </Flex>
                                                        <Flex align="center" gap={4}>
                                                            <EnvironmentOutlined />
                                                            {item.room}
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </Flex>

                                            <Flex justify="space-between" align="end" style={{ marginTop: 'auto' }}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>{item.wellnessLectureTypeName}</Text>
                                                <Flex align="center" gap={6}>
                                                    {item.teacherProfileImageUrl && (
                                                        <Avatar src={item.teacherProfileImageUrl} size="small" />
                                                    )}
                                                    <Text strong style={{ color: '#879B7E' }}>{item.teacherName} 강사</Text>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </div>

                                {item.reservations.length > 0 && (
                                    <>
                                        <Divider style={{ margin: 0 }} />
                                        {(() => {
                                            const cancelStatuses = [
                                                'ADMIN_CANCELED_RESERVATION',
                                                'MEMBER_CANCELED_RESERVATION',
                                                'MEMBER_CANCELED_RESERVATION_REFUND'
                                            ];
                                            const activeRez = item.reservations.filter(r => !cancelStatuses.includes(r.reservationStatus));
                                            const cancelRez = item.reservations.filter(r => cancelStatuses.includes(r.reservationStatus));

                                            const renderRezItem = (res: IGetReservationListByWellnessLectureIdAdminResponseV1, isCancel: boolean) => {
                                                const statusStyle = getReservationStatusStyle(res.reservationStatus);
                                                return (
                                                    <Flex
                                                        justify="space-between"
                                                        align="center"
                                                        style={{
                                                            padding: '8px 12px',
                                                            backgroundColor: isCancel ? '#F9FAFB' : '#fff',
                                                            borderRadius: '8px',
                                                            marginBottom: '8px',
                                                            border: '1px solid #F0F0F0',
                                                            opacity: isCancel ? 0.7 : 1
                                                        }}
                                                    >
                                                        <Flex gap={12} align="center">
                                                            <Avatar icon={<UserOutlined />} size="small" style={isCancel ? { backgroundColor: '#D1D5DB' } : {}} />
                                                            <Flex vertical gap={2}>
                                                                <Text strong style={isCancel ? { color: '#6B7280' } : {}}>{res.memberName}</Text>
                                                                <Flex gap={4} align="center">
                                                                    <PhoneOutlined style={{ fontSize: '10px', color: '#9CA3AF' }} />
                                                                    <Text type="secondary" style={{ fontSize: '11px' }}>{res.memberMobile}</Text>
                                                                </Flex>
                                                            </Flex>
                                                        </Flex>
                                                        <Flex align="center" gap={8}>
                                                            <Tag color={res.wellnessTicketIssuanceBackgroundColor} style={{ color: res.wellnessTicketIssuanceTextColor, margin: 0, opacity: isCancel ? 0.8 : 1 }}>
                                                                {res.wellnessTicketIssuanceName}
                                                            </Tag>
                                                            <Tag style={{
                                                                color: statusStyle.color,
                                                                backgroundColor: statusStyle.backgroundColor,
                                                                border: 0,
                                                                margin: 0,
                                                                fontWeight: 600
                                                            }}>
                                                                {getReservationStatusText(res.reservationStatus)}
                                                            </Tag>
                                                        </Flex>
                                                    </Flex>
                                                );
                                            };

                                            return (
                                                <Collapse
                                                    ghost
                                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                                    style={{ backgroundColor: '#FAFAFA' }}
                                                    items={[
                                                        {
                                                            key: '1',
                                                            label: `예약자 목록 (${activeRez.length})`,
                                                            extra: cancelRez.length > 0 ? <Text type="secondary" style={{ fontSize: '13px' }}>취소 ({cancelRez.length})</Text> : null,
                                                            children: (
                                                                <>
                                                                    <List
                                                                        dataSource={activeRez}
                                                                        renderItem={(res) => renderRezItem(res, false)}
                                                                        split={false}
                                                                    />
                                                                    {cancelRez.length > 0 && (
                                                                        <>
                                                                            <Divider style={{ margin: '12px 0 12px 0', borderColor: '#E5E7EB' }} dashed />
                                                                            <div style={{ padding: '0 4px 8px', color: '#9CA3AF', fontSize: '12px' }}>취소된 예약</div>
                                                                            <List
                                                                                dataSource={cancelRez}
                                                                                renderItem={(res) => renderRezItem(res, true)}
                                                                                split={false}
                                                                            />
                                                                        </>
                                                                    )}
                                                                </>
                                                            )
                                                        }
                                                    ]}
                                                />
                                            );
                                        })()}
                                    </>
                                )}
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};
