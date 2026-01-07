import axios from "axios";
import { getLocalAccessToken, setLocalAccessToken, getLocalRefreshToken, setLocalRefreshToken } from "@/shared/lib/token";

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_DOMAIN_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

api.interceptors.request.use(
    config => {
        const token = getLocalAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const refreshToken = getLocalRefreshToken();
        if (refreshToken) {
            config.headers['Refresh-Token'] = refreshToken;
        }

        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    (res) => {
        const authHeader = res.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^Bearer\s+/i, '');
            setLocalAccessToken(token);
        }

        const refreshHeader = res.headers['refresh-token'];
        if (refreshHeader) {
            setLocalRefreshToken(refreshHeader);
        }

        return res;
    },
    (err) => {
        if (!err.response) {
            console.error("Response not found. Error: ", err);
            return Promise.reject(err);
        }

        if (err.response?.status === 403 || err.response?.status === 200) {
            const authHeader = err.response.headers.authorization;
            if (authHeader) {
                const token = authHeader.replace(/^Bearer\s+/i, '');
                setLocalAccessToken(token);
            }

            const refreshHeader = err.response.headers['refresh-token'];
            if (refreshHeader) {
                setLocalRefreshToken(refreshHeader);
            }
        } else if (err.response?.status === 401) {
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(err);
    }
);

export default api;
