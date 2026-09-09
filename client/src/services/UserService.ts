import $api from '../http';
import { AxiosResponse } from 'axios';
import { IPay } from '../types/ISubscription';

export default class UserService {
    // Сервер возвращает ссылку на оплату в ЮKassa.
    static createLinkPay(data: IPay): Promise<AxiosResponse<string>> {
        return $api.post<string>('/createLinkPay', data);
    }
}
