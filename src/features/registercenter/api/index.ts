import api from '@/shared/api';

export const registerCenterByAdmin = (params: any) => {
    return api.post(`/v1/admin/center/register`, params);
};
