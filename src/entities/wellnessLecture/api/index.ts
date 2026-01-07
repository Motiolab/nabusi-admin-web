import api from '@/shared/api';
import type { AxiosResponse } from 'axios';
import { Dayjs } from 'dayjs';

export interface IGetWellnessLectureAdminResponseV1 {
    id: number;
    name: string;
    maxReservationCnt: number;
    room: string;
    teacherId: number;
    teacherName: string;
    wellnessLectureTypeId: number;
    wellnessLectureTypeName: string;
    wellnessLectureTypeDescription: string;
    startDateTime: string;
    endDateTime: string;
    isDelete: boolean;
    lectureImageUrlList: string[];
}

export const getWellnessLectureListByStartDate = (centerId: number, startDate: string): Promise<AxiosResponse<Array<IGetWellnessLectureAdminResponseV1>>> => {
    return api.get(`/v1/admin/wellness-lecture/list/${centerId}?startDate=${encodeURIComponent(startDate)}`);
};

export interface IGetWellnessLectureDetailAdminResponseV1 {
    id: number;
    name: string;
    description: string;
    centerId: number;
    maxReservationCnt: number;
    room: string;
    lectureImageUrlList: string[];
    price: number;
    teacherId: number;
    teacherName: string;
    wellnessLectureTypeId: number;
    wellnessLectureTypeName: string;
    wellnessLectureTypeDescription: string;
    startDateTime: string;
    endDateTime: string;
    isDelete: boolean;
    wellnessTicketAvailableList: IWellnessTicketAvailable[];
}

export interface IWellnessTicketAvailable {
    wellnessTicketManagementId: number;
    wellnessTicketIssuanceName: string;
    wellnessTicketId: number;
    type: string;
    backgroundColor: string;
    textColor: string;
    isDelete: boolean;
}

export const getWellnessLectureDetailById = (centerId: number, id: number): Promise<AxiosResponse<IGetWellnessLectureDetailAdminResponseV1>> => {
    return api.get(`/v1/admin/wellness-lecture/detail/${centerId}?id=${id}`);
};

export interface ITimeRangeWithDays {
    startTime: string;
    endTime: string;
    dayOfWeek: string;
}

export interface ICreateWellnessLectureListWithWellnessClassAdminRequestV1 {
    wellnessClassId: number;
    name: string;
    description: string;
    centerId: number;
    maxReservationCnt: number;
    room: string;
    classImageUrlList: string[];
    price: number;
    teacherId: number;
    wellnessLectureTypeId: number;
    startDateTime: Dayjs;
    endDateTime: Dayjs;
    timeRangeWithDays: Array<ITimeRangeWithDays>;
    wellnessTicketManagementIdList: Array<number>;
}

export const createWellnessLectureListWithWellnessClass = (createWellnessLectureListWithWellnessClassAdminRequest: ICreateWellnessLectureListWithWellnessClassAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/wellness-lecture/list/${createWellnessLectureListWithWellnessClassAdminRequest.centerId}`, createWellnessLectureListWithWellnessClassAdminRequest);
};

export const deleteWellnessLecture = (centerId: number, id: number, isSendNoti: boolean): Promise<AxiosResponse<boolean>> => {
    return api.delete(`/v1/admin/wellness-lecture/${centerId}?id=${id}&isSendNoti=${isSendNoti}`);
};

export interface IUpdateWellnessLectureAdminRequestV1 {
    id: number;
    name: string;
    description: string;
    centerId: number;
    maxReservationCnt: number;
    room: string;
    lectureImageUrlList: string[];
    teacherId: number;
    wellnessLectureTypeId: number;
    startDateTime: string;
    endDateTime: string;
    wellnessTicketManagementIdList: number[];
    price: number | undefined;
}

export const updateWellnessLecture = (request: IUpdateWellnessLectureAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.put(`/v1/admin/wellness-lecture/${request.centerId}`, request);
};



export interface IUpdateWellnessLectureListAdminRequestV1 {
    idList: number[];
    name: string;
    description: string;
    centerId: number;
    maxReservationCnt: number;
    room: string;
    lectureImageUrlList: string[];
    teacherId: number;
    wellnessLectureTypeId: number;
    wellnessTicketManagementIdList: number[];
    price: number | undefined;
}

export const updateWellnessLectureList = (request: IUpdateWellnessLectureListAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.put(`/v1/admin/wellness-lecture-list/${request.centerId}`, request);
};

export const deleteWellnessLectureList = (centerId: number, idList: number[]): Promise<AxiosResponse<boolean>> => {
    return api.delete(`/v1/admin/wellness-lecture-list/${centerId}`, { data: idList });
};