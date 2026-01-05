import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IGetWellnessLectureTypeNameListByCenterIdAdminResponseV1 {
    id: number;
    name: string;
}

export const getWellnessLectureTypeNameListByCenterId = (centerId: number): Promise<AxiosResponse<Array<IGetWellnessLectureTypeNameListByCenterIdAdminResponseV1>>> => {
    return api.get(`/v1/admin/wellness-lecture-type/name/${centerId}`);
};

export const createWellnessLectureTypeByCenterId = (centerId: number, name: string, description: string): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/wellness-lecture-type/${centerId}`, { name, description });
};
