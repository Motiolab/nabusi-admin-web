import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
    padding: 60px 0;
    background-color: #f9f9f9;
    border-top: 1px solid #eee;
    width: 100%;
`;

const FooterContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
`;

const FooterLogo = styled.div`
    font-weight: 700;
    font-size: 1.2rem;
    color: #999;
`;

const CompanyInfo = styled.div`
    text-align: center;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.6;

    p {
        margin: 4px 0;
    }

    span {
        margin: 0 8px;
        display: inline-block;
    }
`;

const FooterLinks = styled.ul`
    display: flex;
    gap: 20px;
    list-style: none;
    padding: 0;
    margin: 0;

    a {
        color: #666;
        font-size: 0.9rem;
        text-decoration: none;
        
        &:hover {
            text-decoration: underline;
        }
    }
`;

const Copyright = styled.p`
    color: #999;
    font-size: 0.85rem;
    margin-top: 10px;
`;

export const Footer = () => {
    return (
        <FooterContainer className="footer">
            <div className="container">
                <FooterContent className="footer-content">
                    <FooterLogo className="footer-logo">Nabusi</FooterLogo>
                    <CompanyInfo className="company-info">
                        <p>
                            <span>상호명 : 모티오랩(Motiolab)</span>
                            <span>대표자명 : 권준학</span>
                            <span>사업자등록번호 : 720-01-03597</span>
                        </p>
                        <p>
                            <span>통신판매업신고번호 : [신고 준비중]</span>
                            <span>주소 : 서울특별시 (상세주소 미공개)</span>
                        </p>
                        <p>
                            <span>개인정보관리책임자 : 권준학</span>
                            <span>고객센터 : junhak.kwon@motiolab.com</span>
                        </p>
                    </CompanyInfo>
                    <FooterLinks className="footer-links">
                        <li><a href="mailto:junhak.kwon@motiolab.com">고객센터 문의</a></li>
                        <li><Link to="/privacy-policy">개인정보처리방침</Link></li>
                    </FooterLinks>
                    <Copyright className="copyright">© 2025 Motiolab. All rights reserved.</Copyright>
                </FooterContent>
            </div>
        </FooterContainer>
    );
};
