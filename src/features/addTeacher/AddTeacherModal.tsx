import { useState, useEffect } from 'react';
import { Modal, Table, Input, Button, Flex, Typography, message, Tag } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { getMemberListToAddTeacherByCenterId } from '@/entities/member/api';
import type { IMemberByCenterToAddTeacher } from '@/entities/member/api';
import { addTeacherByCenterId } from '@/entities/teacher/api';

const { Text } = Typography;

interface AddTeacherModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddTeacherModal = ({ open, onClose, onSuccess }: AddTeacherModalProps) => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [members, setMembers] = useState<IMemberByCenterToAddTeacher[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

    useEffect(() => {
        if (open && selectedCenterId) {
            fetchMembers();
            setSelectedMemberId(null);
            setSearchText('');
        }
    }, [open, selectedCenterId]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await getMemberListToAddTeacherByCenterId(selectedCenterId);
            setMembers(res.data);
        } catch (error) {
            console.error('Failed to fetch members:', error);
            message.error('회원 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!selectedMemberId) return;

        setSubmitLoading(true);
        try {
            await addTeacherByCenterId(selectedCenterId, selectedMemberId);
            message.success('코치가 성공적으로 등록되었습니다.');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to add coach:', error);
            message.error('코치 등록에 실패했습니다.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const columns = [
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: '휴대폰 번호',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: '역할',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (role: string) => (
                <Tag color="default" style={{ borderRadius: '4px' }}>{role}</Tag>
            )
        }
    ];

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchText.toLowerCase()) ||
        m.mobile.includes(searchText)
    );

    return (
        <Modal
            title={
                <Flex align="center" gap={8}>
                    <UserOutlined style={{ color: '#879B7E' }} />
                    <span>코치 등록</span>
                </Flex>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>취소</Button>,
                <Button
                    key="submit"
                    type="primary"
                    disabled={!selectedMemberId}
                    loading={submitLoading}
                    onClick={handleAdd}
                    style={{ backgroundColor: '#879B7E', borderColor: '#879B7E' }}
                >
                    등록하기
                </Button>
            ]}
            width={600}
            centered
            style={{ borderRadius: '16px', overflow: 'hidden' }}
        >
            <Flex vertical gap={16} style={{ marginTop: 16 }}>
                <Input
                    placeholder="이름 또는 휴대번호로 회원 검색"
                    prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    size="large"
                    style={{ borderRadius: '8px' }}
                />

                <Table
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: selectedMemberId ? [selectedMemberId] : [],
                        onChange: (keys) => setSelectedMemberId(keys[0] as number)
                    }}
                    columns={columns}
                    dataSource={filteredMembers}
                    rowKey="memberId"
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    size="small"
                    style={{ borderRadius: '8px', border: '1px solid #F1F5F9' }}
                />
            </Flex>
        </Modal>
    );
};
