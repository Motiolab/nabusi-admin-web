import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Typography, Modal, message, Skeleton } from 'antd';
import { LogOut, User, Mail, Phone, Shield } from 'lucide-react';
import { removeLocalAccessToken } from '@/shared/lib/token';
import { adminLoginSuccess } from '@/entities/account/api';
import styles from './ProfileView.module.css';

const { Title, Text } = Typography;

const ProfileView = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<{
        name: string;
        email: string;
        mobile: string;
        role: string;
    } | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Try to get user data from login success API
                const res = await adminLoginSuccess();
                if (res.data) {
                    setUserData({
                        name: res.data.name || '관리자',
                        email: res.data.email || '-',
                        mobile: res.data.mobile || '-',
                        role: res.data.roleName || '관리자',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                // Fallback or handle error
                setUserData({
                    name: '관리자',
                    email: '-',
                    mobile: '-',
                    role: '관리자',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        Modal.confirm({
            title: '로그아웃',
            content: '정말 로그아웃 하시겠습니까?',
            okText: '로그아웃',
            cancelText: '취소',
            okButtonProps: { danger: true },
            onOk: () => {
                removeLocalAccessToken();
                message.success('로그아웃 되었습니다.');
                navigate('/login');
            },
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Title level={2} className={styles.title} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>내 프로필</Title>
                <Text type="secondary" className={styles.subtitle} style={{ fontSize: '14px', color: '#64748B' }}>계정 정보 및 설정을 관리합니다.</Text>
            </div>

            <div className={styles.contentCard}>
                {loading ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                ) : (
                    <div className={styles.profileSection}>
                        <Flex vertical gap={24}>
                            <div className={styles.profileItem}>
                                <Flex align="center" gap={12} className={styles.label}>
                                    <User size={16} />
                                    <span>이름</span>
                                </Flex>
                                <div className={styles.value}>{userData?.name}</div>
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.profileItem}>
                                <Flex align="center" gap={12} className={styles.label}>
                                    <Mail size={16} />
                                    <span>이메일</span>
                                </Flex>
                                <div className={styles.value}>{userData?.email}</div>
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.profileItem}>
                                <Flex align="center" gap={12} className={styles.label}>
                                    <Phone size={16} />
                                    <span>휴대폰 번호</span>
                                </Flex>
                                <div className={styles.value}>{userData?.mobile}</div>
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.profileItem}>
                                <Flex align="center" gap={12} className={styles.label}>
                                    <Shield size={16} />
                                    <span>권한</span>
                                </Flex>
                                <div className={styles.value}>{userData?.role}</div>
                            </div>
                        </Flex>

                        <Button
                            type="primary"
                            danger
                            icon={<LogOut size={18} />}
                            onClick={handleLogout}
                            className={styles.logoutButton}
                            block
                        >
                            로그아웃
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileView;
