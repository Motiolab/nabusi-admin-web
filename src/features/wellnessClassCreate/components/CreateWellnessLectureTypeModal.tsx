import { useState, useEffect } from 'react';
import { Modal, Table, Input, Button, Flex, message } from 'antd';
import { Plus, Check, X } from 'lucide-react';
import { getWellnessLectureTypeNameListByCenterId, createWellnessLectureTypeByCenterId } from '@/entities/wellnessLectureType/api';
import type { IGetWellnessLectureTypeNameListByCenterIdAdminResponseV1 } from '@/entities/wellnessLectureType/api';

interface Props {
    centerId: number;
    onCreated: () => void;
}

export const CreateWellnessLectureTypeModal = ({ centerId, onCreated }: Props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [types, setTypes] = useState<IGetWellnessLectureTypeNameListByCenterIdAdminResponseV1[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const fetchTypes = async () => {
        try {
            const res = await getWellnessLectureTypeNameListByCenterId(centerId);
            setTypes(res.data);
        } catch (error) {
            console.error('Failed to fetch lecture types:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchTypes();
        }
    }, [open]);

    const handleCreate = async () => {
        if (!newName.trim()) {
            return message.warning('수업 종류 이름을 입력해주세요.');
        }
        setLoading(true);
        try {
            await createWellnessLectureTypeByCenterId(centerId, newName, newDescription);
            message.success('수업 종류가 생성되었습니다.');
            setNewName('');
            setNewDescription('');
            setIsAdding(false);
            await fetchTypes();
            onCreated(); // Refresh the dropdown in main form
        } catch (error) {
            message.error('수업 종류 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '설명',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => text || '-',
        }
    ];

    return (
        <>
            <Button
                type="link"
                size="small"
                icon={<Plus size={14} />}
                onClick={() => setOpen(true)}
                style={{ padding: 0, height: 'auto', fontSize: '12px' }}
            >
                새 종류 추가
            </Button>
            <Modal
                title="수업 종류 추가"
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setIsAdding(false);
                }}
                footer={null}
                width={600}
            >
                <Table
                    dataSource={types}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    scroll={{ y: 300 }}
                    size="small"
                />
                <div style={{ marginTop: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                    {!isAdding ? (
                        <Button
                            type="dashed"
                            block
                            icon={<Plus size={16} />}
                            onClick={() => setIsAdding(true)}
                        >
                            새로운 수업 종류 추가
                        </Button>
                    ) : (
                        <Flex gap={8} vertical>
                            <Flex gap={8}>
                                <Input
                                    placeholder="수업 종류 이름"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    autoFocus
                                />
                                <Input
                                    placeholder="설명 (선택)"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                                <Button
                                    type="primary"
                                    icon={<Check size={16} />}
                                    loading={loading}
                                    onClick={handleCreate}
                                />
                                <Button
                                    icon={<X size={16} />}
                                    onClick={() => setIsAdding(false)}
                                />
                            </Flex>
                        </Flex>
                    )}
                </div>
            </Modal>
        </>
    );
};
