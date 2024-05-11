import $api from '../http';
import { AxiosResponse } from 'axios';
import { IUser } from '../types/IUser';

export default class UserService {
    static activateRates(userId: string, date: number): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>('/activateRates', { userId, date });
    }
}
