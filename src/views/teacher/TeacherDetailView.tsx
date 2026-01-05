import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Flex,
    Typography,
    Button,
    Card,
    Tabs,
    Tag,
    Space,
    Divider,
    message,
    Modal,
    Breadcrumb,
    Avatar
} from 'antd';
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    MailOutlined,
    PhoneOutlined,
    DeleteOutlined,
    UndoOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import {
    getTeacherDetailById,
    deleteTeacherById,
    restoreTeacherById,
    updateTeacherImageUrlById
} from '@/entities/teacher/api';
import type { IGetTeacherDetailById } from '@/entities/teacher/api';
import { ImageUploader } from '@/shared/ui/ImageUploader';
import { TeacherIntroSection } from '@/features/teacherDetail/TeacherIntroSection';
import { TeacherCareerSection } from '@/features/teacherDetail/TeacherCareerSection';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const TeacherDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState<IGetTeacherDetailById | null>(null);

    useEffect(() => {
        if (selectedCenterId && id) {
            fetchTeacherDetail();
        }
    }, [selectedCenterId, id]);

    const fetchTeacherDetail = async () => {
        setLoading(true);
        try {
            const res = await getTeacherDetailById(selectedCenterId, Number(id));
            setTeacher(res.data);
        } catch (error) {
            console.error('Failed to fetch teacher detail:', error);
            message.error('선생님 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (url: string) => {
        if (!teacher) return;
        try {
            await updateTeacherImageUrlById({
                id: teacher.id,
                centerId: selectedCenterId,
                imageUrl: url
            });
            fetchTeacherDetail();
        } catch (error) {
            console.error('Failed to update image:', error);
            message.error('이미지 업데이트에 실패했습니다.');
        }
    };

    const handleDelete = () => {
        if (!teacher) return;
        Modal.confirm({
            title: '코치 삭제',
            content: '정말로 이 코치를 삭제하시겠습니까? 삭제된 코치는 나중에 다시 복구할 수 있습니다.',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk: async () => {
                try {
                    await deleteTeacherById(selectedCenterId, teacher.id);
                    message.success('코치가 삭제되었습니다.');
                    fetchTeacherDetail();
                } catch (error) {
                    message.error('삭제에 실패했습니다.');
                }
            }
        });
    };

    const handleRestore = () => {
        if (!teacher) return;
        Modal.confirm({
            title: '코치 복구',
            content: '이 코치를 다시 활성화하시겠습니까?',
            okText: '복구',
            cancelText: '취소',
            onOk: async () => {
                try {
                    await restoreTeacherById(selectedCenterId, teacher.id);
                    message.success('코치가 복구되었습니다.');
                    fetchTeacherDetail();
                } catch (error) {
                    message.error('복구에 실패했습니다.');
                }
            }
        });
    };

    if (loading && !teacher) {
        return <div style={{ padding: '24px', textAlign: 'center' }}>로딩 중...</div>;
    }

    if (!teacher) {
        return <div style={{ padding: '24px', textAlign: 'center' }}>선생님 정보를 찾을 수 없습니다.</div>;
    }

    const infoItems = [
        { icon: <PhoneOutlined />, label: '휴대폰 번호', value: teacher.mobile },
        { icon: <MailOutlined />, label: '이메일', value: teacher.email || '-' },
        { icon: <CalendarOutlined />, label: '센터 등록일', value: dayjs(teacher.createdDate).format('YYYY년 MM월 DD일') },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Flex vertical gap={24}>
                {/* Header & Navigation */}
                <Flex justify="space-between" align="center">
                    <Flex vertical gap={8}>
                        <Breadcrumb items={[
                            { title: <a onClick={() => navigate('/teacher')}>선생님 관리</a> },
                            { title: '상세 정보' }
                        ]} />
                        <Flex align="center" gap={12}>
                            <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/teacher')} />
                            <Title level={3} style={{ margin: 0 }}>코치 상세 프로필</Title>
                        </Flex>
                    </Flex>

                    {teacher.isDelete ? (
                        <Button icon={<UndoOutlined />} onClick={handleRestore}>코치 복구</Button>
                    ) : (
                        <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>코치 삭제</Button>
                    )}
                </Flex>

                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: '1',
                            label: '기본 정보',
                            children: (
                                <Flex vertical gap={24}>
                                    <Flex gap={24} wrap="wrap">
                                        {/* Left Side: Profile Card */}
                                        <Card
                                            style={{
                                                width: 380,
                                                borderRadius: '16px',
                                                border: 'none',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                            }}
                                        >
                                            <Flex vertical align="center" gap={16}>
                                                <div style={{ position: 'relative' }}>
                                                    <ImageUploader
                                                        initImageUrl={teacher.imageUrl}
                                                        onUploadSuccess={handleImageUpload}
                                                        size={140}
                                                    />
                                                    {teacher.isDelete && (
                                                        <Tag
                                                            color="error"
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                right: 0,
                                                                margin: 0,
                                                                borderRadius: '4px'
                                                            }}
                                                        >
                                                            삭제됨
                                                        </Tag>
                                                    )}
                                                </div>
                                                <Flex vertical align="center" gap={4}>
                                                    <Title level={4} style={{ margin: 0 }}>{teacher.name}</Title>
                                                    {teacher.nickName && <Text type="secondary">({teacher.nickName})</Text>}
                                                </Flex>

                                                <Divider style={{ margin: '8px 0' }} />

                                                <Flex vertical gap={12} style={{ width: '100%' }}>
                                                    {infoItems.map((item, idx) => (
                                                        <Flex key={idx} justify="space-between" align="center">
                                                            <Space style={{ color: '#64748B' }}>
                                                                {item.icon}
                                                                <Text type="secondary">{item.label}</Text>
                                                            </Space>
                                                            <Text strong>{item.value}</Text>
                                                        </Flex>
                                                    ))}
                                                </Flex>
                                            </Flex>
                                        </Card>

                                        {/* Right Side: Introduction & Career */}
                                        <Flex vertical gap={24} style={{ flex: 1, minWidth: 400 }}>
                                            <TeacherIntroSection
                                                teacherId={teacher.id}
                                                centerId={selectedCenterId}
                                                initNickName={teacher.nickName}
                                                initIntroduce={teacher.introduce}
                                                initUseNickName={teacher.useNickName}
                                                onUpdate={fetchTeacherDetail}
                                            />
                                            <TeacherCareerSection
                                                teacherId={teacher.id}
                                                centerId={selectedCenterId}
                                                initCareer={teacher.career}
                                                onUpdate={fetchTeacherDetail}
                                            />
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )
                        },
                        {
                            key: '2',
                            label: '수업 리뷰',
                            children: (
                                <Card style={{ textAlign: 'center', padding: '40px', borderRadius: '16px', border: 'none' }}>
                                    <Text type="secondary">현재 준비 중인 기능입니다.</Text>
                                </Card>
                            )
                        }
                    ]}
                />
            </Flex>
        </div>
    );
};

export default TeacherDetailView;
