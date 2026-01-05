import { useState, useEffect } from 'react';
import { Flex, Input, Typography, Button, message, Card } from 'antd';
import { SearchOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { getTeacherListByCenterId } from '@/entities/teacher/api';
import type { IGetTeacherListByCenterIdAdminResponseV1 } from '@/entities/teacher/api';
import { TeacherTableWidget } from '@/widgets/teacherTable/TeacherTableWidget';
import { AddTeacherModal } from '@/features/addTeacher/AddTeacherModal';

const { Title, Text } = Typography;

const TeacherView = () => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(true);
    const [teachers, setTeachers] = useState<IGetTeacherListByCenterIdAdminResponseV1[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (selectedCenterId) {
            fetchTeachers();
        }
    }, [selectedCenterId]);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const res = await getTeacherListByCenterId(selectedCenterId);
            setTeachers(res.data);
        } catch (error) {
            console.error('Failed to fetch teachers:', error);
            if (error instanceof Error) {
                message.error('선생님 목록을 불러오는데 실패했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (teacher.nickName && teacher.nickName.toLowerCase().includes(searchText.toLowerCase())) ||
        teacher.mobile.includes(searchText)
    );

    return (
        <div style={{ padding: '24px' }}>
            <Flex vertical gap={24}>
                {/* Header Section */}
                <Flex justify="space-between" align="center">
                    <div>
                        <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>선생님 관리</Title>
                        <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>센터의 코치진을 관리하고 새로운 코치를 등록하세요.</Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setIsAddModalOpen(true)}
                        style={{
                            backgroundColor: '#879B7E',
                            borderColor: '#879B7E',
                            borderRadius: '12px',
                            height: '48px',
                            padding: '0 24px',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(135, 155, 126, 0.2)'
                        }}
                    >
                        코치 등록
                    </Button>
                </Flex>

                {/* Filter and Stats Card */}
                <Card
                    style={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                >
                    <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                        <Flex align="center" gap={16}>
                            <div style={{
                                padding: '8px 16px',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '8px',
                                border: '1px solid #F1F5F9'
                            }}>
                                <Flex align="center" gap={8}>
                                    <TeamOutlined style={{ color: '#879B7E' }} />
                                    <Text type="secondary">전체 코치</Text>
                                    <Text strong>{teachers.length}명</Text>
                                </Flex>
                            </div>
                        </Flex>

                        <Input
                            placeholder="이름, 닉네임 또는 휴대번호로 검색"
                            prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{
                                width: '320px',
                                borderRadius: '10px',
                                backgroundColor: '#F8FAFC',
                                border: '1px solid #E2E8F0'
                            }}
                            size="large"
                        />
                    </Flex>
                </Card>

                {/* Table Widget */}
                <TeacherTableWidget data={filteredTeachers} loading={loading} />
            </Flex>

            <AddTeacherModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchTeachers}
            />
        </div>
    );
};

export default TeacherView;
