import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import {
    Button,
    Card,
    Col,
    Flex,
    Image,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
    Table,
    Switch,
    Modal,
    message,
    Checkbox,
    Tooltip,
} from 'antd';
import {
    ArrowLeftOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getWellnessClassDetailWithLectureById, deleteWellnessClass } from '@/entities/wellnessClass/api';
import type { IGetWellnessClassDetailWithLectureAdminResponseV2, IWellnessLectureInClass } from '@/entities/wellnessClass/api';
import { deleteWellnessLectureList } from '@/entities/wellnessLecture/api';
import { getReservationListByWellnessLectureId } from '@/entities/reservation/api';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { formatTimeRange } from '@/shared/lib/format';

const { Title, Text, Paragraph } = Typography;

export default function WellnessClassDetailView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const centerId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IGetWellnessClassDetailWithLectureAdminResponseV2 | null>(null);
    const [hideDeleted, setHideDeleted] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [activeCounts, setActiveCounts] = useState<Record<number, number>>({});

    const filteredLectures = data?.lectureList.filter(lecture => !hideDeleted || (!lecture.isDelete && !lecture.isPast)) || [];

    useEffect(() => {
        if (centerId && id) {
            fetchDetail();
        }
    }, [centerId, id]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await getWellnessClassDetailWithLectureById(centerId!, Number(id));
            setData(res.data);

            // Fetch reservations for each lecture to get active counts
            if (res.data.lectureList && res.data.lectureList.length > 0) {
                const cancelStatuses = ['ADMIN_CANCELED_RESERVATION', 'MEMBER_CANCELED_RESERVATION', 'MEMBER_CANCELED_RESERVATION_REFUND'];
                const counts: Record<number, number> = {};

                // Fetch in parallel
                await Promise.all(res.data.lectureList.map(async (lecture) => {
                    try {
                        const reserveRes = await getReservationListByWellnessLectureId(centerId!, lecture.id);
                        const activeCount = reserveRes.data.filter(r => !cancelStatuses.includes(r.reservationStatus)).length;
                        counts[lecture.id] = activeCount;
                    } catch (err) {
                        console.error(`Failed to fetch reservations for lecture ${lecture.id}:`, err);
                        counts[lecture.id] = lecture.currentReservationCnt;
                    }
                }));
                setActiveCounts(counts);
            }
        } catch (error) {
            console.error('Failed to fetch group class detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClass = () => {
        Modal.confirm({
            title: '그룹 수업 삭제',
            content: '정말로 이 그룹 수업을 삭제하시겠습니까? 삭제 시 해당 수업이 모두 폐강 됩니다.',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk: async () => {
                try {
                    await deleteWellnessClass(centerId!, Number(id));
                    message.success('그룹 수업이 삭제되었습니다.');
                    navigate('/wellness-lecture');
                } catch (error) {
                    message.error('그룹 수업 삭제에 실패했습니다.');
                }
            }
        });
    };

    const handleBulkCancel = () => {
        if (selectedRowKeys.length === 0) return;

        Modal.confirm({
            title: '선택한 수업 폐강',
            content: (
                <Flex vertical gap={8}>
                    <Text>정말로 선택한 {selectedRowKeys.length}개의 수업을 폐강하시겠습니까?</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        * 이미 지난 수업 혹은 예약자가 존재하는 수업은 폐강할 수 없습니다.
                    </Text>
                </Flex>
            ),
            okText: '폐강',
            okType: 'danger',
            cancelText: '취소',
            onOk: async () => {
                try {
                    await deleteWellnessLectureList(centerId!, selectedRowKeys.map(Number));
                    message.success('선택한 수업이 폐강되었습니다.');
                    setSelectedRowKeys([]);
                    fetchDetail();
                } catch (error) {
                    message.error('수업 폐강에 실패했습니다.');
                }
            }
        });
    };

    const handleEditSelected = () => {
        if (selectedRowKeys.length === 0) return;

        if (selectedRowKeys.length === 1) {
            navigate(`/wellness-lecture/update/${selectedRowKeys[0]}`);
        } else {
            navigate(`/wellness-lecture-list/update?ids=${selectedRowKeys.join(',')}`);
        }
    };

    const lectureColumns: ColumnsType<IWellnessLectureInClass> = [
        {
            title: 'No.',
            key: 'no',
            width: 60,
            align: 'center' as const,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: '수업명',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: IWellnessLectureInClass) => (
                <Link to={`/wellness-lecture/detail/${record.id}`}>
                    <Text strong style={{ color: '#879B7E' }}>{text}</Text>
                </Link>
            ),
        },
        {
            title: '수업 시간',
            key: 'time',
            render: (_: any, record: IWellnessLectureInClass) => (
                <Flex vertical gap={2}>
                    <Text style={{ fontSize: '12px', color: '#64748B' }}>
                        {dayjs(record.startDateTime).format('YYYY-MM-DD')}
                    </Text>
                    <Text style={{ fontSize: '13px' }}>
                        {formatTimeRange(record.startDateTime, record.endDateTime)}
                    </Text>
                </Flex>
            ),
        },
        {
            title: '예약 인원',
            key: 'reservations',
            align: 'center' as const,
            render: (_: any, record: IWellnessLectureInClass) => (
                <Text>{activeCounts[record.id] ?? record.currentReservationCnt} / {record.maxReservationCnt} 명</Text>
            ),
        },
        {
            title: '상태',
            key: 'status',
            align: 'center' as const,
            render: (_: any, record: IWellnessLectureInClass) => {
                if (record.isDelete) {
                    return (
                        <Tag color="#FFF1F2" style={{ color: '#E11D48', border: '1px solid #FFE4E6', borderRadius: '4px' }}>
                            폐강
                        </Tag>
                    );
                }
                if (record.isPast) {
                    return (
                        <Tag color="#F1F5F9" style={{ color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                            지난수업
                        </Tag>
                    );
                }
                return (
                    <Tag color="#FAFCF9" style={{ color: '#879B7E', border: '1px solid #D1DBCE', borderRadius: '4px' }}>
                        진행
                    </Tag>
                );
            },
        },
    ];

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: '100%', minHeight: '400px' }}>
                <Spin size="large" />
            </Flex>
        );
    }

    if (!data) {
        return (
            <Flex justify="center" align="center" style={{ height: '100%', minHeight: '400px' }}>
                <Text type="secondary">그룹 수업 정보를 찾을 수 없습니다.</Text>
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
                        <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>{data.wellnessClassName}</Title>
                        <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>그룹 수업 상세 정보</Text>
                    </Flex>
                </Flex>
                <Space>
                    <Tooltip title={data.lectureList.some(l => (activeCounts[l.id] ?? l.currentReservationCnt) > 0) ? "예약자가 존재하는 수업이 있어 삭제할 수 없습니다." : ""}>
                        <Button
                            danger
                            onClick={handleDeleteClass}
                            disabled={data.lectureList.some(l => (activeCounts[l.id] ?? l.currentReservationCnt) > 0)}
                        >
                            삭제
                        </Button>
                    </Tooltip>
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
                                    src={data.teacherImageUrl || "https://via.placeholder.com/40"}
                                    fallback="https://via.placeholder.com/40?text=T"
                                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <Text strong style={{ fontSize: '16px' }}>{data.teacherName}</Text>
                            </Flex>
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Flex vertical gap={8}>
                            <Text type="secondary">강의실</Text>
                            <div style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: '18px' }}>{data.room}</Text>
                            </div>
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Flex vertical gap={8}>
                            <Text type="secondary">수업 현황</Text>
                            <div style={{ minHeight: '40px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <Text strong style={{ fontSize: '24px', color: '#879B7E' }}>{Number(data.pastClassesCount) + Number(data.upcomingClassesCount)}</Text>
                                <Text type="secondary" style={{ fontSize: '14px' }}>전체 (지난 {data.pastClassesCount} / 예정 {data.upcomingClassesCount})</Text>
                            </div>
                        </Flex>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Flex vertical gap={8}>
                            <Text type="secondary">종류</Text>
                            <div style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}>
                                <Tag color="blue" style={{ fontSize: '14px', padding: '2px 10px', borderRadius: '4px' }}>{data.lectureType}</Tag>
                            </div>
                        </Flex>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                {/* Left Column: Lecture List */}
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <Flex justify="space-between" align="center">
                                <Title level={4} style={{ margin: 0 }}>전체 수업 목록</Title>
                                <Space>
                                    <Button
                                        size="small"
                                        onClick={handleEditSelected}
                                        style={{ fontSize: '12px' }}
                                        disabled={selectedRowKeys.length === 0}
                                    >
                                        수정
                                    </Button>
                                    <Tooltip title="이미 지난 수업 혹은 예약자가 존재하는 수업은 폐강할 수 없습니다">
                                        <Button
                                            size="small"
                                            danger
                                            onClick={handleBulkCancel}
                                            style={{ fontSize: '12px' }}
                                            disabled={
                                                selectedRowKeys.length === 0 ||
                                                data.lectureList.filter(l => selectedRowKeys.includes(l.id)).some(l => (activeCounts[l.id] ?? l.currentReservationCnt) > 0)
                                            }
                                        >
                                            폐강
                                        </Button>
                                    </Tooltip>
                                </Space>
                            </Flex>
                        }
                        bordered={false}
                        style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minHeight: '500px' }}
                    >
                        <Flex justify="flex-end" align="center" gap={8} style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: '14px' }}>폐강 & 지난 수업 숨기기</Text>
                            <Switch
                                size="small"
                                checked={hideDeleted}
                                onChange={setHideDeleted}
                                style={{ backgroundColor: hideDeleted ? '#879B7E' : undefined }}
                            />
                        </Flex>
                        <Table
                            dataSource={filteredLectures}
                            columns={lectureColumns}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            rowSelection={{
                                selectedRowKeys,
                                onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
                                getCheckboxProps: (record: IWellnessLectureInClass) => ({
                                    disabled: record.isDelete || record.isPast,
                                }),
                                columnTitle: (
                                    <Checkbox
                                        checked={(() => {
                                            const selectableKeys = filteredLectures
                                                .filter(record => !record.isDelete && !record.isPast)
                                                .map(record => record.id);
                                            return selectableKeys.length > 0 && selectableKeys.every(key => selectedRowKeys.includes(key));
                                        })()}
                                        indeterminate={(() => {
                                            const selectableKeys = filteredLectures
                                                .filter(record => !record.isDelete && !record.isPast)
                                                .map(record => record.id);
                                            const selectedCount = selectableKeys.filter(key => selectedRowKeys.includes(key)).length;
                                            return selectedCount > 0 && selectedCount < selectableKeys.length;
                                        })()}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                const allSelectableKeys = filteredLectures
                                                    .filter(record => !record.isDelete && !record.isPast)
                                                    .map(record => record.id);
                                                setSelectedRowKeys(allSelectableKeys);
                                            } else {
                                                setSelectedRowKeys([]);
                                            }
                                        }}
                                    />
                                ),
                                preserveSelectedRowKeys: true,
                            }}
                        />
                    </Card>
                </Col>

                {/* Right Column: Supplementary Info */}
                <Col xs={24} lg={8}>
                    <Space direction="vertical" size={24} style={{ width: '100%' }}>
                        {/* Description Card */}
                        <Card title="수업 소개" bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <Paragraph style={{ whiteSpace: 'pre-wrap', color: '#4B5563', margin: 0 }}>
                                {data.wellnessClassDescription || "등록된 소개가 없습니다."}
                            </Paragraph>
                        </Card>

                        {/* Ticket Info */}
                        <Card title="이용 가능 수강권" bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <Flex gap={8} wrap="wrap">
                                {data.ticketList && data.ticketList.length > 0 ? (
                                    data.ticketList.map((ticket, index) => (
                                        <Tag
                                            key={index}
                                            style={{
                                                backgroundColor: ticket.backgroundColor,
                                                color: ticket.textColor,
                                                padding: '4px 12px',
                                                fontSize: '14px',
                                                border: 'none',
                                                borderRadius: '6px',
                                                margin: 0
                                            }}
                                        >
                                            {ticket.name}
                                        </Tag>
                                    ))
                                ) : (
                                    <Text type="secondary">설정된 수강권이 없습니다.</Text>
                                )}
                            </Flex>
                        </Card>

                        {/* Images */}
                        {data.wellnessClassImageUrlList && data.wellnessClassImageUrlList.length > 0 && (
                            <Card title="수업 이미지" bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <Image.PreviewGroup>
                                    <Flex gap={12} wrap="wrap">
                                        {data.wellnessClassImageUrlList.map((url, index) => (
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
                    </Space>
                </Col>
            </Row>
        </div>
    );
}
