import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginSuccess } from "@/entities/account/api";
import { getRedirectUrlAfterLogin, setRedirectUrlAfterLogin } from "@/shared/lib/redirect";

const LoginSuccessView = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLoginSuccess = async () => {
            try {
                await adminLoginSuccess();
                const redirectUrlAfterLogin = getRedirectUrlAfterLogin();

                if (redirectUrlAfterLogin) {
                    setRedirectUrlAfterLogin('undefined');
                    navigate(redirectUrlAfterLogin);
                    return;
                }

                navigate('/centerselect');
            } catch (error) {
                console.error("Login success handling failed:", error);
                navigate('/login');
            }
        };

        handleLoginSuccess();
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '18px',
            color: '#879B7E',
            fontWeight: '600'
        }}>
            로그인 성공했습니다. 잠시만 기다려주세요...
        </div>
    );
};

export default LoginSuccessView;
