import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import $api, { API_URL } from '../../../http';
import reducer from './User';
import { fetchAuth } from './ActionAuth';
import { fetchLogin } from './ActionLogin';
import { fetchLogout } from './ActionLogout';
import { fetchRegistration } from './ActionRegistration';
import { fetchCreateLinkPay } from './ActionCreateLinkPay';
import { storage, TOKEN_KEY } from '../../../utils/storage';
import { IPay } from '../../../types/ISubscription';

vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const makeStore = () => configureStore({ reducer: { user: reducer } });

const user = {
    id: 'u-1',
    email: 'nika@example.com',
    isActivated: true,
    isActivatedSubscription: false,
    dateActivatedSubscription: new Date('2026-12-01T00:00:00.000Z'),
};
const authBody = { accessToken: 'access-token', refreshToken: 'refresh-token', user };

const pay: IPay = { price: 899, name: '24 часа', date: 86400000, userId: 'u-1' };

let api: MockAdapter;
let plain: MockAdapter;

beforeEach(() => {
    api = new MockAdapter($api);
    plain = new MockAdapter(axios);
    storage.remove(TOKEN_KEY);
});

afterEach(() => {
    api.restore();
    plain.restore();
});

describe('fetchAuth', () => {
    it('сохраняет токен и авторизует', async () => {
        plain.onGet(`${API_URL}/refresh`).reply(200, authBody);
        const store = makeStore();

        await store.dispatch(fetchAuth());

        expect(storage.get(TOKEN_KEY)).toBe('access-token');
        expect(store.getState().user.isAuth).toBe(true);
    });

    // Иначе протухший токен заставлял клиент дёргать сервер на каждой загрузке.
    it('на ошибке чистит протухший токен', async () => {
        storage.set(TOKEN_KEY, 'stale-token');
        plain.onGet(`${API_URL}/refresh`).reply(401, { message: 'Пользователь не авторизован', errors: [] });
        const store = makeStore();

        await store.dispatch(fetchAuth());

        expect(storage.get(TOKEN_KEY)).toBeNull();
        expect(store.getState().user.isAuth).toBe(false);
    });

    it('отклоняется человеческим текстом, а не строкой axios', async () => {
        plain.onGet(`${API_URL}/refresh`).reply(401, { message: 'Пользователь не авторизован', errors: [] });

        const result = await makeStore().dispatch(fetchAuth());

        expect(result.payload).toBe('Пользователь не авторизован');
    });

    it('без сети отклоняется понятным текстом', async () => {
        plain.onGet(`${API_URL}/refresh`).networkError();

        const result = await makeStore().dispatch(fetchAuth());

        expect(result.payload).toBe('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз');
    });
});

describe('fetchLogin', () => {
    it('сохраняет токен и авторизует', async () => {
        api.onPost('/login').reply(200, authBody);
        const store = makeStore();

        await store.dispatch(fetchLogin({ email: user.email, password: 'password1' }));

        expect(storage.get(TOKEN_KEY)).toBe('access-token');
        expect(store.getState().user.isAuth).toBe(true);
    });

    it('шлёт почту и пароль на /login', async () => {
        api.onPost('/login').reply(200, authBody);

        await makeStore().dispatch(fetchLogin({ email: user.email, password: 'password1' }));

        expect(JSON.parse(api.history.post[0].data)).toEqual({ email: user.email, password: 'password1' });
    });

    it('на неверный пароль отклоняется текстом сервера и не пишет токен', async () => {
        api.onPost('/login').reply(400, { message: 'Неверный пароль', errors: [] });

        const result = await makeStore().dispatch(fetchLogin({ email: user.email, password: 'wrong' }));

        expect(result.payload).toBe('Неверный пароль');
        expect(storage.get(TOKEN_KEY)).toBeNull();
    });
});

describe('fetchRegistration', () => {
    it('сохраняет токен и авторизует', async () => {
        api.onPost('/registration').reply(200, authBody);
        const store = makeStore();

        await store.dispatch(fetchRegistration({ email: user.email, password: 'password1' }));

        expect(storage.get(TOKEN_KEY)).toBe('access-token');
        expect(store.getState().user.isAuth).toBe(true);
    });

    it('склеивает ошибки валидации в один текст', async () => {
        api.onPost('/registration').reply(400, {
            message: 'Ошибка при валидации',
            errors: [{ msg: 'Неверный формат почты' }, { msg: 'Пароль должен быть минимум 8 символов' }],
        });

        const result = await makeStore().dispatch(fetchRegistration({ email: 'нет', password: '1' }));

        expect(result.payload).toBe('Неверный формат почты. Пароль должен быть минимум 8 символов');
    });

    it('отклоняется, если сервер ответил без токена', async () => {
        api.onPost('/registration').reply(200, { user, refreshToken: 'r' });

        const result = await makeStore().dispatch(fetchRegistration({ email: user.email, password: 'password1' }));

        expect(fetchRegistration.rejected.match(result)).toBe(true);
        expect(result.payload).toBe('Сервер не вернул токен доступа');
        expect(storage.get(TOKEN_KEY)).toBeNull();
    });
});

describe('fetchLogout', () => {
    it('удаляет токен', async () => {
        storage.set(TOKEN_KEY, 'access-token');
        api.onPost('/logout').reply(200);
        const store = makeStore();

        await store.dispatch(fetchLogout());

        expect(storage.get(TOKEN_KEY)).toBeNull();
        expect(store.getState().user.isAuth).toBe(false);
    });

    // Токен всё равно бесполезен, держать его локально незачем.
    it('удаляет токен даже когда сервер не ответил', async () => {
        storage.set(TOKEN_KEY, 'access-token');
        api.onPost('/logout').networkError();
        const store = makeStore();

        const result = await store.dispatch(fetchLogout());

        expect(fetchLogout.rejected.match(result)).toBe(true);
        expect(storage.get(TOKEN_KEY)).toBeNull();
        expect(store.getState().user.isAuth).toBe(false);
    });
});

describe('fetchCreateLinkPay', () => {
    const url = 'https://yoomoney.ru/checkout/payments/v2/contract?orderId=1';

    it('возвращает ссылку на оплату', async () => {
        api.onPost('/createLinkPay').reply(200, url);

        const result = await makeStore().dispatch(fetchCreateLinkPay(pay));

        expect(result.payload).toBe(url);
    });

    it('шлёт параметры тарифа на сервер', async () => {
        api.onPost('/createLinkPay').reply(200, url);

        await makeStore().dispatch(fetchCreateLinkPay(pay));

        expect(JSON.parse(api.history.post[0].data)).toEqual(pay);
    });

    it('на ошибке сервера отклоняется человеческим текстом', async () => {
        api.onPost('/createLinkPay').reply(500, { message: 'Непредвиденная ошибка', errors: [] });

        const result = await makeStore().dispatch(fetchCreateLinkPay(pay));

        expect(fetchCreateLinkPay.rejected.match(result)).toBe(true);
        expect(result.payload).toBe('Непредвиденная ошибка');
    });

    it('подставляет токен в заголовок запроса', async () => {
        storage.set(TOKEN_KEY, 'access-token');
        api.onPost('/createLinkPay').reply(200, url);

        await makeStore().dispatch(fetchCreateLinkPay(pay));

        expect(api.history.post[0].headers?.Authorization).toBe('Bearer access-token');
    });
});
