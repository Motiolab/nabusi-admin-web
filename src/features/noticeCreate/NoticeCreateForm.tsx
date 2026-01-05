import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Radio, Button, Flex, Typography, message, Divider, Card } from 'antd';
import { X } from 'lucide-react';
import type { RootState } from '@/app/store';
import { useNavigate } from 'react-router-dom';
import { createCenterNoticeByCenterId } from '@/entities/notice/api';
import type { ICreateCenterNoticeByCenterIdAdminRequestV1 } from '@/entities/notice/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const NoticeCreateForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(false);

    // Watch values for real-time preview
    const title = Form.useWatch('title', form);
    const content = Form.useWatch('content', form);

    const onFinish = async (values: any) => {
        if (!selectedCenterId) return;

        setLoading(true);
        try {
            const request: ICreateCenterNoticeByCenterIdAdminRequestV1 = {
                centerId: selectedCenterId,
                title: values.title.trim(),
                content: values.content.trim(),
                isPopup: values.isPopup,
                isDelete: values.isDelete,
            };

            await createCenterNoticeByCenterId(request);
            message.success('공지사항이 성공적으로 등록되었습니다.');
            navigate('/notice');
        } catch (error) {
            console.error('Failed to create notice:', error);
            message.error('공지사항 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex gap={48} align="start" wrap="wrap">
            {/* Form Section */}
            <Card style={{ flex: '1 1 500px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        isPopup: false,
                        isDelete: false
                    }}
                >
                    <section>
                        <Title level={4} style={{ marginBottom: '24px' }}>공지 정보</Title>
                        <Form.Item
                            label="제목"
                            name="title"
                            rules={[{ required: true, message: '제목을 입력해주세요' }]}
                        >
                            <Input placeholder="공지 제목을 입력해주세요" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="내용"
                            name="content"
                            rules={[{ required: true, message: '공지 내용을 입력해주세요' }]}
                        >
                            <TextArea
                                placeholder="회원들에게 알릴 내용을 입력해주세요."
                                size="large"
                                rows={12}
                                style={{ resize: 'none' }}
                            />
                        </Form.Item>

                        <Flex gap={24}>
                            <Form.Item label="팝업 여부" name="isPopup" rules={[{ required: true }]}>
                                <Radio.Group optionType="button" buttonStyle="solid">
                                    <Radio.Button value={true}>팝업 노출</Radio.Button>
                                    <Radio.Button value={false}>일반 공지</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item label="게시 여부" name="isDelete" rules={[{ required: true }]}>
                                <Radio.Group optionType="button" buttonStyle="solid">
                                    <Radio.Button value={false}>즉시 게시</Radio.Button>
                                    <Radio.Button value={true}>비공개</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Flex>
                    </section>

                    <Divider style={{ margin: '24px 0' }} />

                    <Flex justify="flex-end" gap={12}>
                        <Button size="large" onClick={() => navigate(-1)} style={{ width: '120px', borderRadius: '8px' }}>
                            취소
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            htmlType="submit"
                            style={{ backgroundColor: '#1E293B', borderColor: '#1E293B', width: '120px', borderRadius: '8px' }}
                        >
                            등록하기
                        </Button>
                    </Flex>
                </Form>
            </Card>

            {/* Preview Section */}
            <Flex vertical gap={16} align="center" style={{ flex: '0 0 320px' }}>
                <Text type="secondary" style={{ fontWeight: 600 }}>모바일 팝업 미리보기</Text>

                {/* Mobile Frame Mockup */}
                <div style={{
                    width: '320px',
                    height: '560px',
                    backgroundColor: '#1E293B',
                    borderRadius: '40px',
                    padding: '12px',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '8px solid #334155'
                }}>
                    {/* Screen Content */}
                    <Flex
                        justify="center"
                        align="center"
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            borderRadius: '28px',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Popup Modal Mockup */}
                        <div style={{
                            width: '85%',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }}>
                            <Flex justify="space-between" align="center" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                                <Text style={{ fontSize: '16px', fontWeight: 800 }}>공지사항</Text>
                                <X size={20} color="#94A3B8" />
                            </Flex>

                            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                <Text style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#1E293B' }}>
                                    {title || '제목을 입력해주세요'}
                                </Text>
                                <Text style={{ display: 'block', fontSize: '13px', lineHeight: 1.6, color: '#475569', whiteSpace: 'pre-wrap' }}>
                                    {content || '내용을 입력해주세요. 실제 모바일 앱에서 회원들에게 보여질 미리보이입니다.'}
                                </Text>
                            </div>

                            <Flex vertical gap={8} style={{ marginTop: '8px' }}>
                                <div style={{
                                    padding: '12px',
                                    border: '1px solid #1E293B',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#1E293B'
                                }}>
                                    오늘 그만보기
                                </div>
                                <Text style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8' }}>
                                    7일간 보지않기
                                </Text>
                            </Flex>
                        </div>
                    </Flex>

                    {/* Home Button Indicator */}
                    <div style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100px',
                        height: '4px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '2px',
                        opacity: 0.3
                    }} />
                </div>
            </Flex>
        </Flex>
    );
};
