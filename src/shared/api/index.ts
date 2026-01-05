import axios from "axios";
import { getLocalAccessToken, setLocalAccessToken } from "@/shared/lib/token";

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
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    (res) => {
        const accessToken = res.headers.authorization;
        if (accessToken) {
            setLocalAccessToken(accessToken);
        }
        return res;
    },
    (err) => {
        if (!err.response) {
            console.error("Response not found. Error: ", err);
            return Promise.reject(err);
        }

        if (err.response?.status === 403) {
            const accessToken = err.response.headers.authorization;
            if (accessToken) {
                setLocalAccessToken(accessToken);
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
