import { useState, useEffect } from 'react';
import { Modal, Table, Input, Button, Flex, message } from 'antd';
import { Plus, Check, X } from 'lucide-react';
import { getWellnessClassNameListByCenterId, createWellnessClassByCenterId } from '@/entities/wellnessClass/api';
import type { IGetWellnessClassNameByCenterIdAdminResponseV1 } from '@/entities/wellnessClass/api';

interface Props {
    centerId: number;
    onCreated: (newClassId: number) => void;
}

export const CreateWellnessClassModal = ({ centerId, onCreated }: Props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<IGetWellnessClassNameByCenterIdAdminResponseV1[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newClassName, setNewClassName] = useState('');

    const fetchClasses = async () => {
        try {
            const res = await getWellnessClassNameListByCenterId(centerId);
            setClasses(res.data);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchClasses();
        }
    }, [open]);

    const handleCreate = async () => {
        if (!newClassName.trim()) {
            return message.warning('그룹 수업 이름을 입력해주세요.');
        }
        setLoading(true);
        try {
            await createWellnessClassByCenterId(centerId, newClassName);
            message.success('그룹 수업이 생성되었습니다.');
            setNewClassName('');
            setIsAdding(false);
            await fetchClasses();
            onCreated(0); // Trigger refresh in main form
        } catch (error) {
            message.error('그룹 수업 생성에 실패했습니다.');
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
            title: '선생님',
            dataIndex: 'teacherName',
            key: 'teacherName',
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
                새 그룹 추가
            </Button>
            <Modal
                title="그룹 수업 추가"
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setIsAdding(false);
                }}
                footer={null}
                width={500}
            >
                <Table
                    dataSource={classes}
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
                            새로운 그룹 수업 추가
                        </Button>
                    ) : (
                        <Flex gap={8}>
                            <Input
                                placeholder="최대 10자"
                                maxLength={10}
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                autoFocus
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
                    )}
                </div>
            </Modal>
        </>
    );
};
