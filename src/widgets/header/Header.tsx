import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Flex } from 'antd';
import { RetweetOutlined } from '@ant-design/icons';
import type { RootState } from '@/app/store';
import { getCenterListByAdminUser } from '@/entities/member/api';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

export const Header = () => {
    const navigate = useNavigate();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const [centerName, setCenterName] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        if (selectedCenterId) {
            getCenterListByAdminUser().then(res => {
                const center = res.data.find(c => c.id === selectedCenterId);
                if (center) {
                    setCenterName(center.name);
                    setIsActive(center.isActive);
                }
            });
        }
    }, [selectedCenterId]);

    return (
        <header className={styles.header}>
            <Flex justify="space-between" align="center" style={{ height: '100%' }}>
                <div className={styles.centerInfo}>
                    <span className={styles.label}>현재 지점</span>
                    <span className={styles.name}>{centerName || '지연됨...'}</span>
                    {centerName && (
                        <span style={{
                            fontSize: '12px',
                            color: isActive ? '#10B981' : '#94A3B8',
                            backgroundColor: isActive ? '#ECFDF5' : '#F1F5F9',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: '600',
                            marginLeft: '8px'
                        }}>
                            {isActive ? '앱 노출 중' : '심사 대기'}
                        </span>
                    )}
                </div>
                <Button
                    type="text"
                    icon={<RetweetOutlined />}
                    onClick={() => navigate('/centerselect')}
                    className={styles.switchButton}
                >
                    지점 변경
                </Button>
            </Flex>
        </header>
    );
};
