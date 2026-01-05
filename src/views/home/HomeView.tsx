import { Calendar, Card, Col, Row, Typography } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import dayjs, { Dayjs } from 'dayjs';
import { DailyScheduleWidget } from '@/widgets/dailySchedule/DailyScheduleWidget';
import { LectureReservationWidget } from '@/widgets/lectureReservation/LectureReservationWidget';

const { Title, Text } = Typography;

const HomeView = () => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [selectedLecture, setSelectedLecture] = useState<{ id: number; name: string } | null>(null);

    const onDateChange = (date: Dayjs) => {
        setSelectedDate(date);
    };

    const handleSelectLecture = (id: number, name: string) => {
        setSelectedLecture({ id, name });
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0, fontSize: '24px' }}>나부시 대시보드</Title>
                <Text type="secondary">센터의 실시간 예약 및 수업 정보를 확인하세요.</Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Card
                        style={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: 'none'
                        }}
                    >
                        <Calendar
                            fullscreen={false}
                            value={selectedDate}
                            onChange={onDateChange}
                            style={{ padding: '4px' }}
                        />
                        <div style={{ padding: '16px 4px 4px' }}>
                            <div style={{
                                backgroundColor: '#F8FAFC',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0'
                            }}>
                                <Text strong style={{ display: 'block', color: '#64748B', fontSize: '13px', marginBottom: 4 }}>선택된 날짜</Text>
                                <Text strong style={{ fontSize: '16px', color: '#1E293B' }}>
                                    {selectedDate.format('YYYY년 MM월 DD일')}
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <Card
                        style={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: 'none',
                            minHeight: '600px'
                        }}
                    >
                        <DailyScheduleWidget
                            centerId={selectedCenterId}
                            selectedDate={selectedDate.format('YYYY-MM-DD')}
                            onSelectLecture={handleSelectLecture}
                        />
                    </Card>
                </Col>
            </Row>

            <LectureReservationWidget
                centerId={selectedCenterId}
                lectureId={selectedLecture?.id ?? null}
                lectureName={selectedLecture?.name ?? ''}
                onClose={() => setSelectedLecture(null)}
            />
        </div>
    );
};

export default HomeView;
