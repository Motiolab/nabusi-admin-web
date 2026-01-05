import { List, Card, Badge, Empty, Spin, Flex, Typography } from 'antd';
import { ClockCircleOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getWellnessLectureListByStartDate } from '@/entities/wellnessLecture/api';
import type { IGetWellnessLectureAdminResponseV1 } from '@/entities/wellnessLecture/api';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface IProps {
    centerId: number;
    selectedDate: string;
    onSelectLecture: (lectureId: number, lectureName: string) => void;
}

export const DailyScheduleWidget = ({ centerId, selectedDate, onSelectLecture }: IProps) => {
    const [lectures, setLectures] = useState<IGetWellnessLectureAdminResponseV1[]>([]);
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
            // Sort by start time
            const sorted = res.data.sort((a, b) =>
                dayjs(a.startDateTime).unix() - dayjs(b.startDateTime).unix()
            );
            setLectures(sorted);
        } catch (error) {
            console.error('Failed to fetch lectures:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ minHeight: '300px' }}>
                <Spin size="large" tip="수업 정보를 불러오는 중..." />
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
                                hoverable
                                onClick={() => onSelectLecture(item.id, item.name)}
                                bodyStyle={{ padding: '16px 20px' }}
                                style={{
                                    borderRadius: '12px',
                                    border: '1px solid #F1F5F9',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                            >
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
                                                정원 {item.maxReservationCnt}명
                                            </Flex>
                                            <Flex align="center" gap={4}>
                                                <EnvironmentOutlined />
                                                {item.room}
                                            </Flex>
                                        </Flex>
                                    </Flex>

                                    <Flex vertical align="end" gap={4}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>{item.wellnessLectureTypeName}</Text>
                                        <Text strong style={{ color: '#879B7E' }}>{item.teacherName} 강사</Text>
                                    </Flex>
                                </Flex>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};
