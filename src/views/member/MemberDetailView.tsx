import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Card,
    Row,
    Col,
    Typography,
    Divider,
    Table,
    Tag,
    Flex,
    Button,
    Input,
    message,
    Spin,
    Badge,
    Space
} from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    CalendarOutlined,
    MailOutlined,
    ArrowLeftOutlined,
    PlusOutlined,
    FileTextOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import type { RootState } from '@/app/store';
import { getMemberDetailById, createMemberMemo } from '@/entities/member/api';
import type { IGetMemberDetailByIdAdminResponseV1, IWellnessTicketIssuance } from '@/entities/member/api';
import { IssueTicketModal } from '@/features/issueTicket/IssueTicketModal';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const MemberDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(true);
    const [member, setMember] = useState<IGetMemberDetailByIdAdminResponseV1 | null>(null);
    const [memoContent, setMemoContent] = useState('');
    const [memoLoading, setMemoLoading] = useState(false);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

    useEffect(() => {
        if (selectedCenterId && id) {
            fetchMemberDetail();
        }
    }, [selectedCenterId, id]);

    const fetchMemberDetail = async () => {
        setLoading(true);
        try {
            const res = await getMemberDetailById(selectedCenterId, Number(id));
            setMember(res.data);
        } catch (error) {
            console.error('Failed to fetch member detail:', error);
            message.error('회원 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMemo = async () => {
        if (!memoContent.trim()) {
            return message.warning('메모 내용을 입력해주세요.');
        }

        setMemoLoading(true);
        try {
            await createMemberMemo(selectedCenterId, Number(id), memoContent);
            message.success('메모가 등록되었습니다.');
            setMemoContent('');
            fetchMemberDetail();
        } catch (error) {
            console.error('Failed to create memo:', error);
            message.error('메모 등록에 실패했습니다.');
        } finally {
            setMemoLoading(false);
        }
    };

    const ticketColumns = [
        {
            title: '구분',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Text type="secondary">{type === 'COUNT' ? '횟수형' : '기간형'}</Text>,
        },
        {
            title: '수강권명',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <Text strong>{name}</Text>,
        },
        {
            title: '잔여 정보',
            key: 'remaining',
            render: (_: any, record: IWellnessTicketIssuance) => (
                <Flex gap={8}>
                    <Tag color="blue" style={{ borderRadius: '4px', border: 'none' }}>
                        {record.remainingDate}일 남음
                    </Tag>
                    <Tag color="cyan" style={{ borderRadius: '4px', border: 'none' }}>
                        {record.remainingCnt}회 / {record.totalUsableCnt}회
                    </Tag>
                </Flex>
            ),
        },
        {
            title: '유효 기간',
            key: 'period',
            render: (_: any, record: IWellnessTicketIssuance) => (
                <Text type="secondary" style={{ fontSize: '13px' }}>
                    {dayjs(record.startDate).format('YYYY-MM-DD')} ~ {dayjs(record.expireDate).format('YYYY-MM-DD')}
                </Text>
            ),
        },
        {
            title: '상태',
            dataIndex: 'isDelete',
            key: 'status',
            render: (isDelete: boolean, record: IWellnessTicketIssuance) => {
                if (!isDelete) return <Tag color="success">이용중</Tag>;
                return record.remainingCnt > 0 ? <Tag color="error">만료</Tag> : <Tag color="default">사용 완료</Tag>;
            },
        },
    ];

    const memoColumns = [
        {
            title: '내용',
            dataIndex: 'content',
            key: 'content',
            render: (content: string) => <Text style={{ whiteSpace: 'pre-wrap' }}>{content}</Text>,
        },
        {
            title: '작성자',
            dataIndex: 'registerName',
            key: 'registerName',
            width: 120,
        },
        {
            title: '작성일',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 150,
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
        },
    ];

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: '80vh' }}>
                <Spin size="large" tip="회원 정보를 불러오는 중..." />
            </Flex>
        );
    }

    if (!member) {
        return (
            <Flex vertical align="center" style={{ padding: '48px' }}>
                <Text type="secondary">회원 정보를 찾을 수 없습니다.</Text>
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/member')}
                >
                    회원 목록으로 돌아가기
                </Button>
            </Flex>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Flex vertical gap={24}>
                {/* Header Section */}
                <Flex align="center" gap={16}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/member')}
                        style={{ borderRadius: '8px' }}
                    />
                    <div>
                        <Title level={2} style={{ margin: 0, fontSize: '24px' }}>회원 상세 정보</Title>
                        <Text type="secondary">회원의 프로필과 수강권 정보를 관리하세요.</Text>
                    </div>
                </Flex>

                <Row gutter={[24, 24]}>
                    {/* Member Profile Card */}
                    <Col xs={24} lg={8}>
                        <Card
                            style={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <Flex vertical align="center" style={{ marginBottom: 24 }}>
                                <div style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    backgroundColor: '#F1F5F9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 12
                                }}>
                                    <UserOutlined style={{ fontSize: '32px', color: '#879B7E' }} />
                                </div>
                                <Title level={4} style={{ margin: 0 }}>{member.name}</Title>
                                <Tag color="#FAFCF9" style={{ color: '#879B7E', border: '1px solid #D1DBCE', marginTop: 4 }}>
                                    {member.roleName === 'MANAGER_OWNER' ? '센터 관리자' : '일반 회원'}
                                </Tag>
                            </Flex>

                            <Divider style={{ margin: '16px 0' }} />

                            <Flex vertical gap={16}>
                                <Flex align="center" gap={12}>
                                    <PhoneOutlined style={{ color: '#94A3B8' }} />
                                    <Text>{member.mobile}</Text>
                                </Flex>
                                <Flex align="center" gap={12}>
                                    <CalendarOutlined style={{ color: '#94A3B8' }} />
                                    <Text>{member.birthDay} ({member.age}) / {member.gender}</Text>
                                </Flex>
                                <Flex align="center" gap={12}>
                                    <MailOutlined style={{ color: '#94A3B8' }} />
                                    <Text>{member.email || '-'}</Text>
                                </Flex>
                                <Flex align="center" gap={12}>
                                    <ClockCircleOutlined style={{ color: '#94A3B8' }} />
                                    <Text>가입일: {dayjs(member.createdDate).format('YYYY-MM-DD')}</Text>
                                </Flex>
                            </Flex>
                        </Card>
                    </Col>

                    {/* Content Section */}
                    <Col xs={24} lg={16}>
                        <Flex vertical gap={24}>
                            {/* Tickets Card */}
                            <Card
                                title={
                                    <Flex justify="space-between" align="center">
                                        <Space>
                                            <Badge color="#879B7E" />
                                            <Text strong>보유 수강권</Text>
                                        </Space>
                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={() => setIsIssueModalOpen(true)}
                                            style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', borderRadius: '4px' }}
                                        >
                                            발급하기
                                        </Button>
                                    </Flex>
                                }
                                style={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                }}
                                bodyStyle={{ padding: 0 }}
                            >
                                <Table
                                    columns={ticketColumns}
                                    dataSource={member.wellnessTicketIssuanceList}
                                    pagination={false}
                                    rowKey="id"
                                    style={{ borderRadius: '0 0 16px 16px' }}
                                />
                            </Card>

                            {/* Memos Card */}
                            <Card
                                title={
                                    <Space>
                                        <Badge color="#879B7E" />
                                        <Text strong>회원 메모</Text>
                                    </Space>
                                }
                                style={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                }}
                                bodyStyle={{ padding: '24px' }}
                            >
                                <Flex vertical gap={16}>
                                    <Flex gap={12}>
                                        <TextArea
                                            placeholder="상담 내용이나 중요 정보를 기록하세요."
                                            rows={3}
                                            value={memoContent}
                                            onChange={(e) => setMemoContent(e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<FileTextOutlined />}
                                            onClick={handleCreateMemo}
                                            loading={memoLoading}
                                            style={{
                                                height: 'auto',
                                                backgroundColor: '#879B7E',
                                                borderColor: '#879B7E',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            등록
                                        </Button>
                                    </Flex>

                                    <Table
                                        columns={memoColumns}
                                        dataSource={member.memberMemoList}
                                        pagination={{ pageSize: 5 }}
                                        rowKey="id"
                                        size="small"
                                        style={{ marginTop: 8 }}
                                    />
                                </Flex>
                            </Card>
                        </Flex>
                    </Col>
                </Row>
            </Flex>

            <IssueTicketModal
                memberId={Number(id)}
                open={isIssueModalOpen}
                onClose={() => setIsIssueModalOpen(false)}
                onSuccess={fetchMemberDetail}
            />
        </div>
    );
};

export default MemberDetailView;
