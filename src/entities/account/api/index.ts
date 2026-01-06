import api from '@/shared/api';

export const adminLoginSuccess = () => {
    return api.get(`/v1/admin/login/success`);
};

export const signupAdmin = (data: any) => {
    return api.post(`/v1/mobile/admin-user/signup`, data);
};

export const loginAdmin = (data: any) => {
    return api.post(`/v1/mobile/admin-user/login`, data);
};
