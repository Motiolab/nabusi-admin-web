import { Button, Flex, Input, Modal } from "antd";
import { useState } from "react";
import DaumPostcode from 'react-daum-postcode';

export interface IAddressInfo {
    address: string;
    roadName: string;
}

interface IProps {
    addressInfo: IAddressInfo;
    setAddressInfo: (addressInfo: IAddressInfo) => void;
    title?: string;
    style?: React.CSSProperties;
}

export const SearchAddress = ({ addressInfo, setAddressInfo, title = "센터 위치", style }: IProps) => {
    const [isDaumPostcodeModal, setIsDaumPostcodeModal] = useState(false);

    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let roadName = data.roadname; // Using roadname from Daum data
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setAddressInfo({ address: fullAddress, roadName: roadName });
        setIsDaumPostcodeModal(false);
    };

    return (
        <>
            <div style={{ color: '#1A1C1E', fontSize: '14px', fontWeight: '600', ...style }}>{title}</div>
            <Flex justify="space-between" style={{ marginTop: 8 }} gap={10}>
                <div style={{ width: '100%' }}>
                    <Input
                        size="large"
                        placeholder="주소 검색을 이용해 주세요"
                        value={addressInfo.address}
                        readOnly
                        style={{ borderRadius: '8px' }}
                    />
                </div>
                <Button
                    size="large"
                    onClick={() => setIsDaumPostcodeModal(true)}
                    style={{ borderRadius: '8px' }}
                >
                    검색
                </Button>
            </Flex>

            <Modal
                title="우편번호 검색"
                open={isDaumPostcodeModal}
                onCancel={() => setIsDaumPostcodeModal(false)}
                footer={null}
                centered
                destroyOnClose
            >
                <div style={{ minHeight: '400px' }}>
                    <DaumPostcode onComplete={handleComplete} />
                </div>
            </Modal>
        </>
    );
};
