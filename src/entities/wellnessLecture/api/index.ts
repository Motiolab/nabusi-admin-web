import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

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

export interface ICreateWellnessLectureListWithWellnessClassAdminRequestV1 {
    wellnessClassId: number;
    name: string;
    description: string;
    centerId: number;
    maxReservationCnt: number;
    room: string;
    classImageUrlList: string[];
    teacherId: number;
    wellnessLectureTypeId: number;
    startDateTime: string;
    endDateTime: string;
    timeRangeWithDays: any[];
    wellnessTicketManagementIdList: number[];
    price: number | undefined;
}

export const createWellnessLectureListWithWellnessClass = (request: ICreateWellnessLectureListWithWellnessClassAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/wellness-lecture/list/with-wellness-class`, request);
};
