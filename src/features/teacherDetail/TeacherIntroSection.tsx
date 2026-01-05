import { useState } from 'react';
import { Card, Flex, Typography, Button, Radio, Input, message, Divider, Tag } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { updateTeacherIntroduceAndNickNameById } from '@/entities/teacher/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface TeacherIntroSectionProps {
    teacherId: number;
    centerId: number;
    initNickName: string;
    initIntroduce: string;
    initUseNickName: boolean;
    onUpdate: () => void;
}

export const TeacherIntroSection = ({
    teacherId,
    centerId,
    initNickName,
    initIntroduce,
    initUseNickName,
    onUpdate
}: TeacherIntroSectionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [useNickName, setUseNickName] = useState(initUseNickName);
    const [nickName, setNickName] = useState(initNickName);
    const [introduce, setIntroduce] = useState(initIntroduce);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateTeacherIntroduceAndNickNameById({
                id: teacherId,
                centerId,
                useNickName,
                nickName,
                introduce
            });
            message.success('자기소개가 성공적으로 수정되었습니다.');
            onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update intro:', error);
            message.error('자기소개 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setUseNickName(initUseNickName);
        setNickName(initNickName);
        setIntroduce(initIntroduce);
        setIsEditing(false);
    };

    return (
        <Card
            title={
                <Flex align="center" gap={8}>
                    <InfoCircleOutlined style={{ color: '#879B7E' }} />
                    <Title level={5} style={{ margin: 0 }}>자기소개</Title>
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
            style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
        >
            <Flex vertical gap={24}>
                {!isEditing ? (
                    <>
                        <Flex align="center" gap={16}>
                            <Text strong style={{ width: 80 }}>닉네임</Text>
                            <Flex align="center" gap={8}>
                                <Text>{initNickName || '-'}</Text>
                                {initUseNickName ? (
                                    <Tag color="processing">사용 중</Tag>
                                ) : (
                                    <Tag color="default">사용 안 함</Tag>
                                )}
                            </Flex>
                        </Flex>
                        <Divider style={{ margin: 0 }} />
                        <Flex vertical gap={8}>
                            <Text strong>소개글</Text>
                            <Paragraph style={{ color: '#475569', whiteSpace: 'pre-line' }}>
                                {initIntroduce || '등록된 소개글이 없습니다.'}
                            </Paragraph>
                        </Flex>
                    </>
                ) : (
                    <>
                        <Flex align="center" gap={16} wrap="wrap">
                            <Text strong style={{ width: 80 }}>닉네임 사용</Text>
                            <Radio.Group value={useNickName} onChange={e => setUseNickName(e.target.value)}>
                                <Radio value={true}>사용</Radio>
                                <Radio value={false}>사용 안 함</Radio>
                            </Radio.Group>
                            <Input
                                placeholder="닉네임을 입력하세요"
                                value={nickName}
                                onChange={e => setNickName(e.target.value)}
                                style={{ width: '200px', borderRadius: '8px' }}
                            />
                        </Flex>
                        <Flex vertical gap={8}>
                            <Text strong>소개글</Text>
                            <TextArea
                                rows={6}
                                value={introduce}
                                onChange={e => setIntroduce(e.target.value)}
                                placeholder="회원들에게 보여줄 친절한 소개글을 작성해 주세요."
                                style={{ borderRadius: '12px' }}
                            />
                        </Flex>
                    </>
                )}
            </Flex>
        </Card>
    );
};
