import { Typography, Card, Breadcrumb } from 'antd';
import styled from 'styled-components';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const PageContainer = styled.div`
    max-width: 800px;
    margin: 40px auto;
    padding: 0 24px;
`;

const ContentCard = styled(Card)`
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;

    .ant-card-body {
        padding: 40px;
    }
`;

const SectionTitle = styled(Title)`
    margin-top: 32px !important;
    margin-bottom: 16px !important;
    color: #4A4F57 !important;
`;

const StyledParagraph = styled(Paragraph)`
    color: #5A606A;
    line-height: 1.8;
    margin-bottom: 16px;
    font-size: 15px;
`;

const PrivacyPolicyView = () => {
    return (
        <PageContainer>
            <Breadcrumb
                style={{ marginBottom: '24px' }}
                items={[
                    {
                        title: <Link to="/"><HomeOutlined /></Link>,
                    },
                    {
                        title: '개인정보 처리방침',
                    },
                ]}
            />

            <ContentCard>
                <Title level={2} style={{ color: '#1A1C1E', marginBottom: '8px' }}>개인정보 처리방침</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '32px' }}>시행일자: 2025년 12월 21일</Text>

                <StyledParagraph>
                    모티오랩(motiolab)(서비스명: 나부시, 이하 '회사'라 함)는 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
                </StyledParagraph>

                <SectionTitle level={4}>1. 개인정보의 처리 목적</SectionTitle>
                <StyledParagraph>
                    회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </StyledParagraph>
                <ul style={{ paddingLeft: '20px', color: '#5A606A', lineHeight: '1.8' }}>
                    <li><strong>회원 가입 및 관리:</strong> 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 목적으로 개인정보를 처리합니다.</li>
                    <li><strong>재화 또는 서비스 제공:</strong> 수업 예약, 수강권 관리, 출석 체크 및 정산 등 서비스 제공을 목적으로 개인정보를 처리합니다.</li>
                </ul>

                <SectionTitle level={4}>2. 처리하는 개인정보의 항목</SectionTitle>
                <StyledParagraph>
                    회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집하고 있습니다.
                </StyledParagraph>
                <ul style={{ paddingLeft: '20px', color: '#5A606A', lineHeight: '1.8' }}>
                    <li><strong>회원 가입 시 (소셜 로그인):</strong> [필수] 이름, 이메일, 출생년도, 생년월일, 핸드폰 번호, 성별, 닉네임 (카카오/네이버/애플 로그인 시 각 연동 플랫폼으로부터 제공받는 정보에 한함)</li>
                    <li><strong>서비스 이용 과정:</strong> [자동 수집] 접속 로그, 접속 IP 정보, 기기 정보, 쿠키, 서비스 이용 기록</li>
                </ul>

                <SectionTitle level={4}>3. 개인정보의 처리 및 보유 기간</SectionTitle>
                <StyledParagraph>
                    ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </StyledParagraph>
                <StyledParagraph>
                    ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
                </StyledParagraph>
                <ul style={{ paddingLeft: '20px', color: '#5A606A', lineHeight: '1.8' }}>
                    <li><strong>회원 가입 및 관리:</strong> 서비스 탈퇴 시까지. 다만, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
                </ul>

                <SectionTitle level={4}>4. 개인정보의 제3자 제공 및 처리 위탁</SectionTitle>
                <StyledParagraph>
                    회사는 이용자의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 이용자의 동의 없이 개인정보를 제3자에게 제공하거나 외부 업체에 처리를 위탁하지 않습니다.
                </StyledParagraph>

                <SectionTitle level={4}>5. 이용자의 권리·의무 및 그 행사방법</SectionTitle>
                <StyledParagraph>
                    이용자는 개인정보주체로서 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 제8조의 개인정보 보호책임자에게 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
                </StyledParagraph>

                <SectionTitle level={4}>6. 개인정보의 파기절차 및 파기방법</SectionTitle>
                <StyledParagraph>
                    회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 파기하며, 종이 문서에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
                </StyledParagraph>

                <SectionTitle level={4}>7. 개인정보의 안전성 확보 조치</SectionTitle>
                <StyledParagraph>
                    회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
                </StyledParagraph>
                <ul style={{ paddingLeft: '20px', color: '#5A606A', lineHeight: '1.8' }}>
                    <li><strong>관리적 조치:</strong> 내부관리계획 수립·시행, 개인정보 취급 직원의 최소화 및 정기적 교육</li>
                    <li><strong>기술적 조치:</strong> 개인정보처리시스템의 접근권한 관리, 고유식별정보의 암호화, 보안프로그램 설치 및 갱신</li>
                </ul>

                <SectionTitle level={4}>8. 개인정보 보호책임자</SectionTitle>
                <StyledParagraph>
                    회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </StyledParagraph>
                <Card style={{ backgroundColor: '#f9f9f9', border: 'none', borderRadius: '12px' }}>
                    <Paragraph style={{ marginBottom: '4px' }}><strong>성명:</strong> 권준학</Paragraph>
                    <Paragraph style={{ marginBottom: 0 }}><strong>연락처:</strong> <a href="mailto:junhak.kwon@motiolab.com">junhak.kwon@motiolab.com</a></Paragraph>
                </Card>

                <SectionTitle level={4}>9. 개인정보 처리방침 변경</SectionTitle>
                <StyledParagraph>
                    이 개인정보 처리방침은 2025년 12월 21일부터 적용됩니다.
                </StyledParagraph>
            </ContentCard>
        </PageContainer>
    );
};

export default PrivacyPolicyView;
