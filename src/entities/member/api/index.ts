import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IGetMyCenterListByMemberIdResponseV1 {
    id: number;
    name: string;
    address: string;
    detailAddress: string;
    isActive: boolean;
    roleName: string;
}

export interface IWellnessTicketIssuance {
    id: number;
    name: string;
    type: string;
    backgroundColor: string;
    textColor: string;
    limitType: string;
    limitCnt: number;
    isDelete: boolean;
    remainingCnt: number;
    remainingDate: number;
    totalUsableCnt: number;
    startDate: string;
    expireDate: string;
    unpaidValue: number;
}

export interface IMemberMemo {
    id: number;
    content: string;
    registerName: string;
    createdDate: string;
}

export interface IGetAllMemberListByCenterIdAdminResponseV1 {
    id: number;
    name: string;
    mobile: string;
    roleName: string;
    wellnessTicketIssuanceList: IWellnessTicketIssuance[];
    memberMemoList: IMemberMemo[];
    createdDate: string;
    socialName: string;
}

export interface IGetMemberDetailByIdAdminResponseV1 {
    id: number;
    name: string;
    mobile: string;
    birthDay: string;
    age: string;
    gender: string;
    email: string;
    roleName: string;
    wellnessTicketIssuanceList: IWellnessTicketIssuance[];
    memberMemoList: IMemberMemo[];
    createdDate: string;
}

export const getCenterListByAdminUser = (): Promise<AxiosResponse<Array<IGetMyCenterListByMemberIdResponseV1>>> => {
    return api.get('/v1/admin/center/my-center');
};

export const getAllMemberListByCenterId = (centerId: number): Promise<AxiosResponse<Array<IGetAllMemberListByCenterIdAdminResponseV1>>> => {
    return api.get(`/v1/admin/member/all/${centerId}`);
};

export const getMemberDetailById = (centerId: number, memberId: number): Promise<AxiosResponse<IGetMemberDetailByIdAdminResponseV1>> => {
    return api.get(`/v1/admin/member/detail/${centerId}?id=${memberId}`);
};

export const getAdminMemberListByCenterId = (centerId: number): Promise<AxiosResponse<IAdminMemberByCenter[]>> => {
    return api.get(`/v1/admin/member/admin/${centerId}`);
};

export const deleteAdminRoleByMemberIdList = (centerId: number, memberIdList: number[]): Promise<AxiosResponse<boolean>> => {
    return api.delete(`/v1/admin/member/admin/role/${centerId}`, { data: memberIdList });
};

export const passOwnerRole = (centerId: number, memberId: number): Promise<AxiosResponse<boolean>> => {
    return api.patch(`/v1/admin/member/admin/owner/${centerId}?memberId=${memberId}`);
};

export const updateMemberRole = (centerId: number, roleId: number, memberId: number): Promise<AxiosResponse<boolean>> => {
    return api.patch(`/v1/admin/member/admin/role/${centerId}?roleId=${roleId}&memberId=${memberId}`);
};

export interface IMemberByCenterToAddTeacher {
    memberId: number;
    name: string;
    mobile: string;
    roleName: string;
}

export interface IAdminMemberByCenter {
    memberId: number;
    name: string;
    mobile: string;
    email: string;
    roleName: string;
    roleId: number;
}

export interface IInviteAdminMemberRequestV1 {
    mobile: string;
    roleId: number;
}

export const inviteAdminMemberByCenterId = (centerId: number, params: IInviteAdminMemberRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/invite/admin-member/${centerId}`, params);
};

export const getMemberListToAddTeacherByCenterId = (centerId: number): Promise<AxiosResponse<IMemberByCenterToAddTeacher[]>> => {
    return api.get(`/v1/admin/member/list/add/teacher/${centerId}`);
};

export const createMemberMemo = (centerId: number, memberId: number, content: string): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/member/memo/${centerId}`, { memberId, content });
};
