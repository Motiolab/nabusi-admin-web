import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Flex, Typography, Button, Checkbox, Card, List,
    Input, Modal, message, Spin, Divider, Empty, Tag, Alert,
    Popconfirm, Space
} from 'antd';
import {
    Plus, Trash2, ShieldCheck, RefreshCcw, Lock, ChevronRight,
    Settings, Users, Calendar, Bell, Shield
} from 'lucide-react';
import type { RootState } from '@/app/store';
import {
    getRoleAndUrlPatternByCenterId,
    updateRoleUrlPatternActionByCenterId,
    updateInitRoleUrlPatternActionByCenterId,
    createRoleUrlPatternByCenterId,
    deleteRoleUrlPatternByCenterIdAndRoleId
} from '@/entities/role/api';
import type { IRoleAndUrlPattern, IUrlPattern } from '@/entities/role/api';

const { Text, Title } = Typography;

export const RoleManagement = () => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [roles, setRoles] = useState<IRoleAndUrlPattern[]>([]);
    const [selectedRole, setSelectedRole] = useState<IRoleAndUrlPattern | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');

    useEffect(() => {
        if (selectedCenterId) {
            fetchRoles();
        }
    }, [selectedCenterId]);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await getRoleAndUrlPatternByCenterId(selectedCenterId);
            setRoles(res.data);
            if (!selectedRole && res.data.length > 0) {
                setSelectedRole(res.data[0]);
            } else if (selectedRole) {
                const updated = res.data.find(r => r.id === selectedRole.id);
                if (updated) setSelectedRole(updated);
            }
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            message.error('역할 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePermission = async (actionName: string) => {
        if (!selectedRole || selectedRole.name === 'OWNER') return;

        setActionLoading(true);
        try {
            await updateRoleUrlPatternActionByCenterId(selectedCenterId, {
                roleName: selectedRole.name,
                actionName: actionName
            });
            await fetchRoles();
            message.success('권한이 업데이트되었습니다.');
        } catch (error) {
            console.error('Failed to update permission:', error);
            message.error('권한 업데이트에 실패했습니다.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddRole = async () => {
        if (!newRoleName) return;
        try {
            await createRoleUrlPatternByCenterId(selectedCenterId, newRoleName);
            message.success('새 역할이 생성되었습니다.');
            setNewRoleName('');
            setIsAddRoleModalOpen(false);
            fetchRoles();
        } catch (error) {
            console.error('Failed to create role:', error);
            message.error('역할 생성에 실패했습니다.');
        }
    };

    const handleDeleteRole = async () => {
        if (!selectedRole) return;
        try {
            await deleteRoleUrlPatternByCenterIdAndRoleId(selectedCenterId, selectedRole.id);
            message.success('역할이 삭제되었습니다.');
            setSelectedRole(null);
            fetchRoles();
        } catch (error) {
            console.error('Failed to delete role:', error);
            message.error('역할 삭제에 실패했습니다.');
        }
    };

    const handleResetPermissions = async () => {
        try {
            await updateInitRoleUrlPatternActionByCenterId(selectedCenterId);
            message.success('권한이 초기화되었습니다.');
            fetchRoles();
        } catch (error) {
            console.error('Failed to reset permissions:', error);
            message.error('권한 초기화에 실패했습니다.');
        }
    };

    // Grouping permissions by description first word or common categories
    const groupedPermissions = selectedRole?.urlPatternList.reduce((acc, curr) => {
        const category = curr.description.split(' ')[0] || '기본';
        if (!acc[category]) acc[category] = [];
        acc[category].push(curr);
        return acc;
    }, {} as Record<string, IUrlPattern[]>);

    if (loading && roles.length === 0) {
        return <Flex justify="center" align="center" style={{ height: '400px' }}><Spin size="large" /></Flex>;
    }

    return (
        <Flex gap={24} style={{ height: 'calc(100vh - 250px)' }}>
            {/* Sidebar - Role List */}
            <Card
                title={
                    <Flex justify="space-between" align="center">
                        <Text strong>사용자 역할</Text>
                        <Button type="text" size="small" icon={<Plus size={16} />} onClick={() => setIsAddRoleModalOpen(true)} />
                    </Flex>
                }
                style={{ width: 280, borderRadius: '16px', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ padding: 0, flex: 1, overflow: 'auto' }}
            >
                <List
                    dataSource={roles}
                    renderItem={(role) => (
                        <List.Item
                            onClick={() => setSelectedRole(role)}
                            style={{
                                padding: '16px 20px',
                                cursor: 'pointer',
                                backgroundColor: selectedRole?.id === role.id ? '#F8FAFC' : 'transparent',
                                borderLeft: selectedRole?.id === role.id ? '4px solid #879B7E' : '4px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                                <Flex align="center" gap={12}>
                                    <Shield size={18} color={selectedRole?.id === role.id ? '#879B7E' : '#94A3B8'} />
                                    <Text strong={selectedRole?.id === role.id}>{role.name}</Text>
                                </Flex>
                                <ChevronRight size={16} color="#CBD5E1" />
                            </Flex>
                        </List.Item>
                    )}
                />
            </Card>

            {/* Main - Permission Configuration */}
            <Flex vertical gap={24} style={{ flex: 1, overflow: 'hidden' }}>
                {selectedRole ? (
                    <Card
                        title={
                            <Flex justify="space-between" align="center">
                                <Flex align="center" gap={12}>
                                    <Title level={4} style={{ margin: 0 }}>{selectedRole.name} 권한 설정</Title>
                                    {selectedRole.name === 'OWNER' && <Tag color="gold">모든 권한 허용됨</Tag>}
                                </Flex>
                                {selectedRole.name !== 'OWNER' && (
                                    <Space>
                                        <Button icon={<RefreshCcw size={16} />} onClick={handleResetPermissions}>초기화</Button>
                                        <Popconfirm
                                            title="이 역할을 삭제하시겠습니까?"
                                            description="해당 역할을 가진 모든 사용자의 권한에 영향을 줄 수 있습니다."
                                            onConfirm={handleDeleteRole}
                                        >
                                            <Button danger icon={<Trash2 size={16} />}>역할 삭제</Button>
                                        </Popconfirm>
                                    </Space>
                                )}
                            </Flex>
                        }
                        style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}
                        bodyStyle={{ flex: 1, overflow: 'auto', padding: '24px' }}
                    >
                        {selectedRole.name === 'OWNER' ? (
                            <Alert
                                message="OWNER 역할 안내"
                                description="OWNER는 시스템의 모든 기능에 대한 접근 권한을 가집니다. 권한을 별도로 수정할 수 없습니다."
                                type="info"
                                showIcon
                                icon={<Lock size={20} />}
                                style={{ borderRadius: '12px' }}
                            />
                        ) : (
                            <Flex vertical gap={32}>
                                {groupedPermissions && Object.entries(groupedPermissions).map(([category, permiList]) => (
                                    <div key={category}>
                                        <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                            {category === '센터' && <Settings size={18} color="#64748B" />}
                                            {category === '수업' && <Calendar size={18} color="#64748B" />}
                                            {category === '회원' && <Users size={18} color="#64748B" />}
                                            {category === '알림' && <Bell size={18} color="#64748B" />}
                                            {!['센터', '수업', '회원', '알림'].includes(category) && <ShieldCheck size={18} color="#64748B" />}
                                            {category} 관련 기능
                                        </Title>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                            gap: '16px'
                                        }}>
                                            {permiList.map(item => (
                                                <Card
                                                    key={item.id}
                                                    size="small"
                                                    hoverable
                                                    style={{ borderRadius: '12px', border: '1px solid #F1F5F9' }}
                                                    bodyStyle={{ padding: '12px 16px' }}
                                                >
                                                    <Checkbox
                                                        checked={item.method !== 'NONE'}
                                                        onChange={() => handleTogglePermission(item.actionName)}
                                                        disabled={actionLoading}
                                                    >
                                                        <Text style={{ fontSize: '14px' }}>{item.description}</Text>
                                                    </Checkbox>
                                                </Card>
                                            ))}
                                        </div>
                                        <Divider style={{ margin: '24px 0 0 0' }} />
                                    </div>
                                ))}
                            </Flex>
                        )}
                    </Card>
                ) : (
                    <Card style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '16px' }}>
                        <Empty description="역할을 선택하거나 새로 추가해주세요" />
                    </Card>
                )}
            </Flex>

            {/* Add Role Modal */}
            <Modal
                title="새 역할 추가"
                open={isAddRoleModalOpen}
                onCancel={() => setIsAddRoleModalOpen(false)}
                onOk={handleAddRole}
                okText="생성하기"
                cancelText="취소"
                centered
                okButtonProps={{ style: { backgroundColor: '#879B7E' } }}
            >
                <div style={{ marginTop: 16 }}>
                    <Text type="secondary">역할의 이름을 입력해주세요 (예: 코치, 상담원)</Text>
                    <Input
                        placeholder="역할 이름 입력"
                        size="large"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        style={{ marginTop: 8 }}
                        autoFocus
                    />
                </div>
            </Modal>
        </Flex>
    );
};
