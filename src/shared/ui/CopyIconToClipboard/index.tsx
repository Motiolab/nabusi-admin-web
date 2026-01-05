import CopyIcon from '@/assets/icon/Copy.svg?react';
import SuccessIcon from '@/assets/icon/CheckCircleSuccessCopy.svg?react';
import copyTextToClipboard from '@/shared/lib/copyTextToClipboard';
import { notification } from 'antd';


interface IProps {
    text: string | null;
}

const CopyIconToClipboard = ({ text }: IProps) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api.info({
            message: <div style={{ color: '#879B7E' }}>복사되었어요</div>,
            icon: <SuccessIcon style={{ width: 20, height: 20 }} />,
            closeIcon: false,
            placement: 'bottom',
        });
    };

    const clickCopyIcon = () => {
        if (text) {
            const res = copyTextToClipboard(text);
            if (res) {
                openNotification();
            }
        }
    };

    return (
        <>
            {contextHolder}
            <CopyIcon
                style={{
                    cursor: 'pointer',
                    width: 20,
                    height: 20,
                    color: '#8E949E',
                    marginLeft: 8,
                    display: 'inline-block',
                    verticalAlign: 'middle'
                }}
                onClick={clickCopyIcon}
            />
        </>
    );
};

export default CopyIconToClipboard;
