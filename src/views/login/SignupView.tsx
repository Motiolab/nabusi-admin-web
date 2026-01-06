import { useState } from 'react';
import { Form, Input, Button, Select, message, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signupAdmin } from '@/entities/account/api';
import logoLeaf from '@/assets/img/logo_leaf.png';

const { Title, Text } = Typography;
const { Option } = Select;

const SignupView = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await signupAdmin(values);
            message.success('회원가입이 완료되었습니다. 로그인해주세요.');
            navigate('/login');
        } catch (error: any) {
            console.error('Signup error:', error);
            message.error(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '440px',
            margin: '0 auto',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <img src={logoLeaf} alt="Nabusi Logo" style={{ width: '80px', marginBottom: '20px' }} />
                <Title level={3} style={{ margin: 0 }}>관리자 회원가입</Title>
                <Text type="secondary">나부시 관리자 계정을 생성합니다</Text>
            </div>

            <Card style={{ width: '100%', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <Form.Item
                        name="email"
                        label="이메일"
                        rules={[
                            { required: true, message: '이메일을 입력해주세요.' },
                            { type: 'email', message: '올바른 이메일 형식이 아닙니다.' }
                        ]}
                    >
                        <Input size="large" placeholder="example@email.com" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="비밀번호"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
                    >
                        <Input.Password size="large" placeholder="비밀번호를 입력하세요" />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="이름"
                        rules={[{ required: true, message: '이름을 입력해주세요.' }]}
                    >
                        <Input size="large" placeholder="실명을 입력하세요" />
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name="birthYear"
                            label="출생 연도"
                            rules={[{ required: true, message: '연도를 선택해주세요.' }]}
                        >
                            <Select size="large" placeholder="연도">
                                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <Option key={year} value={year.toString()}>{year}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="birthDay"
                            label="생일 (MMDD)"
                            rules={[
                                { required: true, message: '생일을 입력해주세요.' },
                                { pattern: /^\d{4}$/, message: 'MMDD 형식으로 4자리를 입력하세요.' }
                            ]}
                        >
                            <Input size="large" placeholder="예: 0101" maxLength={4} />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="gender"
                        label="성별"
                        rules={[{ required: true, message: '성별을 선택해주세요.' }]}
                    >
                        <Select size="large" placeholder="성별 선택">
                            <Option value="MALE">남성</Option>
                            <Option value="FEMALE">여성</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label="전화번호"
                        rules={[
                            { required: true, message: '전화번호를 입력해주세요.' },
                            { pattern: /^010\d{8}$/, message: '- 없이 11자리 숫자로 입력하세요.' }
                        ]}
                    >
                        <Input size="large" placeholder="01012345678" maxLength={11} />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
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
                            가입하기
                        </Button>
                        <Button
                            type="link"
                            block
                            onClick={() => navigate('/login')}
                            style={{ marginTop: '8px', color: '#8E949E' }}
                        >
                            이미 계정이 있으신가요? 로그인
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SignupView;
