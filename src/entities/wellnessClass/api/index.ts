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

export interface IGetWellnessClassAllAdminResponseV1 {
    id: number;
    name: string;
    description: string;
    teacherName: string;
    room: string;
    type: string;
    ticketList: ITicket[];
}

export interface ITicket {
    name: string;
    type: string;
    backgroundColor: string;
    textColor: string;
}

export const getWellnessClassNameListByCenterId = (centerId: number): Promise<AxiosResponse<Array<IGetWellnessClassNameByCenterIdAdminResponseV1>>> => {
    return api.get(`/v1/admin/wellness-class/name/${centerId}`);
};

export const getWellnessClassDetailByCenterId = (centerId: number, id: number): Promise<AxiosResponse<IGetWellnessClassDetailAdminResponseV1>> => {
    return api.get(`/v1/admin/wellness-class/detail/${centerId}?id=${id}`);
};

export interface IGetWellnessClassDetailWithLectureAdminResponseV2 {
    id: number;
    wellnessClassName: string;
    wellnessClassDescription: string;
    teacherName: string;
    teacherImageUrl: string;
    room: string;
    lectureType: string;
    pastClassesCount: number;
    upcomingClassesCount: number;
    ticketList: ITicket[];
    wellnessClassImageUrlList: string[];
    lectureList: IWellnessLectureInClass[];
}

export interface IWellnessLectureInClass {
    id: number;
    name: string;
    startDateTime: string;
    endDateTime: string;
    maxReservationCnt: number;
    currentReservationCnt: number;
    isDelete: boolean;
    isPast: boolean;
}

export const getWellnessClassDetailWithLectureById = (centerId: number, id: number): Promise<AxiosResponse<IGetWellnessClassDetailWithLectureAdminResponseV2>> => {
    return api.get(`/v1/admin/wellness-class/detail/with-lecture/${centerId}?id=${id}`);
};

export const getWellnessClassAllByCenterId = (centerId: number): Promise<AxiosResponse<Array<IGetWellnessClassAllAdminResponseV1>>> => {
    return api.get(`/v1/admin/wellness-class/all/${centerId}`);
};

export const createWellnessClassByCenterId = (centerId: number, newClassName: string): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/wellness-class/${centerId}`, {
        wellnessClassName: newClassName,
    });
};

export const deleteWellnessClass = (centerId: number, id: number): Promise<AxiosResponse<boolean>> => {
    return api.delete(`/v1/admin/wellness-class/${centerId}?id=${id}`);
};
