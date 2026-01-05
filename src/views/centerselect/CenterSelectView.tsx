import CopyIconToClipboard from '@/shared/ui/CopyIconToClipboard';
import CenterSelectWidget from '@/widgets/centerselectwidget';
import { Flex } from 'antd';
import { removeLocalAccessToken } from '@/shared/lib/token';
import { useNavigate } from 'react-router-dom';


const BRAND_PRIMARY = '#879B7E';

const CenterSelectView = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeLocalAccessToken();
        // Redirect to login
        navigate('/login');
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '344px',
            margin: '0 auto',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '20px',
        }}>
            <div style={{
                fontSize: '24px',
                color: '#1A1C1E',
                textAlign: 'center',
                fontWeight: '700',
                marginBottom: '40px'
            }}>
                센터 선택
            </div>

            <div style={{ marginBottom: '40px' }}>
                <CenterSelectWidget />
            </div>

            <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#64707D', fontWeight: '600', fontSize: '14px' }}>
                    등록한 센터가 보이지 않는다면?
                </div>
                <div style={{ marginTop: 16 }}>
                    <div style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '1.6' }}>
                        아래 이메일로 아이디, 휴대폰번호와 함께<br />
                        문의 내용을 보내주시면 도와드리겠습니다.
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <Flex justify='center' align='center'>
                            <div style={{ color: BRAND_PRIMARY, fontWeight: '700', fontSize: '15px' }}>
                                cs@nabusi.com
                            </div>
                            <CopyIconToClipboard text={'cs@nabusi.com'} />
                        </Flex>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 60, textAlign: 'center' }}>
                <span
                    style={{
                        color: '#94A3B8',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '14px'
                    }}
                    onClick={handleLogout}
                >
                    로그아웃
                </span>
            </div>
        </div>
    );
};

export default CenterSelectView;
