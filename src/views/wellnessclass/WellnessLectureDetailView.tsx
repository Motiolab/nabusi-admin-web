import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    Col,
    Descriptions,
    Flex,
    Image,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
    Modal,
    message,
    Table,
    Select,
    Tabs
} from 'antd';
import {
    ArrowLeftOutlined,
    CheckCircleFilled
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getWellnessLectureDetailById, deleteWellnessLecture } from '@/entities/wellnessLecture/api';
import type { IGetWellnessLectureDetailAdminResponseV1 } from '@/entities/wellnessLecture/api';
import { getReservationListByWellnessLectureId, createReservation } from '@/entities/reservation/api';
import type { IGetReservationListByWellnessLectureIdAdminResponseV1 } from '@/entities/reservation/api';
import { getAllMemberListByCenterId } from '@/entities/member/api';
import type { IGetAllMemberListByCenterIdAdminResponseV1 } from '@/entities/member/api';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { getTeacherDetailById } from '@/entities/teacher/api';

const { Title, Text, Paragraph } = Typography;

export default function WellnessLectureDetailView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const centerId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(true);
    const [lecture, setLecture] = useState<IGetWellnessLectureDetailAdminResponseV1 | null>(null);
    const [teacherImage, setTeacherImage] = useState<string | null>(null);

    // Reservation State
    const [reservations, setReservations] = useState<IGetReservationListByWellnessLectureIdAdminResponseV1[]>([]);
    const [reservationLoading, setReservationLoading] = useState(false);

    // Modal State
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [reservationStep, setReservationStep] = useState(1);
    const [members, setMembers] = useState<IGetAllMemberListByCenterIdAdminResponseV1[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [memberSearchText, setMemberSearchText] = useState('');

    useEffect(() => {
        if (loading && centerId && id) {
            // Initial load
        }
    }, [loading, centerId, id]);

    useEffect(() => {
        if (centerId && id) {
            fetchDetail();
        }
    }, [centerId, id]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await getWellnessLectureDetailById(centerId!, Number(id));
            setLecture(res.data);

            // Also fetch reservations
            fetchReservations();

            // Fetch teacher image separately
            if (res.data.teacherId) {
                try {
                    const teacherRes = await getTeacherDetailById(centerId!, res.data.teacherId);
                    if (teacherRes.data.imageUrl) {
                        setTeacherImage(teacherRes.data.imageUrl);
                    }
                } catch (err) {
                    console.error('Failed to fetch teacher detail:', err);
                }
            }
        } catch (error) {
            console.error('Failed to fetch lecture detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReservations = async () => {
        setReservationLoading(true);
        try {
            const res = await getReservationListByWellnessLectureId(centerId!, Number(id));
            setReservations(res.data);
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        } finally {
            setReservationLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const res = await getAllMemberListByCenterId(centerId!);
            setMembers(res.data);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };

    const handleCancelLecture = () => {
        Modal.confirm({
            title: '강의 폐강',
            content: '정말로 이 강의를 폐강하시겠습니까? 폐강 시 복구할 수 없습니다.',
            okText: '폐강',
            okType: 'danger',
            cancelText: '취소',
            onOk: async () => {
                try {
                    await deleteWellnessLecture(centerId!, Number(id), true);
                    message.success('강의가 폐강되었습니다.');
                    navigate('/wellness-lecture');
                } catch (error) {
                    message.error('강의 폐강에 실패했습니다.');
                }
            }
        });
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
                centerId: centerId!,
                memberId: selectedMemberId,
                wellnessLectureId: Number(id),
                wellnessTicketIssuanceId: selectedTicketId || undefined
            });
            message.success('예약이 완료되었습니다.');
            setIsReservationModalOpen(false);
            setReservationStep(1);
            setSelectedMemberId(null);
            setSelectedTicketId(null);
            fetchReservations();
            // Refresh lecture detail to update counts if needed
            const res = await getWellnessLectureDetailById(centerId!, Number(id));
            setLecture(res.data);
        } catch (error) {
            console.error('Reservation failed:', error);
            message.error('예약에 실패했습니다.');
        } finally {
            setCreateLoading(false);
        }
    };

    // Helpers for Reservation Table
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

    const reservationColumns = [
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
    ];

    const cancelStatuses = ['ADMIN_CANCELED_RESERVATION', 'MEMBER_CANCELED_RESERVATION', 'MEMBER_CANCELED_RESERVATION_REFUND'];
    const activeReservations = reservations.filter(r => !cancelStatuses.includes(r.reservationStatus));
    const cancelledReservations = reservations.filter(r => cancelStatuses.includes(r.reservationStatus));

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: '100%', minHeight: '400px' }}>
                <Spin size="large" />
            </Flex>
        );
    }

    if (!lecture) {
        return (
            <Flex justify="center" align="center" style={{ height: '100%', minHeight: '400px' }}>
                <Text type="secondary">강의 정보를 찾을 수 없습니다.</Text>
            </Flex>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
                <Flex align="center" gap={16}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        type="text"
                    />
                    <Flex vertical gap={4}>
                        <Flex align="center" gap={8}>
                            <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>{lecture.name}</Title>
                            <Tag color={lecture.isDelete ? "default" : "#879B7E"} style={{ margin: 0 }}>
                                {lecture.isDelete ? "폐강됨" : "정상"}
                            </Tag>
                        </Flex>
                        <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>{dayjs(lecture.startDateTime).format('YYYY년 MM월 DD일 (ddd)')}</Text>
                    </Flex>
                </Flex>
                <Space>
                    <Button onClick={() => navigate(`/wellness-lecture/update/${lecture.id}`)}>수정</Button>
                    <Button danger onClick={handleCancelLecture}>폐강</Button>
                </Space>
            </Flex>

            {/* Quick Metrics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Flex vertical gap={8}>
                            <Text type="secondary">강사</Text>
                            <Flex align="center" gap={12}>
                                <Image
                                    width={40}
                                    height={40}
                                    src={teacherImage || "https://via.placeholder.com/40"}
                                    fallback="https://via.placeholder.com/40?text=T"
                                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                                    preview={!!teacherImage}
                                />
                                <Text strong style={{ fontSize: '16px' }}>{lecture.teacherName}</Text>
                            </Flex>
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Flex vertical gap={8}>
                            <Text type="secondary">시간 & 장소</Text>
                            <div style={{ minHeight: '40px', display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
                                <Text strong style={{ fontSize: '16px' }}>{dayjs(lecture.startDateTime).format('HH:mm')} - {dayjs(lecture.endDateTime).format('HH:mm')}</Text>
                                <Text type="secondary" style={{ fontSize: '14px' }}>{lecture.room}</Text>
                            </div>
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Flex vertical gap={8}>
                            <Text type="secondary">예약 현황</Text>
                            <div style={{ minHeight: '40px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <Text strong style={{ fontSize: '24px', color: '#879B7E' }}>{activeReservations.length}</Text>
                                <Text type="secondary" style={{ fontSize: '16px' }}>/ {lecture.maxReservationCnt} 명</Text>
                            </div>
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Flex vertical gap={8}>
                            <Text type="secondary">강의 타입</Text>
                            <div style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}>
                                <Tag color="blue" style={{ fontSize: '14px', padding: '2px 10px', borderRadius: '4px' }}>{lecture.wellnessLectureTypeName}</Tag>
                            </div>
                        </Flex>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                {/* Left Column: Reservation Management */}
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <Flex justify="space-between" align="center">
                                <Title level={4} style={{ margin: 0 }}>예약 관리</Title>
                                <Space>
                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                        총 {reservations.length}명 (예약 {activeReservations.length} / 취소 {cancelledReservations.length})
                                    </Text>
                                    <Button
                                        type="primary"
                                        onClick={handleOpenReservationModal}
                                        style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', borderRadius: '6px', fontWeight: 600 }}
                                    >
                                        예약 하기
                                    </Button>
                                </Space>
                            </Flex>
                        }
                        bordered={false}
                        style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minHeight: '500px' }}
                    >
                        <Tabs
                            defaultActiveKey="active"
                            items={[
                                {
                                    key: 'active',
                                    label: <Text strong style={{ fontSize: '16px' }}>예약자 ({activeReservations.length})</Text>,
                                    children: (
                                        <Table
                                            dataSource={activeReservations}
                                            columns={reservationColumns}
                                            rowKey="reservationId"
                                            pagination={false}
                                            loading={reservationLoading}
                                        />
                                    )
                                },
                                {
                                    key: 'cancelled',
                                    label: <Text strong style={{ fontSize: '16px' }}>취소 ({cancelledReservations.length})</Text>,
                                    children: (
                                        <Table
                                            dataSource={cancelledReservations}
                                            columns={reservationColumns}
                                            rowKey="reservationId"
                                            pagination={false}
                                            loading={reservationLoading}
                                            style={{ opacity: 0.7 }}
                                        />
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>

                {/* Right Column: Supplementary Info */}
                <Col xs={24} lg={8}>
                    <Space direction="vertical" size={24} style={{ width: '100%' }}>
                        {/* Description Card */}
                        <Card title="강의 소개" bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <Paragraph ellipsis={{ rows: 5, expandable: true, symbol: '더보기' }} style={{ whiteSpace: 'pre-wrap', color: '#4B5563', margin: 0 }}>
                                {lecture.description || "등록된 소개가 없습니다."}
                            </Paragraph>
                        </Card>

                        {/* Ticket Info */}
                        <Card title="이용 가능 수강권" bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <Flex gap={8} wrap="wrap">
                                {lecture.wellnessTicketAvailableList && lecture.wellnessTicketAvailableList.length > 0 ? (
                                    lecture.wellnessTicketAvailableList.map((ticket) => (
                                        <Tag
                                            key={ticket.wellnessTicketManagementId}
                                            color={ticket.backgroundColor}
                                            style={{
                                                color: ticket.textColor,
                                                padding: '4px 12px',
                                                fontSize: '14px',
                                                border: 'none',
                                                borderRadius: '6px',
                                                margin: 0
                                            }}
                                        >
                                            {ticket.wellnessTicketIssuanceName}
                                        </Tag>
                                    ))
                                ) : (
                                    <Text type="secondary">설정된 수강권이 없습니다.</Text>
                                )}
                            </Flex>
                        </Card>

                        {/* Images */}
                        {lecture.lectureImageUrlList && lecture.lectureImageUrlList.length > 0 && (
                            <Card title="강의 이미지" bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <Image.PreviewGroup>
                                    <Flex gap={12} wrap="wrap">
                                        {lecture.lectureImageUrlList.map((url, index) => (
                                            <Image
                                                key={index}
                                                width={80}
                                                height={80}
                                                src={url}
                                                style={{ objectFit: 'cover', borderRadius: '12px' }}
                                            />
                                        ))}
                                    </Flex>
                                </Image.PreviewGroup>
                            </Card>
                        )}

                        {/* Note */}
                        <Card bordered={false} style={{ borderRadius: '16px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6', padding: '16px' }} bodyStyle={{ padding: 0 }}>
                            <Flex vertical gap={8}>
                                <Text strong style={{ color: '#879B7E' }}>관리자 가이드</Text>
                                <Text style={{ fontSize: '14px', color: '#6B7280' }}>
                                    • 수업 시작 전 예약을 관리하세요.<br />
                                    • 상단 메트릭을 통해 정원을 즉시 확인 가능합니다.<br />
                                    • 등록일: {dayjs(lecture.startDateTime).format('YYYY-MM-DD')}
                                </Text>
                            </Flex>
                        </Card>
                    </Space>
                </Col>
            </Row>

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
                        {/* Summary Info Sections */}
                        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                            <Flex vertical gap={20}>
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
        </div>
    );
}
