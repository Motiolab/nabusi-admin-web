import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import type { RootState } from '@/app/store';

interface CenterGuardProps {
    children: React.ReactNode;
}

let isModalOpen = false;

export const CenterGuard = ({ children }: CenterGuardProps) => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const navigate = useNavigate();

    useEffect(() => {
        if ((!selectedCenterId || selectedCenterId === 0) && !isModalOpen) {
            isModalOpen = true;
            Modal.warning({
                title: '지점 선택 필요',
                content: '서비스 이용을 위해 지점을 먼저 선택해주세요.',
                okText: '확인',
                onOk: () => {
                    isModalOpen = false;
                    navigate('/centerselect');
                },
                onCancel: () => {
                    isModalOpen = false;
                },
                maskClosable: false,
                keyboard: false,
            });
        }
    }, [selectedCenterId, navigate]);

    if (!selectedCenterId || selectedCenterId === 0) {
        return null;
    }

    return <>{children}</>;
};
