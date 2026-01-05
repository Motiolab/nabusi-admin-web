import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IGetWellnessClassNameByCenterIdAdminResponseV1 {
    id: number;
    name: string;
    teacherName: string;
}

export interface IGetWellnessClassDetailAdminResponseV1 {
    id: number;
    name: string;
    description: string;
    centerId: number;
    maxReservationCnt: number;
    registerId: number;
    room: string;
    classImageUrl: string;
    teacherId: number;
    wellnessClassProgramId: number;
    wellnessTicketManagementIdList: number[];
}

export const getWellnessClassNameListByCenterId = (centerId: number): Promise<AxiosResponse<Array<IGetWellnessClassNameByCenterIdAdminResponseV1>>> => {
    return api.get(`/v1/admin/wellness-class/name/${centerId}`);
};

export const getWellnessClassDetailByCenterId = (centerId: number, id: number): Promise<AxiosResponse<IGetWellnessClassDetailAdminResponseV1>> => {
    return api.get(`/v1/admin/wellness-class/detail/${centerId}?id=${id}`);
};

export const createWellnessClassByCenterId = (centerId: number, newClassName: string): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/wellness-class/${centerId}`, {
        wellnessClassName: newClassName,
    });
};
