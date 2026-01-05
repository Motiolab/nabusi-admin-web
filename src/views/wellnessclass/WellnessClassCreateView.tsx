import { Typography, Flex, Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WellnessClassCreateForm } from '@/features/wellnessClassCreate/WellnessClassCreateForm';

const { Title, Text } = Typography;

const WellnessClassCreateView = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '24px' }}>
            <Flex vertical gap={24}>
                <Flex align="center" gap={16}>
                    <Button
                        type="text"
                        icon={<ArrowLeft size={20} />}
                        onClick={() => navigate(-1)}
                        style={{ height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                    <div>
                        <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>새 수업 추가</Title>
                        <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>센터의 새로운 수업 일정을 등록하고 관리하세요.</Text>
                    </div>
                </Flex>

                <WellnessClassCreateForm />
            </Flex>
        </div>
    );
};

export default WellnessClassCreateView;
