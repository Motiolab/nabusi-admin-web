import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IGetTeacherListByCenterIdAdminResponseV1 {
    id: number;
    name: string;
    nickName: string;
    mobile: string;
    lectureCnt: number;
    createdDate: string;
    isDelete: boolean;
}

export interface IGetTeacherDetailById {
    id: number;
    name: string;
    nickName: string;
    mobile: string;
    email: string;
    introduce: string;
    career: string;
    createdDate: string;
    useNickName: boolean;
    imageUrl: string;
    isDelete: boolean;
}

export interface IGetTeacherNameListAdminResponseV1 {
    id: number;
    name: string;
}

export interface IUpdateTeacherIntroduceAndNickNameByIdAdminRequestV1 {
    id: number;
    useNickName: boolean;
    nickName: string;
    introduce: string;
    centerId: number;
}

export interface IUpdateTeacherCareerByIdAdminRequestV1 {
    id: number;
    career: string;
    centerId: number;
}

export interface IUpdateTeacherImageUrlByIdAdminRequestV1 {
    id: number;
    imageUrl: string;
    centerId: number;
}

export const getTeacherListByCenterId = (centerId: number): Promise<AxiosResponse<IGetTeacherListByCenterIdAdminResponseV1[]>> => {
    return api.get(`/v1/admin/teacher/list/${centerId}`);
};

export const getTeacherDetailById = (centerId: number, id: number): Promise<AxiosResponse<IGetTeacherDetailById>> => {
    return api.get(`/v1/admin/teacher/detail/${centerId}?id=${id}`);
};

export const addTeacherByCenterId = (centerId: number, memberId: number): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/teacher/add/${centerId}?memberId=${memberId}`);
};

export const deleteTeacherById = (centerId: number, id: number): Promise<AxiosResponse<boolean>> => {
    return api.delete(`/v1/admin/teacher/delete/${centerId}?id=${id}`);
};

export const restoreTeacherById = (centerId: number, id: number): Promise<AxiosResponse<boolean>> => {
    return api.patch(`/v1/admin/teacher/restore/${centerId}?id=${id}`);
};

export const updateTeacherIntroduceAndNickNameById = (request: IUpdateTeacherIntroduceAndNickNameByIdAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.patch(`/v1/admin/teacher/update/introduce/${request.centerId}`, request);
};

export const updateTeacherCareerById = (request: IUpdateTeacherCareerByIdAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.patch(`/v1/admin/teacher/update/career/${request.centerId}`, request);
};

export const updateTeacherImageUrlById = (request: IUpdateTeacherImageUrlByIdAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.patch(`/v1/admin/teacher/update/image/${request.centerId}`, request);
};

export const getTeacherNameListByCenterId = (centerId: number): Promise<AxiosResponse<IGetTeacherNameListAdminResponseV1[]>> => {
    return api.get(`/v1/admin/teacher/name/list/${centerId}`);
};
