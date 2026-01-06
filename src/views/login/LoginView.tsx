import logoLeaf from '@/assets/img/logo_leaf.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { loginAdmin } from '@/entities/account/api';

const LoginView = () => {
    const KAKAO_COLOR = '#FEE500';
    const NAVER_COLOR = '#03C75A';
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await loginAdmin(values);
            if (response.data.isSuccessLogin) {
                message.success('로그인에 성공했습니다.');
                // Note: Token handling is done by the API interceptor automatically via headers
                navigate('/centerselect');
            } else {
                message.error(response.data.message || '로그인에 실패했습니다.');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            message.error(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const SocialLoginButton = ({ href, social, color, textColor, icon }: { href: string, social: string, color: string, textColor: string, icon?: string }) => {
        return (
            <a href={href} style={{ textDecoration: 'none', display: 'block', width: '100%', marginBottom: '12px' }}>
                <button
                    style={{
                        width: '100%',
                        height: '56px',
                        backgroundColor: color,
                        color: textColor,
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: '0 20px',
                    }}
                >
                    {icon && <span style={{ marginRight: '10px', fontSize: '20px' }}>{icon}</span>}
                    {social} 로그인
                </button>
            </a>
        );
    }

    // Vite uses import.meta.env instead of process.env
    const domainUrl = import.meta.env.VITE_APP_DOMAIN_URL || 'http://localhost:8080';

    return (
        <div style={{
            width: '100%',
            maxWidth: '344px',
            margin: '0 auto',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            {/* Logo and Slogan */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <img src={logoLeaf} alt="Nabusi Logo" style={{ width: '100px', marginBottom: '20px' }} />
                <div style={{
                    fontSize: '18px',
                    color: '#8E949E', // Neutral gray color for slogan
                    fontWeight: '400',
                    letterSpacing: '-0.5px'
                }}>
                    고요히 나를 만나는 시간
                </div>
            </div>

            {/* Social Login Buttons */}
            <div style={{ width: '100%', marginBottom: '24px' }}>
                <SocialLoginButton
                    href={`${domainUrl}/oauth2/authorization/kakao`}
                    social='카카오로'
                    color={KAKAO_COLOR}
                    textColor='#191919'
                    icon='💬'
                />
                <SocialLoginButton
                    href={`${domainUrl}/oauth2/authorization/naver`}
                    social='네이버로'
                    color={NAVER_COLOR}
                    textColor='#FFFFFF'
                    icon='N'
                />
            </div>

            <Divider style={{ margin: '0 0 24px 0' }}>또는</Divider>

            {/* Email Login Form */}
            <div style={{ width: '100%', marginBottom: '24px' }}>
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: '이메일을 입력해주세요.' }]}
                    >
                        <Input size="large" placeholder="이메일" style={{ borderRadius: '12px', height: '50px' }} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
                    >
                        <Input.Password size="large" placeholder="비밀번호" style={{ borderRadius: '12px', height: '50px' }} />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: '56px',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: '600',
                                backgroundColor: '#879B7E',
                                border: 'none'
                            }}
                        >
                            로그인
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <span style={{ color: '#8E949E', marginRight: '8px' }}>아직 회원이 아니신가요?</span>
                <Link to="/signup" style={{
                    color: '#879B7E',
                    fontWeight: '600',
                    textDecoration: 'none'
                }}>
                    회원가입
                </Link>
            </div>
        </div>
    );
}

export default LoginView;
