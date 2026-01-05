import { useState } from 'react';
import { Flex, Typography, Tabs } from 'antd';
import { Building2, ScrollText, BellRing } from 'lucide-react';
import { CenterInfoForm } from '@/features/operationPolicy/CenterInfoForm';
import { ClassPolicyForm } from '@/features/operationPolicy/ClassPolicyForm';
import { NotificationPolicyForm } from '@/features/operationPolicy/NotificationPolicyForm';

const { Title, Text } = Typography;

const OperationPolicyView = () => {
    const [activeTab, setActiveTab] = useState('1');

    const items = [
        {
            key: '1',
            label: (
                <Flex align="center" gap={8}>
                    <Building2 size={18} />
                    센터 정보
                </Flex>
            ),
            children: <CenterInfoForm />,
        },
        {
            key: '2',
            label: (
                <Flex align="center" gap={8}>
                    <ScrollText size={18} />
                    수업 정책
                </Flex>
            ),
            children: <ClassPolicyForm />,
        },
        {
            key: '3',
            label: (
                <Flex align="center" gap={8}>
                    <BellRing size={18} />
                    알림 정책
                </Flex>
            ),
            children: <NotificationPolicyForm />,
        },
    ];

    return (
        <Flex vertical gap={24} style={{ padding: '32px', minHeight: '100%', backgroundColor: '#F8FAFC' }}>
            <Flex vertical>
                <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>
                    운영 정책 설정
                </Title>
                <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>
                    센터 정보, 수업 예약 규칙 및 자동 알림 설정을 관리합니다.
                </Text>
            </Flex>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                className="custom-tabs"
                style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #F1F5F9' }}
            />
        </Flex>
    );
};

export default OperationPolicyView;
