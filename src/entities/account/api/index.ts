import api from '@/shared/api';

export const adminLoginSuccess = () => {
    return api.get(`/v1/admin/login/success`);
};
