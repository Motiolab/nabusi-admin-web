import { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { getLocalAccessToken } from '@/shared/lib/token';

interface ImageUploaderProps {
    initImageUrl?: string;
    onUploadSuccess: (url: string) => void;
    size?: number;
}

export const ImageUploader = ({ initImageUrl, onUploadSuccess, size = 120 }: ImageUploaderProps) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(initImageUrl);

    useEffect(() => {
        if (initImageUrl) {
            setImageUrl(initImageUrl);
        }
    }, [initImageUrl]);

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            const uploadedUrl = info.file.response;
            setImageUrl(uploadedUrl);
            onUploadSuccess(uploadedUrl);
            message.success('이미지가 성공적으로 업로드되었습니다.');
        }
        if (info.file.status === 'error') {
            setLoading(false);
            message.error('이미지 업로드에 실패했습니다.');
        }
    };

    const uploadButton = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>업로드</div>
        </div>
    );

    return (
        <Upload
            name="multipartFile"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action={`${import.meta.env.VITE_APP_DOMAIN_URL}/s3/upload`}
            headers={{
                Authorization: `Bearer ${getLocalAccessToken()}`
            }}
            withCredentials={true}
            onChange={handleChange}
            style={{ width: size, height: size }}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    );
};
