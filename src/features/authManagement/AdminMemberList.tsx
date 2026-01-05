import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Table, Button, Input, Flex, Typography, Select,
    message, Popconfirm, Modal, Space, Divider, Tag, Form
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Search, UserPlus, ShieldAlert, Trash2, ArrowLeftRight } from 'lucide-react';
import type { RootState } from '@/app/store';
import {
    getAdminMemberListByCenterId,
    updateMemberRole,
    deleteAdminRoleByMemberIdList,
    passOwnerRole,
    inviteAdminMemberByCenterId
} from '@/entities/member/api';
import type { IAdminMemberByCenter } from '@/entities/member/api';
import { getRoleInfoListByCenterId } from '@/entities/role/api';
import type { IRoleInfo } from '@/entities/role/api';

const { Text } = Typography;

export const AdminMemberList = () => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [admins, setAdmins] = useState<IAdminMemberByCenter[]>([]);
    const [roles, setRoles] = useState<IRoleInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Selection for deletion or owner transfer
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // Modals
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteForm] = Form.useForm();

    useEffect(() => {
        if (selectedCenterId) {
            fetchData();
        }
    }, [selectedCenterId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [adminsRes, rolesRes] = await Promise.all([
                getAdminMemberListByCenterId(selectedCenterId),
                getRoleInfoListByCenterId(selectedCenterId)
            ]);
            setAdmins(adminsRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error('Failed to fetch admin list:', error);
            message.error('관리자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (memberId: number, roleId: number) => {
        try {
            await updateMemberRole(selectedCenterId, roleId, memberId);
            message.success('역할이 변경되었습니다.');
            fetchData();
        } catch (error) {
            console.error('Failed to update role:', error);
            message.error('역할 변경에 실패했습니다.');
        }
    };

    const handleInvite = async (values: any) => {
        try {
            await inviteAdminMemberByCenterId(selectedCenterId, {
                mobile: values.mobile,
                roleId: values.roleId
            });
            message.success('초대가 발송되었습니다.');
            setIsInviteModalOpen(false);
            inviteForm.resetFields();
        } catch (error) {
            console.error('Failed to invite:', error);
            message.error('초대 발송에 실패했습니다.');
        }
    };

    const handleDeleteAdmins = async () => {
        try {
            await deleteAdminRoleByMemberIdList(selectedCenterId, selectedRowKeys as number[]);
            message.success('선택한 관리자가 삭제되었습니다.');
            setSelectedRowKeys([]);
            fetchData();
        } catch (error) {
            console.error('Failed to delete admins:', error);
            message.error('관리자 삭제에 실패했습니다.');
        }
    };

    const handleTransferOwner = async () => {
        if (selectedRowKeys.length === 0) return;
        try {
            await passOwnerRole(selectedCenterId, selectedRowKeys[0] as number);
            message.success('Owner 권한이 이전되었습니다.');
            setSelectionType('checkbox');
            setSelectedRowKeys([]);
            fetchData();
        } catch (error) {
            console.error('Failed to transfer owner:', error);
            message.error('Owner 권한 이전에 실패했습니다.');
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchText.toLowerCase()) ||
        admin.mobile.includes(searchText)
    );

    const columns: ColumnsType<IAdminMemberByCenter> = [
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: '휴대폰 번호',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 180,
        },
        {
            title: '이메일',
            dataIndex: 'email',
            key: 'email',
            width: 250,
        },
        {
            title: '역할',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 180,
            render: (roleName, record) => {
                if (roleName === 'OWNER') {
                    return <Tag color="gold" icon={<ShieldAlert size={14} />}>OWNER</Tag>;
                }
                return (
                    <Select
                        size="small"
                        value={record.roleId}
                        style={{ width: '100%' }}
                        onChange={(val) => handleRoleChange(record.memberId, val)}
                        options={roles.filter(r => r.name !== 'OWNER').map(r => ({ label: r.name, value: r.id }))}
                    />
                );
            },
        },
        {
            title: '작업',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => {
                if (record.roleName === 'OWNER') return null;
                return (
                    <Popconfirm
                        title="관리자를 삭제하시겠습니까?"
                        onConfirm={() => {
                            setSelectedRowKeys([record.memberId]);
                            handleDeleteAdmins();
                        }}
                    >
                        <Button type="text" danger icon={<Trash2 size={16} />} />
                    </Popconfirm>
                );
            }
        },
    ];

    return (
        <Flex vertical gap={24}>
            <Flex justify="space-between" align="center">
                <Flex gap={12}>
                    <Input
                        placeholder="이름 또는 휴대폰 번호 검색"
                        prefix={<Search size={18} color="#94A3B8" />}
                        style={{ width: 300, borderRadius: '8px' }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<UserPlus size={18} />}
                        onClick={() => setIsInviteModalOpen(true)}
                        style={{ backgroundColor: '#1E293B', borderRadius: '8px' }}
                    >
                        관리자 초대
                    </Button>
                </Flex>

                <Space>
                    {selectionType === 'checkbox' ? (
                        <>
                            <Button
                                icon={<ArrowLeftRight size={18} />}
                                onClick={() => setSelectionType('radio')}
                                style={{ borderRadius: '8px' }}
                            >
                                Owner 권한 위임
                            </Button>
                            {selectedRowKeys.length > 0 && (
                                <Popconfirm
                                    title={`${selectedRowKeys.length}명의 관리자를 삭제하시겠습니까?`}
                                    onConfirm={handleDeleteAdmins}
                                >
                                    <Button type="primary" danger icon={<Trash2 size={18} />} style={{ borderRadius: '8px' }}>
                                        선택 삭제
                                    </Button>
                                </Popconfirm>
                            )}
                        </>
                    ) : (
                        <Space>
                            <Text type="secondary" style={{ fontSize: '13px' }}>위임할 관리자를 선택하세요</Text>
                            <Button onClick={() => { setSelectionType('checkbox'); setSelectedRowKeys([]); }}>취소</Button>
                            <Button
                                type="primary"
                                disabled={selectedRowKeys.length === 0}
                                onClick={handleTransferOwner}
                                style={{ backgroundColor: '#879B7E', borderColor: '#879B7E' }}
                            >
                                위임 실행
                            </Button>
                        </Space>
                    )}
                </Space>
            </Flex>

            <Table
                columns={columns}
                dataSource={filteredAdmins}
                loading={loading}
                rowKey="memberId"
                rowSelection={{
                    type: selectionType,
                    selectedRowKeys,
                    onChange: (keys) => setSelectedRowKeys(keys),
                    getCheckboxProps: (record) => ({
                        disabled: record.roleName === 'OWNER',
                    }),
                }}
                pagination={{ pageSize: 10 }}
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #F1F5F9',
                    overflow: 'hidden'
                }}
            />

            <Modal
                title="신규 관리자 초대"
                open={isInviteModalOpen}
                onCancel={() => setIsInviteModalOpen(false)}
                footer={null}
                width={450}
                centered
            >
                <Form
                    form={inviteForm}
                    layout="vertical"
                    onFinish={handleInvite}
                    style={{ marginTop: 24 }}
                >
                    <Form.Item
                        label="휴대폰 번호"
                        name="mobile"
                        rules={[{ required: true, message: '휴대폰 번호를 입력해주세요' }]}
                    >
                        <Input placeholder="01012345678" size="large" />
                    </Form.Item>
                    <Form.Item
                        label="역할 선택"
                        name="roleId"
                        rules={[{ required: true, message: '역할을 선택해주세요' }]}
                    >
                        <Select
                            size="large"
                            placeholder="초대할 사용자의 역할을 선택하세요"
                            options={roles.filter(r => r.name !== 'OWNER').map(r => ({ label: r.name, value: r.id }))}
                        />
                    </Form.Item>
                    <Divider />
                    <Flex vertical gap={8} style={{ marginBottom: 24 }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>• 입력하신 번호로 관리자 가입 링크가 발송됩니다.</Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>• 가입 완료 후 선택하신 권한으로 활동이 가능합니다.</Text>
                    </Flex>
                    <Button type="primary" size="large" block htmlType="submit" style={{ backgroundColor: '#1E293B', height: 48, borderRadius: '8px' }}>
                        초대 메시지 발송
                    </Button>
                </Form>
            </Modal>
        </Flex>
    );
};
