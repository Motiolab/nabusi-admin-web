import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface ICreateWellnessTicketIssuanceAdminRequestV1 {
    centerId: number;
    startDate: string;
    expireDate: string;
    limitType: string;
    limitCnt: number;
    totalUsableCnt: number;
    memberId: number;
    wellnessTicketId: number;
    paymentMethod: string;
    discountRate: number;
    totalPayValue: number;
    unpaidValue: number;
    cardInstallment: number;
    cardPayValue: number;
    cashPayValue: number;
    payerMemberId: number;
    note: string;
}

export const createWellnessTicketIssuance = (request: ICreateWellnessTicketIssuanceAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/wellness-ticket-issuance/${request.centerId}`, request);
};

export interface IGetWellnessTicketIssuanceListByWellnessTicketIdAdminResponseV1 {
    id: number;
    wellnessTicketIssuanceName: string;
    memberName: string;
    mobile: string;
    remainingCnt: number;
    remainingDate: number;
    totalUsableCnt: number;
    startDate: string;
    expireDate: string;
    isDelete: boolean;
    type: string;
    unpaidValue: number;
    limitType: string;
    limitCnt: number;
}

export const getWellnessTicketIssuanceListByWellnessTicketId = (centerId: number, wellnessTicketId: number): Promise<AxiosResponse<Array<IGetWellnessTicketIssuanceListByWellnessTicketIdAdminResponseV1>>> => {
    return api.get(`/v1/admin/wellness-ticket-issuance/list/wellness-ticket-id/${centerId}?wellnessTicketId=${wellnessTicketId}`);
};

export interface IGetWellnessTicketIssuanceDetailByIdAdminResponseV1 {
    id: number;
    memberId: number;
    memberName: string;
    mobile: string;
    ticketName: string;
    startDate: string;
    expireDate: string;
    type: string;
    backgroundColor: string;
    remainingCnt: number;
    totalUsableCnt: number;
    limitType: string;
    limitCnt: number;
    unpaidValue: number;
    isDelete: boolean;
    wellnessTicketId: number;
}

export const getWellnessTicketIssuanceUpdateDetailById = (centerId: number, id: number): Promise<AxiosResponse<IGetWellnessTicketIssuanceDetailByIdAdminResponseV1>> => {
    return api.get(`/v1/admin/wellness-ticket-issuance/update/detail/${centerId}?id=${id}`);
};

export interface IUpdateWellnessTicketIssuanceAdminRequestV1 {
    id: number;
    centerId: number;
    name: string;
    backgroundColor: string;
    textColor: string;
    type: string;
    startDate: string;
    expireDate: string;
    remainingCnt: number;
    limitType: string;
    limitCnt: number;
    isDelete: boolean;
}

export const updateWellnessTicketIssuance = (request: IUpdateWellnessTicketIssuanceAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.put(`/v1/admin/wellness-ticket-issuance/update/${request.centerId}`, request);
};
