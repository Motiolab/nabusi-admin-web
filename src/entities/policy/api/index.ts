import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IClassPolicy {
    id: number;
    centerId: number;
    reservationStart: number;
    reservationEnd: number;
    reservationCancelLimit: number;
    autoReserveBeforeClassTime: number;
    autoAbsentLimit: number;
    isActiveAutoReservation: boolean;
}

export interface INotificationPolicy {
    id?: number;
    centerId: number;
    autoReservationText: string;
    isActiveAutoReservation: boolean;
    startClassBeforeText: string;
    isStartClassBefore: boolean;
    classAutoCancelText: string;
    isClassAutoCancel: boolean;
    ticketExpireText: string;
    isTicketExpire: boolean;
    ticketRemainingText: string;
    isTicketRemaining: boolean;
    ticketStopExpireText: string;
    isTicketStopExpire: boolean;
    happyBirthdayText: string;
    isHappyBirthday: boolean;
}

export const getPolicyClassByCenterId = (centerId: number): Promise<AxiosResponse<IClassPolicy>> => {
    return api.get(`/v1/admin/policy/class/${centerId}`);
};

export const updatePolicyClassByCenterId = (centerId: number, value: IClassPolicy): Promise<AxiosResponse<IClassPolicy>> => {
    return api.put(`/v1/admin/policy/class/${centerId}`, value);
};

export const getNotificationPolicyByCenterId = (centerId: number): Promise<AxiosResponse<INotificationPolicy>> => {
    return api.get(`/nabusi-server/company-management-service/v1/admin/policy/notification-policy/center/${centerId}`);
};

export const patchOrCreateNotificationPolicy = (centerId: number, value: INotificationPolicy): Promise<AxiosResponse<boolean>> => {
    return api.patch(`/nabusi-server/company-management-service/v1/admin/policy/notification-policy/or/create/${centerId}`, value);
};
