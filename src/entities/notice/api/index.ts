import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IGetCenterNoticeListByCenterIdAdminResponseV1 {
    id: number;
    title: string;
    content: string;
    isPopup: boolean;
    createdDate: string;
    registerId: number;
    registerName: string;
    isDelete: boolean;
}

export const getCenterNoticeListByCenterId = (centerId: number): Promise<AxiosResponse<Array<IGetCenterNoticeListByCenterIdAdminResponseV1>>> => {
    return api.get(`/v1/admin/center/notice/list/${centerId}`);
};

export interface ICreateCenterNoticeByCenterIdAdminRequestV1 {
    centerId: number;
    title: string;
    content: string;
    isPopup: boolean;
    isDelete: boolean;
}

export const createCenterNoticeByCenterId = (request: ICreateCenterNoticeByCenterIdAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/center/notice/${request.centerId}`, request);
};

export interface IGetCenterNoticeDetailByIdAdminResponseV1 {
    id: number;
    title: string;
    content: string;
    isPopup: boolean;
    createdDate: string;
    isDelete: boolean;
}

export const getCenterNoticeDetailById = (centerId: number, id: number): Promise<AxiosResponse<IGetCenterNoticeDetailByIdAdminResponseV1>> => {
    return api.get(`/v1/admin/center/notice/detail/${centerId}?id=${id}`);
};

export interface IUpdateCenterNoticeByIdAdminRequestV1 {
    id: number;
    centerId: number;
    title: string;
    content: string;
    isPopup: boolean;
    isDelete: boolean;
}

export const updateCenterNoticeById = (request: IUpdateCenterNoticeByIdAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.put(`/v1/admin/center/notice/update/${request.centerId}`, request);
};
