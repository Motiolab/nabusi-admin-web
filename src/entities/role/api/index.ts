import api from '@/shared/api';
import type { AxiosResponse } from 'axios';

export interface IUrlPattern {
    id: number;
    actionName: string;
    url: string;
    method: string;
    description: string;
}

export interface IRoleAndUrlPattern {
    id: number;
    centerId: number;
    description: string;
    name: string;
    isActive: boolean;
    urlPatternList: IUrlPattern[];
}

export interface IRoleInfo {
    id: number;
    name: string;
}

export interface IUpdateUrlPatternAction {
    roleName: string;
    actionName: string;
}

export const getRoleAndUrlPatternByCenterId = (centerId: number): Promise<AxiosResponse<IRoleAndUrlPattern[]>> => {
    return api.get(`/v1/admin/role/url-pattern/${centerId}`);
};

export const updateRoleUrlPatternActionByCenterId = (centerId: number, params: IUpdateUrlPatternAction): Promise<AxiosResponse<IRoleAndUrlPattern[]>> => {
    return api.patch(`/v1/admin/role/url-pattern/action/${centerId}`, params);
};

export const updateInitRoleUrlPatternActionByCenterId = (centerId: number): Promise<AxiosResponse<IRoleAndUrlPattern[]>> => {
    return api.patch(`/v1/admin/role/url-pattern/init-action/${centerId}`);
};

export const createRoleUrlPatternByCenterId = (centerId: number, newRoleName: string): Promise<AxiosResponse<IRoleAndUrlPattern[]>> => {
    return api.post(`/v1/admin/role/url-pattern/${centerId}`, { roleName: newRoleName });
};

export const deleteRoleUrlPatternByCenterIdAndRoleId = (centerId: number, roleId: number): Promise<AxiosResponse<IRoleAndUrlPattern[]>> => {
    return api.delete(`/v1/admin/role/url-pattern/${centerId}/${roleId}`);
};

export const getRoleInfoListByCenterId = (centerId: number): Promise<AxiosResponse<IRoleInfo[]>> => {
    return api.get(`/v1/admin/role/info/${centerId}`);
};
