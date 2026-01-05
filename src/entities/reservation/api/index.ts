import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IGetReservationListByWellnessLectureIdAdminResponseV1 {
    reservationId: number;
    memberId: number;
    memberName: string;
    memberMobile: string;
    memberMemo: string;
    wellnessTicketIssuanceName: string;
    wellnessTicketIssuanceBackgroundColor: string;
    wellnessTicketIssuanceType: string;
    wellnessTicketIssuanceTextColor: string;
    reservationStatus: string;
    reservationCreatedDate: string;
}

export const getReservationListByWellnessLectureId = (centerId: number, wellnessLectureId: number): Promise<AxiosResponse<Array<IGetReservationListByWellnessLectureIdAdminResponseV1>>> => {
    return api.get(`/v1/admin/reservation/list/${centerId}?wellnessLectureId=${wellnessLectureId}`);
};

export interface ICreateReservationAdminRequestV1 {
    centerId: number;
    memberId: number;
    wellnessLectureId: number;
    wellnessTicketIssuanceId: number | undefined;
}

export const createReservation = (request: ICreateReservationAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/reservation/create/${request.centerId}`, request);
};

export const cancelReservation = (centerId: number, reservationId: number): Promise<AxiosResponse<boolean>> => {
    return api.put(`/v1/admin/reservation/cancel/${centerId}?reservationId=${reservationId}`);
};

