import $api from '../http';
import { AxiosResponse } from 'axios';
import { IUser } from '../types/IUser';
import { IPay } from '../types/ISubscription';

export default class UserService {
    static createLinkPay(data: IPay): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>('/createLinkPay', { data });
    }
}
