import { Input } from "antd";
import { useEffect, useState } from "react";

interface IProps {
    centerName: string;
    setCenterName: (name: string) => void;
}

export const CenterNameInput = ({ centerName, setCenterName }: IProps) => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [debouncedText, setDebouncedText] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedText(centerName);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [centerName]);

    useEffect(() => {
        if (debouncedText) {
            validateInput(debouncedText);
        } else {
            setErrorMessage('');
        }
    }, [debouncedText]);

    const validateInput = (text: string) => {
        const consonantsAndVowelsRegex = /[ㄱ-ㅎㅏ-ㅣ]/;
        const numbersRegex = /[0-9]/;

        if (consonantsAndVowelsRegex.test(text)) {
            setErrorMessage('정확한 센터명을 입력해 주세요 (자음/모음만 입력 불가)');
        } else if (numbersRegex.test(text)) {
            setErrorMessage('정확한 센터명을 입력해 주세요 (숫자 입력 불가)');
        } else {
            setErrorMessage('');
        }
    };

    return (
        <div>
            <div style={{ color: '#1A1C1E', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>센터명</div>
            <Input
                size="large"
                placeholder="센터명을 입력해 주세요"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                status={errorMessage === '' ? undefined : 'error'}
                style={{ borderRadius: '8px' }}
            />
            {errorMessage && (
                <div style={{ marginTop: 8, color: '#FF4D4F', fontSize: 13 }}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};
