import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Flex, Typography, Button, message, Space, Popconfirm } from 'antd';
import { ArrowLeft, Edit3, Trash2, RotateCcw } from 'lucide-react';
import type { RootState } from '@/app/store';
import { getWellnessTicketDetailById, deleteWellnessTicketById, restoreWellnessTicketById } from '@/entities/wellnessTicket/api';
import type { IGetWellnessTicketDetailAdminResponseV1 } from '@/entities/wellnessTicket/api';
import { getWellnessTicketIssuanceListByWellnessTicketId } from '@/entities/wellnessTicketIssuance/api';
import type { IGetWellnessTicketIssuanceListByWellnessTicketIdAdminResponseV1 } from '@/entities/wellnessTicketIssuance/api';
import { WellnessTicketInfoWidget } from '@/widgets/wellnessTicketDetail/WellnessTicketInfoWidget';
import { WellnessTicketIssuanceTableWidget } from '@/widgets/wellnessTicketDetail/WellnessTicketIssuanceTableWidget';

const { Title, Text } = Typography;

const WellnessTicketDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [ticket, setTicket] = useState<IGetWellnessTicketDetailAdminResponseV1 | null>(null);
    const [issuanceList, setIssuanceList] = useState<IGetWellnessTicketIssuanceListByWellnessTicketIdAdminResponseV1[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        if (!selectedCenterId || !id) return;

        setLoading(true);
        try {
            const ticketId = Number(id);
            const [ticketRes, issuanceRes] = await Promise.all([
                getWellnessTicketDetailById(selectedCenterId, ticketId),
                getWellnessTicketIssuanceListByWellnessTicketId(selectedCenterId, ticketId)
            ]);
            setTicket(ticketRes.data);
            setIssuanceList(issuanceRes.data);
        } catch (error) {
            console.error('Failed to fetch ticket details:', error);
            message.error('정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedCenterId, id]);

    const handleDelete = async () => {
        if (!selectedCenterId || !id) return;
        try {
            await deleteWellnessTicketById(selectedCenterId, Number(id));
            message.success('판매가 정지되었습니다.');
            fetchData();
        } catch (error) {
            message.error('처리에 실패했습니다.');
        }
    };

    const handleRestore = async () => {
        if (!selectedCenterId || !id) return;
        try {
            await restoreWellnessTicketById(selectedCenterId, Number(id));
            message.success('판매가 재개되었습니다.');
            fetchData();
        } catch (error) {
            message.error('처리에 실패했습니다.');
        }
    };

    if (!ticket && loading) return <Flex align="center" justify="center" style={{ height: '100vh' }}>로딩 중...</Flex>;
    if (!ticket) return <Flex align="center" justify="center" style={{ height: '100vh' }}>데이터를 찾을 수 없습니다.</Flex>;

    return (
        <Flex vertical gap={32} style={{ padding: '32px', minHeight: '100%', backgroundColor: '#F8FAFC' }}>
            <Flex justify="space-between" align="start">
                <Flex align="center" gap={16}>
                    <Button
                        variant="outlined"
                        icon={<ArrowLeft size={20} />}
                        onClick={() => navigate('/wellness-ticket')}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            color: '#64748B'
                        }}
                    />
                    <Flex vertical>
                        <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#879B7E' }}>
                            {ticket.name}
                        </Title>
                        <Text style={{ color: '#64748B' }}>수강권 상세 정보 및 발급 이력</Text>
                    </Flex>
                </Flex>

                <Space size={12}>
                    {ticket.isDelete ? (
                        <Button
                            icon={<RotateCcw size={18} />}
                            size="large"
                            onClick={handleRestore}
                            style={{ borderRadius: '8px' }}
                        >
                            판매 재개
                        </Button>
                    ) : (
                        <Popconfirm
                            title="판매 정지"
                            description="정말로 이 수강권의 판매를 정지하시겠습니까?"
                            onConfirm={handleDelete}
                            okText="정지"
                            cancelText="취소"
                            okButtonProps={{ danger: true }}
                        >
                            <Button
                                danger
                                icon={<Trash2 size={18} />}
                                size="large"
                                style={{ borderRadius: '8px' }}
                            >
                                판매 정지
                            </Button>
                        </Popconfirm>
                    )}
                    <Button
                        type="primary"
                        icon={<Edit3 size={18} />}
                        size="large"
                        onClick={() => navigate(`/wellness-ticket/update/${id}`)}
                        style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', borderRadius: '8px' }}
                    >
                        수정하기
                    </Button>
                </Space>
            </Flex>

            <Flex vertical gap={24}>
                <WellnessTicketInfoWidget data={ticket} />
                <WellnessTicketIssuanceTableWidget
                    data={issuanceList}
                    loading={loading}
                    searchText={searchText}
                    onSearchChange={setSearchText}
                />
            </Flex>
        </Flex>
    );
};

export default WellnessTicketDetailView;
