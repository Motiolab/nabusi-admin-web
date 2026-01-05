import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IGetWellnessTicketManagementNameByCenterIdAdminResponseV1 {
    id: number;
    wellnessTicketIssuanceName: string;
    wellnessTicketId: number;
    wellnessTicketName: string;
}

export const getWellnessTicketManagementNameListByCenterId = (centerId: number): Promise<AxiosResponse<Array<IGetWellnessTicketManagementNameByCenterIdAdminResponseV1>>> => {
    return api.get(`/v1/admin/wellness-ticket-management/name/${centerId}`);
};
