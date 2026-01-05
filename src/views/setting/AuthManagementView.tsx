import { useState } from 'react';
import { Flex, Typography, Tabs } from 'antd';
import { Users, ShieldCheck } from 'lucide-react';
import { AdminMemberList } from '@/features/authManagement/AdminMemberList';
import { RoleManagement } from '@/features/authManagement/RoleManagement';

const { Title, Text } = Typography;

const AuthManagementView = () => {
    const [activeTab, setActiveTab] = useState('1');

    const items = [
        {
            key: '1',
            label: (
                <Flex align="center" gap={8}>
                    <Users size={18} />
                    관리자 목록
                </Flex>
            ),
            children: <AdminMemberList />,
        },
        {
            key: '2',
            label: (
                <Flex align="center" gap={8}>
                    <ShieldCheck size={18} />
                    역할 및 권한 관리
                </Flex>
            ),
            children: <RoleManagement />,
        },
    ];

    return (
        <Flex vertical gap={24} style={{ padding: '32px', minHeight: '100%', backgroundColor: '#F8FAFC' }}>
            <Flex vertical>
                <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>
                    권한 관리
                </Title>
                <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>
                    센터 운영진의 접근 권한을 설정하고 역할을 관리합니다.
                </Text>
            </Flex>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                className="custom-tabs"
                style={{
                    backgroundColor: '#FFFFFF',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
            />
        </Flex>
    );
};

export default AuthManagementView;
