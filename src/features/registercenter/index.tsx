import { PlusCircleOutlined } from "@ant-design/icons";
import { CenterNameInput } from "@/shared/ui/CenterNameInput";
import { Button, Input, Modal, Space, notification } from "antd";
import { useState } from "react";
import { SearchAddress } from "../searchAddress";
import type { IAddressInfo } from "../searchAddress";
import { createCenter } from "@/entities/companyManagement/api";
import type { ICreateCenterRequest } from "@/entities/companyManagement/api";

interface IProps {
    onSuccess?: () => void;
}

const RegisterCenter = ({ onSuccess }: IProps) => {
    const [isOpenRegisterCenterModal, setIsOpenRegisterCenterModal] = useState<boolean>(false);
    const [centerName, setCenterName] = useState<string>('');
    const [addressInfo, setAddressInfo] = useState<IAddressInfo>({ address: '', roadName: '' });
    const [addressDetail, setAddressDetail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const resetForm = () => {
        setCenterName('');
        setAddressInfo({ address: '', roadName: '' });
        setAddressDetail('');
    };

    const clickRegisterButton = async () => {
        if (!centerName || !addressInfo.address) {
            notification.error({ message: '모든 필드를 입력해주세요.' });
            return;
        }

        const request: ICreateCenterRequest = {
            name: centerName,
            address: addressInfo.address,
            detailAddress: addressDetail,
            roadName: addressInfo.roadName
        };

        setLoading(true);
        try {
            const res = await createCenter(request);
            if (res.data === true) {
                notification.success({ message: '센터가 성공적으로 등록되었습니다.' });
                onSuccess?.();
                setIsOpenRegisterCenterModal(false);
                resetForm();
            }
        } catch (e) {
            console.error('error', e);
            notification.error({ message: '센터 등록에 실패했습니다.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{
                border: '1px solid #E2E8F0',
                padding: '24px',
                textAlign: 'center',
                borderRadius: '16px',
                backgroundColor: '#F8FAFC'
            }}>
                <div style={{ color: '#64707D', fontSize: '14px', marginBottom: 12 }}>센터를 운영중이신가요?</div>
                <Space
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onClick={() => setIsOpenRegisterCenterModal(true)}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                    <div style={{ color: '#879B7E', fontWeight: '700', fontSize: '16px' }}>새로운 센터 등록하기</div>
                    <PlusCircleOutlined style={{ fontSize: '18px', color: '#879B7E' }} />
                </Space>
            </div>

            <Modal
                title={
                    <div style={{ fontSize: '20px', fontWeight: '700', paddingBottom: '8px' }}>
                        새로운 센터 등록하기
                    </div>
                }
                open={isOpenRegisterCenterModal}
                onCancel={() => {
                    if (!loading) setIsOpenRegisterCenterModal(false);
                }}
                centered
                width={480}
                footer={
                    <Button
                        type="primary"
                        size="large"
                        block
                        loading={loading}
                        onClick={clickRegisterButton}
                        style={{
                            height: '52px',
                            borderRadius: '12px',
                            backgroundColor: '#879B7E',
                            borderColor: '#879B7E'
                        }}
                    >
                        등록하기
                    </Button>
                }
            >
                <div style={{ padding: '8px 0' }}>
                    <div style={{
                        backgroundColor: '#F1F5F9',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        color: '#64707D',
                        fontSize: '14px',
                        marginBottom: '24px'
                    }}>
                        센터 등록 시 자동으로 관리자(Owner)로 설정됩니다.
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <CenterNameInput centerName={centerName} setCenterName={setCenterName} />
                    </div>

                    <div>
                        <SearchAddress addressInfo={addressInfo} setAddressInfo={setAddressInfo} />
                        <Input
                            size="large"
                            placeholder="상세 주소를 입력해 주세요"
                            value={addressDetail}
                            onChange={(e) => setAddressDetail(e.target.value)}
                            style={{ marginTop: 12, borderRadius: '8px' }}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RegisterCenter;
