import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface ICreateWellnessTicketPaymentUnpaidAdminRequestV1 {
    centerId: number;
    totalPayValue: number;
    unpaidValue: number;
    cardInstallment: number;
    cardPayValue: number;
    cashPayValue: number;
    payerMemberId: number;
    note: string;
    wellnessTicketIssuanceId: number;
}

export const createWellnessTicketPaymentUnpaid = (request: ICreateWellnessTicketPaymentUnpaidAdminRequestV1): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/wellness-ticket-payment/unpaid/${request.centerId}`, request);
};
