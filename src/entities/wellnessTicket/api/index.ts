import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IGetWellnessTicketAdminResponseV1 {
    id: number;
    type: string;
    name: string;
    backgroundColor: string;
    textColor: string;
    limitType: string;
    limitCnt: number;
    totalUsableCnt: number;
    usableDate: number;
    salesPrice: number;
    price: number;
    isDelete: boolean;
    createdDate: string;
    discountValue: number;
}

export const getWellnessTicketList = (centerId: number): Promise<AxiosResponse<Array<IGetWellnessTicketAdminResponseV1>>> => {
    return api.get(`/v1/admin/wellness-ticket/${centerId}`);
};

export interface ICreateWellnessTicketAdminRequestV1 {
    centerId: number;
    type: string;
    name: string;
    backgroundColor: string;
    textColor: string;
    price: number;
    limitType: string;
    limitCnt: number;
    totalUsableCnt: number;
    usableDate: number;
    discountValue: number;
    salesPrice: number;
    wellnessClassIdList: number[];
}

export const createWellnessTicket = (request: ICreateWellnessTicketAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/wellness-ticket/${request.centerId}`, request);
};

export interface IGetWellnessClassIdAndName {
    id: number;
    name: string;
}

export interface IGetWellnessTicketDetailAdminResponseV1 {
    id: number;
    type: string;
    name: string;
    backgroundColor: string;
    textColor: string;
    price: number;
    discountValue: number;
    limitType: string;
    limitCnt: number;
    totalUsableCnt: number;
    usableDate: number;
    salesPrice: number;
    isDelete: boolean;
    createdDate: string;
    wellnessClassNameList: IGetWellnessClassIdAndName[];
}

export const getWellnessTicketDetailById = (centerId: number, id: number): Promise<AxiosResponse<IGetWellnessTicketDetailAdminResponseV1>> => {
    return api.get(`/v1/admin/wellness-ticket/detail/${centerId}?id=${id}`);
};

export const deleteWellnessTicketById = (centerId: number, id: number): Promise<AxiosResponse<boolean>> => {
    return api.delete(`/v1/admin/wellness-ticket/${centerId}?id=${id}`);
};

export const restoreWellnessTicketById = (centerId: number, id: number): Promise<AxiosResponse<boolean>> => {
    return api.patch(`/v1/admin/wellness-ticket/restore/${centerId}?id=${id}`);
};

export interface IUpdateWellnessTicketAdminRequestV1 {
    id: number;
    centerId: number;
    type: string;
    name: string;
    backgroundColor: string;
    textColor: string;
    price: number;
    limitType: string;
    limitCnt: number;
    totalUsableCnt: number;
    usableDate: number;
    discountValue: number;
    salesPrice: number;
    wellnessClassIdList: number[];
}

export const updateWellnessTicket = (request: IUpdateWellnessTicketAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.put(`/v1/admin/wellness-ticket/${request.centerId}`, request);
};
