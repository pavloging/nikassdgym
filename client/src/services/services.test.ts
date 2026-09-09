import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import $api from '../http';
import AuthService from './AuthService';
import UserService from './UserService';
import { IPay } from '../types/ISubscription';

let api: MockAdapter;

beforeEach(() => {
    api = new MockAdapter($api);
});
afterEach(() => api.restore());

describe('AuthService', () => {
    it('login шлёт POST /login с телом', async () => {
        api.onPost('/login').reply(200, {});
        await AuthService.login('nika@example.com', 'password1');
        expect(api.history.post[0].url).toBe('/login');
        expect(JSON.parse(api.history.post[0].data)).toEqual({
            email: 'nika@example.com',
            password: 'password1',
        });
    });

    it('registration шлёт POST /registration с телом', async () => {
        api.onPost('/registration').reply(200, {});
        await AuthService.registration('nika@example.com', 'password1');
        expect(api.history.post[0].url).toBe('/registration');
    });

    it('reset шлёт GET с почтой в адресе', async () => {
        api.onGet(/\/reset\//).reply(200, {});
        await AuthService.reset('nika@example.com');
        expect(api.history.get[0].url).toBe('/reset/nika@example.com');
    });

    it('password шлёт POST /password с данными из ссылки', async () => {
        api.onPost('/password').reply(200, {});
        await AuthService.password('u-1', 'reset-token', 'password1');
        expect(JSON.parse(api.history.post[0].data)).toEqual({
            userId: 'u-1',
            token: 'reset-token',
            password: 'password1',
        });
    });

    it('logout шлёт POST /logout', async () => {
        api.onPost('/logout').reply(200);
        await AuthService.logout();
        expect(api.history.post[0].url).toBe('/logout');
    });
});

describe('UserService', () => {
    it('createLinkPay шлёт параметры тарифа на /createLinkPay', async () => {
        const pay: IPay = { price: 899, name: '24 часа', date: 86400000, userId: 'u-1' };
        api.onPost('/createLinkPay').reply(200, 'https://example.com');

        const response = await UserService.createLinkPay(pay);

        expect(api.history.post[0].url).toBe('/createLinkPay');
        expect(JSON.parse(api.history.post[0].data)).toEqual(pay);
        expect(response.data).toBe('https://example.com');
    });
});
