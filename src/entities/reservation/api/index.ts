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
