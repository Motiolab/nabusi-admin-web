import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface ICenterRoom {
    id: number;
    name: string;
    capacity: number | null;
}

export interface IOpenInfo {
    id?: number;
    closeTime: string;
    day: number;
    isDayOff: boolean;
    openTime: string;
}

export interface IContactNumber {
    id?: number;
    contactType: 'LANDLINE' | 'MOBILE';
    number: string;
}

export interface ICenterInfoJoinAll {
    id: number;
    address: string;
    code: string;
    detailAddress: string;
    roadName: string;
    name: string;
    openInfoList: IOpenInfo[];
    roomList: ICenterRoom[];
    contactNumberList: IContactNumber[];
    imageUrlList: string[];
    description: string;
}

export const getRoomListByCenterId = (centerId: number): Promise<AxiosResponse<Array<ICenterRoom>>> => {
    return api.get(`/v1/admin/center/room/list/${centerId}`);
};

export const createCenterRoomByCenterId = (centerId: number, centerRoomName: string): Promise<AxiosResponse<boolean>> => {
    return api.post(`/v1/admin/center/room/${centerId}`, {
        centerRoomName: centerRoomName,
    });
};

export const getCenterInfo = (centerId: number): Promise<AxiosResponse<ICenterInfoJoinAll>> => {
    return api.get(`/v1/admin/center/info/${centerId}`);
};

export const updateCenterInfo = (centerId: number, request: ICenterInfoJoinAll): Promise<AxiosResponse<boolean>> => {
    return api.put(`/v1/admin/center/info/${centerId}`, request);
};
