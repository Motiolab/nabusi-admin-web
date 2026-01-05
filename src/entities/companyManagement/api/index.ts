import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface ICreateCenterRequest {
    name: string;
    address: string;
    detailAddress: string;
    roadName: string;
}

export const createCenter = (params: ICreateCenterRequest): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/center/my-center`, params);
};
