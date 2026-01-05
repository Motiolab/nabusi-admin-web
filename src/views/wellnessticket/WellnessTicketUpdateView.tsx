import { Flex, Typography, Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { WellnessTicketUpdateForm } from '@/features/wellnessTicketUpdate/WellnessTicketUpdateForm';

const { Title, Text } = Typography;

const WellnessTicketUpdateView = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    if (!id) return null;

    return (
        <Flex vertical gap={24} style={{ padding: '32px', minHeight: '100%', backgroundColor: '#F8FAFC' }}>
            <Flex align="center" gap={16}>
                <Button
                    variant="outlined"
                    icon={<ArrowLeft size={20} />}
                    onClick={() => navigate(-1)}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#64748B'
                    }}
                />
                <Flex vertical>
                    <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1E293B' }}>
                        수강권 수정
                    </Title>
                    <Text style={{ color: '#64748B', fontSize: '14px' }}>
                        기존 수강권의 정보를 수정합니다.
                    </Text>
                </Flex>
            </Flex>

            <WellnessTicketUpdateForm id={id} />
        </Flex>
    );
};

export default WellnessTicketUpdateView;
