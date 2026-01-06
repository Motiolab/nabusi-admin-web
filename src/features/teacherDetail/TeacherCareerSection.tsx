import { useState } from 'react';
import { Card, Flex, Typography, Button, Input, message } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, TrophyOutlined } from '@ant-design/icons';
import { updateTeacherCareerById } from '@/entities/teacher/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface TeacherCareerSectionProps {
    teacherId: number;
    centerId: number;
    initCareer: string;
    onUpdate: () => void;
}

export const TeacherCareerSection = ({
    teacherId,
    centerId,
    initCareer,
    onUpdate
}: TeacherCareerSectionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [career, setCareer] = useState(initCareer);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateTeacherCareerById({
                id: teacherId,
                centerId,
                career
            });
            message.success('주요 이력이 성공적으로 수정되었습니다.');
            onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update career:', error);
            message.error('주요 이력 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setCareer(initCareer);
        setIsEditing(false);
    };

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <TrophyOutlined style={{ color: '#879B7E' }} />
                    <Title level={5} style={{ margin: 0 }}>주요 이력</Title>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: 8 }}>
                        회원에게 보이는 내용입니다.
                    </Text>
                </Flex>
            }
            extra={
                !isEditing ? (
                    <Button type="text" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>수정</Button>
                ) : (
                    <Flex gap={8}>
                        <Button size="small" icon={<CloseOutlined />} onClick={handleCancel}>취소</Button>
                        <Button
                            size="small"
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={handleSave}
                            loading={loading}
                            style={{ backgroundColor: '#879B7E', borderColor: '#879B7E' }}
                        >
                            저장
                        </Button>
                    </Flex>
                )
            }
            style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginTop: '24px' }}
        >
            {!isEditing ? (
                <Paragraph style={{ color: '#475569', whiteSpace: 'pre-line', margin: 0 }}>
                    {initCareer || '등록된 이력이 없습니다.'}
                </Paragraph>
            ) : (
                <TextArea
                    rows={8}
                    value={career}
                    onChange={e => setCareer(e.target.value)}
                    placeholder="경력, 자격 사항 등 주요 이력을 작성해 주세요."
                    style={{ borderRadius: '12px' }}
                />
            )}
        </Card>
    );
};
