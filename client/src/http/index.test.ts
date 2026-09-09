import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import $api, { API_URL } from './index';
import { storage, TOKEN_KEY } from '../utils/storage';

let mock: MockAdapter;
let plainMock: MockAdapter;

beforeEach(() => {
    mock = new MockAdapter($api);
    plainMock = new MockAdapter(axios);
    storage.remove(TOKEN_KEY);
});

afterEach(() => {
    mock.restore();
    plainMock.restore();
});

describe('API_URL', () => {
    it('строится от текущего домена, а не захардкожен', () => {
        expect(API_URL).toBe(`${window.location.origin}/api`);
    });
});

describe('интерцептор запроса', () => {
    it('подставляет токен в заголовок Authorization', async () => {
        storage.set(TOKEN_KEY, 'access-token');
        mock.onGet('/ping').reply(200, {});

        await $api.get('/ping');

        expect(mock.history.get[0].headers?.Authorization).toBe('Bearer access-token');
    });

    // Раньше без токена уходила строка "Bearer null".
    it('не шлёт заголовок, когда токена нет', async () => {
        mock.onGet('/ping').reply(200, {});

        await $api.get('/ping');

        expect(mock.history.get[0].headers?.Authorization).toBeUndefined();
    });
});

describe('интерцептор ответа', () => {
    it('успешный ответ пропускает как есть', async () => {
        mock.onGet('/ping').reply(200, { ok: true });

        const response = await $api.get('/ping');

        expect(response.data).toEqual({ ok: true });
    });

    it('на 401 обновляет токен и повторяет запрос', async () => {
        mock.onGet('/secret').replyOnce(401, { message: 'Пользователь не авторизован', errors: [] });
        plainMock.onGet(`${API_URL}/refresh`).reply(200, { accessToken: 'fresh-token' });
        mock.onGet('/secret').reply(200, { data: 'ok' });

        const response = await $api.get('/secret');

        expect(response.data).toEqual({ data: 'ok' });
        expect(storage.get(TOKEN_KEY)).toBe('fresh-token');
    });

    it('если обновить сессию не вышло — чистит токен и отдаёт ошибку', async () => {
        storage.set(TOKEN_KEY, 'stale-token');
        mock.onGet('/secret').reply(401, { message: 'Пользователь не авторизован', errors: [] });
        plainMock.onGet(`${API_URL}/refresh`).reply(401, { message: 'Пользователь не авторизован' });

        await expect($api.get('/secret')).rejects.toMatchObject({ response: { status: 401 } });
        expect(storage.get(TOKEN_KEY)).toBeNull();
    });

    // Иначе один протухший токен уводит клиент в бесконечный цикл обновлений.
    it('повторяет запрос не больше одного раза', async () => {
        mock.onGet('/secret').reply(401, { message: 'Пользователь не авторизован', errors: [] });
        plainMock.onGet(`${API_URL}/refresh`).reply(200, { accessToken: 'fresh-token' });

        await expect($api.get('/secret')).rejects.toBeDefined();

        expect(plainMock.history.get.filter((r) => r.url === `${API_URL}/refresh`)).toHaveLength(1);
        expect(mock.history.get.filter((r) => r.url === '/secret')).toHaveLength(2);
    });

    it('ошибки кроме 401 не пытается чинить обновлением сессии', async () => {
        mock.onGet('/secret').reply(500, { message: 'Непредвиденная ошибка' });

        await expect($api.get('/secret')).rejects.toMatchObject({ response: { status: 500 } });
        expect(plainMock.history.get).toHaveLength(0);
    });

    // Раньше здесь читалось error.response.status и обработчик падал сам.
    it('не падает, когда ответа нет вовсе (нет сети)', async () => {
        mock.onGet('/secret').networkError();

        await expect($api.get('/secret')).rejects.toMatchObject({ message: expect.stringContaining('Network') });
        expect(plainMock.history.get).toHaveLength(0);
    });

    it('таймаут пробрасывает наружу без обновления сессии', async () => {
        mock.onGet('/slow').timeout();

        await expect($api.get('/slow')).rejects.toBeDefined();
        expect(plainMock.history.get).toHaveLength(0);
    });
});

describe('настройки клиента', () => {
    it('шлёт куки на свой домен', () => {
        expect($api.defaults.withCredentials).toBe(true);
    });

    it('использует API_URL как базовый адрес', () => {
        expect($api.defaults.baseURL).toBe(API_URL);
    });
});
