import RegisterCenter from "@/features/registercenter";
import type { IGetMyCenterListByMemberIdResponseV1 } from '@/entities/member/api';
import { getCenterListByAdminUser } from '@/entities/member/api';
import { Fragment, useEffect, useState } from 'react';
import { setSelectedCenterId } from '@/entities/selectedCenterId/model/reducer';
import { useNavigate } from "react-router-dom";
import { adminLoginSuccess } from "@/entities/account/api";
import { getRedirectUrlAfterLogin, setRedirectUrlAfterLogin } from "@/shared/lib/redirect";
import { Flex, Badge } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '@/app/store';


const BRAND_PRIMARY = '#879B7E';
const BRAND_SECONDARY = '#F1F5F9';

const CenterSelectWidget = () => {
    const navigate = useNavigate();
    const [centerList, setCenterList] = useState<Array<IGetMyCenterListByMemberIdResponseV1>>([]);
    const dispatch = useDispatch();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    useEffect(() => {
        requestCenterListByAdminUser();
    }, []);

    const requestCenterListByAdminUser = async () => {
        try {
            // await adminLoginSuccess();
            const redirectUrlAfterLogin = getRedirectUrlAfterLogin();
            if (redirectUrlAfterLogin) {
                setRedirectUrlAfterLogin('undefined');
                navigate(redirectUrlAfterLogin);
                return;
            }

            const res = await getCenterListByAdminUser();
            setCenterList(res.data);
        } catch (error) {
            console.error('Failed to fetch center list:', error);
        }
    };

    return (
        <>
            {centerList.length === 0 ? (
                <div style={{
                    border: '1px solid #E2E8F0',
                    padding: '40px 20px',
                    textAlign: 'center',
                    borderRadius: '16px',
                    backgroundColor: '#F8FAFC'
                }}>
                    <div style={{ fontWeight: '700', color: '#191919', fontSize: '16px' }}>아직 초대받은 센터가 없습니다</div>
                    <div style={{ marginTop: 12, color: '#64707D', lineHeight: '1.6', fontSize: '14px' }}>
                        이미 나부시에 등록된 센터 가입을 원하신다면,<br />
                        관리자에게 초대링크를 요청하세요
                    </div>
                </div>
            ) : (
                centerList.map((center) => {
                    const isSelected = center.id === selectedCenterId;
                    return (
                        <Fragment key={center.id}>
                            <div
                                style={{
                                    marginBottom: 16,
                                    padding: '24px',
                                    border: isSelected ? `2px solid ${BRAND_PRIMARY}` : '1px solid #E2E8F0',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#FAFCF9' : '#FFFFFF',
                                    transition: 'all 0.2s ease-in-out',
                                    boxShadow: isSelected ? `0 4px 12px rgba(135, 155, 126, 0.15)` : '0 2px 8px rgba(0, 0, 0, 0.04)',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor = BRAND_PRIMARY;
                                        e.currentTarget.style.boxShadow = `0 4px 12px rgba(135, 155, 126, 0.15)`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor = '#E2E8F0';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                                    }
                                }}
                                onClick={() => {
                                    dispatch(setSelectedCenterId(center.id));
                                    navigate('/');
                                }}
                            >
                                <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1A1C1E' }}>{center.name}</div>
                                    {isSelected && (
                                        <Badge
                                            count="접속 중"
                                            style={{
                                                backgroundColor: BRAND_PRIMARY,
                                                fontSize: '11px',
                                                fontWeight: '700'
                                            }}
                                        />
                                    )}
                                </Flex>
                                <div style={{ marginTop: 8, color: '#64707D', fontSize: '14px' }}>{center.address} {center.detailAddress}</div>
                                <Flex gap={8} style={{ marginTop: 12 }}>
                                    <div style={{
                                        color: BRAND_PRIMARY,
                                        backgroundColor: BRAND_SECONDARY,
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        fontSize: '12px'
                                    }}>{center.roleName}</div>
                                    <div style={{
                                        color: center.isActive ? '#10B981' : '#94A3B8',
                                        backgroundColor: center.isActive ? '#ECFDF5' : '#F1F5F9',
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <div style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            backgroundColor: center.isActive ? '#10B981' : '#94A3B8'
                                        }} />
                                        {center.isActive ? '앱 노출 중' : '심사 대기'}
                                    </div>
                                </Flex>
                            </div>
                        </Fragment>
                    );
                })
            )}

            <div style={{ marginTop: 24 }}>
                <RegisterCenter onSuccess={() => requestCenterListByAdminUser()} />
            </div>
        </>
    );
};

export default CenterSelectWidget;
