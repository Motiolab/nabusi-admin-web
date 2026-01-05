import { Drawer, Table, Tag, Typography, Empty, Flex, Spin, Button, Card, Col, Row, Select, Modal, message, Descriptions, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons';
import { getReservationListByWellnessLectureId, createReservation, cancelReservation } from '@/entities/reservation/api';
import type { IGetReservationListByWellnessLectureIdAdminResponseV1 } from '@/entities/reservation/api';
import { getAllMemberListByCenterId } from '@/entities/member/api';
import type { IGetAllMemberListByCenterIdAdminResponseV1 } from '@/entities/member/api';
import dayjs from 'dayjs';
import { getWellnessLectureDetailById } from '@/entities/wellnessLecture/api';
import type { IGetWellnessLectureDetailAdminResponseV1 } from '@/entities/wellnessLecture/api';

const { Text, Title } = Typography;

interface IProps {
    centerId: number;
    lectureId: number | null;
    lectureName: string;
    onClose: () => void;
}

export const LectureReservationWidget = ({ centerId, lectureId, lectureName, onClose }: IProps) => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<IGetReservationListByWellnessLectureIdAdminResponseV1[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [lecture, setLecture] = useState<IGetWellnessLectureDetailAdminResponseV1 | null>(null);

    // Reservation Modal State
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [reservationStep, setReservationStep] = useState(1);
    const [members, setMembers] = useState<IGetAllMemberListByCenterIdAdminResponseV1[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [memberSearchText, setMemberSearchText] = useState('');

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

            // Also fetch lecture details for the summary
            const lectureRes = await getWellnessLectureDetailById(centerId, lectureId!);
            setLecture(lectureRes.data);
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const res = await getAllMemberListByCenterId(centerId);
            setMembers(res.data);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };

    const handleOpenReservationModal = () => {
        setIsReservationModalOpen(true);
        setReservationStep(1);
        setSelectedMemberId(null);
        setSelectedTicketId(null);
        setMemberSearchText('');
        if (members.length === 0) {
            fetchMembers();
        }
    };

    const handleCreateReservation = async () => {
        if (!selectedMemberId) {
            message.warning('예약자를 먼저 선택해주세요.');
            return;
        }

        if (reservationStep === 1) {
            setReservationStep(2);
            return;
        }

        setCreateLoading(true);
        try {
            await createReservation({
                centerId: centerId,
                memberId: selectedMemberId,
                wellnessLectureId: lectureId!,
                wellnessTicketIssuanceId: selectedTicketId || undefined
            });
            message.success('예약이 완료되었습니다.');
            setIsReservationModalOpen(false);
            setReservationStep(1);
            setSelectedMemberId(null);
            setSelectedTicketId(null);
            fetchReservations();
        } catch (error) {
            console.error('Reservation failed:', error);
            message.error('예약에 실패했습니다.');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCancelReservation = async (reservationId: number) => {
        try {
            await cancelReservation(centerId, reservationId);
            message.success('예약이 취소되었습니다.');
            fetchReservations();
        } catch (error) {
            console.error('Failed to cancel reservation:', error);
            message.error('예약 취소에 실패했습니다.');
        }
    };

    const getReservationStatusStyle = (status: string) => {
        const primaryColor = '#879B7E';
        const primaryBg = 'rgba(135, 155, 126, 0.1)';
        const secondaryColor = '#9CA3AF';
        const secondaryBg = '#F3F4F6';

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
                const style = getReservationStatusStyle(status);
                return (
                    <Tag style={{
                        color: style.color,
                        backgroundColor: style.backgroundColor,
                        border: 0,
                        fontWeight: 600
                    }}>
                        {getReservationStatusText(status)}
                    </Tag>
                );
            },
        },
        {
            title: '관리',
            key: 'action',
            width: 80,
            render: (_: any, record: IGetReservationListByWellnessLectureIdAdminResponseV1) => {
                const isCancelled = cancelStatuses.includes(record.reservationStatus);
                if (isCancelled) return null;

                return (
                    <Popconfirm
                        title="예약을 취소하시겠습니까?"
                        onConfirm={() => handleCancelReservation(record.reservationId)}
                        okText="네"
                        cancelText="아니오"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="link" danger size="small" style={{ padding: 0 }}>취소</Button>
                    </Popconfirm>
                );
            }
        },
    ];

    const cancelStatuses = [
        'ADMIN_CANCELED_RESERVATION',
        'MEMBER_CANCELED_RESERVATION',
        'MEMBER_CANCELED_RESERVATION_REFUND'
    ];
    const activeReservations = reservations.filter(r => !cancelStatuses.includes(r.reservationStatus));
    const cancelledReservations = reservations.filter(r => cancelStatuses.includes(r.reservationStatus));

    return (
        <Drawer
            title={
                <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                    <Flex vertical gap={4}>
                        <Title level={5} style={{ margin: 0 }}>{lectureName}</Title>
                        <Text type="secondary" style={{ fontSize: '12px', fontWeight: '400' }}>예약 및 출석 현황</Text>
                    </Flex>
                    <Button
                        type="link"
                        size="small"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate(`/wellness-lecture/detail/${lectureId}`)}
                        style={{ padding: '0 4px', color: '#879B7E' }}
                    >
                        강의 상세보기
                    </Button>
                </Flex>
            }
            placement="right"
            onClose={onClose}
            open={!!lectureId}
            width={520}
            bodyStyle={{ padding: '24px' }}
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
                <Flex vertical gap={32}>
                    {/* Active Reservations */}
                    <Flex vertical gap={12}>
                        <Flex justify="space-between" align="center">
                            <Text strong style={{ fontSize: '16px' }}>예약자 목록 <span style={{ color: '#879B7E' }}>({activeReservations.length})</span></Text>
                            <Button
                                type="primary"
                                size="small"
                                onClick={handleOpenReservationModal}
                                style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', borderRadius: '6px', fontWeight: 600 }}
                            >
                                예약 하기
                            </Button>
                        </Flex>
                        <Table
                            dataSource={activeReservations}
                            columns={columns}
                            rowKey="reservationId"
                            pagination={false}
                            size="small"
                        />
                    </Flex>

                    {/* Cancelled Reservations */}
                    {cancelledReservations.length > 0 && (
                        <Flex vertical gap={12}>
                            <Flex justify="space-between" align="center">
                                <Text type="secondary" style={{ fontSize: '14px' }}>취소 목록 ({cancelledReservations.length})</Text>
                            </Flex>
                            <Table
                                dataSource={cancelledReservations}
                                columns={columns}
                                rowKey="reservationId"
                                pagination={false}
                                size="small"
                                style={{ opacity: 0.6 }}
                            />
                        </Flex>
                    )}
                </Flex>
            )}

            <Modal
                title={reservationStep === 1 ? "예약자 선택" : "예약 확인 및 수강권 선택"}
                open={isReservationModalOpen}
                onCancel={() => setIsReservationModalOpen(false)}
                width={720}
                centered
                styles={{
                    body: { padding: '12px 0 24px' }
                }}
                footer={[
                    reservationStep === 1 ? (
                        <Button key="cancel" onClick={() => setIsReservationModalOpen(false)}>
                            취소
                        </Button>
                    ) : (
                        <Button key="back" onClick={() => setReservationStep(1)}>
                            이전
                        </Button>
                    ),
                    <Button
                        key="submit"
                        type="primary"
                        loading={createLoading}
                        onClick={handleCreateReservation}
                        disabled={!selectedMemberId}
                        style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', borderRadius: '6px', fontWeight: 600 }}
                    >
                        {reservationStep === 1 ? "다음" : "예약 생성하기"}
                    </Button>
                ]}
                zIndex={2000} // higher than Drawer's z-index
            >
                {reservationStep === 1 ? (
                    <Flex vertical gap={16} style={{ padding: '0 24px' }}>
                        <Flex vertical gap={12}>
                            <Text type="secondary">예약하실 회원을 리스트에서 선택해주세요.</Text>
                            <Select
                                showSearch
                                placeholder="이름 또는 전화번호로 검색"
                                style={{ width: '100%' }}
                                value={selectedMemberId}
                                onSearch={setMemberSearchText}
                                onChange={setSelectedMemberId}
                                filterOption={false}
                                options={members
                                    .filter(m => !memberSearchText || m.name.includes(memberSearchText) || m.mobile.includes(memberSearchText))
                                    .map(member => ({
                                        value: member.id,
                                        label: `${member.name} (${member.mobile})`
                                    }))}
                                size="large"
                                suffixIcon={null}
                                showArrow={false}
                            />
                            <Table
                                size="small"
                                rowKey="id"
                                dataSource={members.filter(m => !memberSearchText || m.name.includes(memberSearchText) || m.mobile.includes(memberSearchText))}
                                columns={[
                                    { title: '이름', dataIndex: 'name', key: 'name', width: 100 },
                                    { title: '휴대폰번호', dataIndex: 'mobile', key: 'mobile', width: 140 },
                                    {
                                        title: '보유 수강권',
                                        dataIndex: 'wellnessTicketIssuanceList',
                                        key: 'tickets',
                                        render: (list: any[]) => (
                                            <Flex gap={4} wrap="wrap">
                                                {list.length > 0 ? list.map(t => (
                                                    <Tag key={t.id} style={{ fontSize: '11px', margin: 0 }}>{t.name}</Tag>
                                                )) : <Text type="secondary" style={{ fontSize: '12px' }}>-</Text>}
                                            </Flex>
                                        )
                                    }
                                ]}
                                pagination={{ pageSize: 5, size: 'small' }}
                                rowSelection={{
                                    type: 'radio',
                                    selectedRowKeys: selectedMemberId ? [selectedMemberId] : [],
                                    onChange: (keys) => setSelectedMemberId(keys[0] as number)
                                }}
                                onRow={(record) => ({
                                    onClick: () => setSelectedMemberId(record.id),
                                    style: { cursor: 'pointer' }
                                })}
                            />
                        </Flex>
                    </Flex>
                ) : (
                    <Flex vertical gap={24} style={{ padding: '0 24px' }}>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                            <Flex vertical gap={20}>
                                {lecture && (
                                    <section>
                                        <Title level={5} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '4px', height: '16px', backgroundColor: '#879B7E', borderRadius: '2px' }} />
                                            수업 정보
                                        </Title>
                                        <Card size="small" style={{ backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px' }}>
                                            <Descriptions column={2} size="small" layout="horizontal">
                                                <Descriptions.Item label="수업명">{lecture.name}</Descriptions.Item>
                                                <Descriptions.Item label="강사">{lecture.teacherName}</Descriptions.Item>
                                                <Descriptions.Item label="시간">{dayjs(lecture.startDateTime).format('HH:mm')} - {dayjs(lecture.endDateTime).format('HH:mm')}</Descriptions.Item>
                                                <Descriptions.Item label="장소">{lecture.room}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </section>
                                )}

                                <section>
                                    <Title level={5} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '4px', height: '16px', backgroundColor: '#879B7E', borderRadius: '2px' }} />
                                        예약자 정보
                                    </Title>
                                    <Card size="small" style={{ backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px' }}>
                                        <Descriptions column={2} size="small">
                                            <Descriptions.Item label="이름">{members.find(m => m.id === selectedMemberId)?.name}</Descriptions.Item>
                                            <Descriptions.Item label="휴대폰">{members.find(m => m.id === selectedMemberId)?.mobile}</Descriptions.Item>
                                            <Descriptions.Item label="SNS">{members.find(m => m.id === selectedMemberId)?.socialName || '-'}</Descriptions.Item>
                                            <Descriptions.Item label="등록일">{dayjs(members.find(m => m.id === selectedMemberId)?.createdDate).format('YYYY.MM.DD')}</Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                </section>

                                <section>
                                    <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '4px', height: '16px', backgroundColor: '#879B7E', borderRadius: '2px' }} />
                                        사용할 수강권 선택
                                    </Title>
                                    <Row gutter={[12, 12]}>
                                        {members.find(m => m.id === selectedMemberId)?.wellnessTicketIssuanceList.map(ticket => (
                                            <Col span={12} key={ticket.id}>
                                                <Card
                                                    hoverable
                                                    size="small"
                                                    onClick={() => setSelectedTicketId(ticket.id)}
                                                    style={{
                                                        borderColor: selectedTicketId === ticket.id ? '#879B7E' : '#E2E8F0',
                                                        backgroundColor: selectedTicketId === ticket.id ? 'rgba(135, 155, 126, 0.05)' : '#fff',
                                                        borderWidth: '2px',
                                                        borderRadius: '12px',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <Flex justify="space-between" align="flex-start">
                                                        <Flex vertical gap={4}>
                                                            <Text strong style={{ fontSize: '13px' }}>{ticket.name}</Text>
                                                            <Flex gap={8} align="center">
                                                                <Tag color="cyan" style={{ margin: 0, fontSize: '10px' }}>{ticket.remainingCnt}회 남음</Tag>
                                                                <Text type="secondary" style={{ fontSize: '11px' }}>~{dayjs(ticket.expireDate).format('YYYY.MM.DD')}</Text>
                                                            </Flex>
                                                        </Flex>
                                                        {selectedTicketId === ticket.id && (
                                                            <CheckCircleFilled style={{ color: '#879B7E', fontSize: '16px' }} />
                                                        )}
                                                    </Flex>
                                                </Card>
                                            </Col>
                                        ))}
                                        <Col span={12}>
                                            <Card
                                                hoverable
                                                size="small"
                                                onClick={() => setSelectedTicketId(null)}
                                                style={{
                                                    borderColor: selectedTicketId === null ? '#879B7E' : '#E2E8F0',
                                                    backgroundColor: selectedTicketId === null ? 'rgba(135, 155, 126, 0.05)' : '#fff',
                                                    borderWidth: '2px',
                                                    borderRadius: '12px',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <Flex justify="space-between" align="flex-start">
                                                    <Flex vertical gap={4}>
                                                        <Text strong style={{ fontSize: '13px' }}>무료 예약 (수강권 미사용)</Text>
                                                        <Text type="secondary" style={{ fontSize: '11px' }}>수강권을 차감하지 않고 예약합니다.</Text>
                                                    </Flex>
                                                    {selectedTicketId === null && (
                                                        <CheckCircleFilled style={{ color: '#879B7E', fontSize: '16px' }} />
                                                    )}
                                                </Flex>
                                            </Card>
                                        </Col>
                                    </Row>
                                </section>
                            </Flex>
                        </div>
                    </Flex>
                )}
            </Modal>
        </Drawer>
    );
};
