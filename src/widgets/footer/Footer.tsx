import { Typography } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const FooterContainer = styled.footer`
    padding: 80px 24px 60px;
    background-color: #fcfcfc;
    border-top: 1px solid #f0f0f0;
    color: #8E949E;
    font-size: 13px;
    line-height: 1.8;
`;

const FooterContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
`;

const FooterTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 48px;
    flex-wrap: wrap;
    gap: 40px;
`;

const BrandSection = styled.div`
    flex: 1;
    min-width: 280px;
`;

const BrandTitle = styled.div`
    font-size: 18px;
    font-weight: 700;
    color: #4A4F57;
    margin-bottom: 12px;
    letter-spacing: -0.2px;
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px 24px;
    flex: 2;
`;

const InfoItem = styled.div`
    display: flex;
    gap: 8px;
    align-items: baseline;
`;

const InfoLabel = styled.span`
    color: #5A606A;
    font-weight: 600;
    white-space: nowrap;
    min-width: 100px;
`;

const InfoValue = styled(Text)`
    color: #8E949E !important;
`;

const FooterBottom = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 32px;
    border-top: 1px solid #f5f5f5;
    flex-wrap: wrap;
    gap: 20px;
`;

const FooterLinks = styled.div`
    display: flex;
    gap: 24px;
    font-weight: 600;
    
    a {
        color: #5A606A;
        text-decoration: none;
        transition: color 0.2s ease;
        &:hover {
            color: #879B7E;
        }
    }
`;

const Copyright = styled.div`
    color: #B0B5BD;
    font-size: 12px;
    font-weight: 400;
`;

export const Footer = () => {
    return (
        <FooterContainer>
            <FooterContent>
                <FooterTop>
                    <BrandSection>
                        <BrandTitle>Nabusi Admin</BrandTitle>
                        <Text type="secondary" style={{ display: 'block', maxWidth: '240px' }}>
                            고요히 나를 만나는 시간, <br />
                            나부시 관리자를 위한 파트너 포털입니다.
                        </Text>
                    </BrandSection>

                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>상호명</InfoLabel>
                            <InfoValue>모티오랩(Motiolab)</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>대표자명</InfoLabel>
                            <InfoValue>권준학</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>사업자번호</InfoLabel>
                            <InfoValue>720-01-03597</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>통신판매업</InfoLabel>
                            <InfoValue>[신고 준비중]</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>이메일</InfoLabel>
                            <InfoValue>junhak.kwon@motiolab.com</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>개인정보책임</InfoLabel>
                            <InfoValue>권준학</InfoValue>
                        </InfoItem>
                        <InfoItem style={{ gridColumn: '1 / -1' }}>
                            <InfoLabel>주소</InfoLabel>
                            <InfoValue>서울특별시 (상세주소 미공개)</InfoValue>
                        </InfoItem>
                    </InfoGrid>
                </FooterTop>

                <FooterBottom>
                    <FooterLinks>
                        <a href="mailto:junhak.kwon@motiolab.com">고객센터 문의</a>
                        <Link to="/privacy-policy">개인정보처리방침</Link>
                        <a href="#">이용약관</a>
                    </FooterLinks>

                    <Copyright>
                        © 2025 Motiolab. All rights reserved.
                    </Copyright>
                </FooterBottom>
            </FooterContent>
        </FooterContainer>
    );
};
