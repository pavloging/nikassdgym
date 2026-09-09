const express = require('express');
const cookieParser = require('cookie-parser');
const request = require('supertest');
const { mockModule } = require('./helpers/mock-module');

process.env.CLIENT_URL = 'https://nikassdgym.ru';
process.env.COOKIE_SECURE = 'true';

const userService = mockModule('service/user-service', {
    registration: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    activate: vi.fn(),
    reset: vi.fn(),
    password: vi.fn(),
    passwordToken: vi.fn(),
});
const paymentService = mockModule('service/payment-service', {
    createLinkPay: vi.fn(),
    savePayment: vi.fn(),
    activateSubscription: vi.fn(),
    webhook: vi.fn(),
});
const tokenService = mockModule('service/token-service', {
    validateAccessToken: vi.fn(),
    generateTokens: vi.fn(),
    saveToken: vi.fn(),
    removeToken: vi.fn(),
    findToken: vi.fn(),
    validateRefreshToken: vi.fn(),
});

const ApiError = require('../exceptions/api-error');
const router = require('../router/index');
const errorMiddleware = require('../middlewares/error-middleware');

// Тот же набор middleware, что и в index.js, но без подключения к базе.
function makeApp() {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api', router);
    app.use(errorMiddleware);
    return app;
}

const app = makeApp();

const authBody = {
    accessToken: 'access',
    refreshToken: 'refresh',
    user: { id: 'u-1', email: 'nika@example.com', isActivated: true },
};

const credentials = { email: 'nika@example.com', password: 'password1' };

// Достаёт заголовок с refresh-кукой из ответа.
const refreshCookie = (res) =>
    (res.headers['set-cookie'] || []).find((c) => c.startsWith('refreshToken='));

let warn;
let errorLog;

beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
    Object.values(userService).forEach((fn) => fn.mockReset());
    Object.values(paymentService).forEach((fn) => fn.mockReset());
    tokenService.validateAccessToken.mockReset();
});

describe('POST /api/registration', () => {
    it('на валидные данные заводит аккаунт и ставит refresh-куку', async () => {
        userService.registration.mockResolvedValue(authBody);

        const res = await request(app).post('/api/registration').send(credentials);

        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBe('access');
        expect(refreshCookie(res)).toBeDefined();
    });

    it('refresh-кука закрыта от JavaScript и уходит только по https', async () => {
        userService.registration.mockResolvedValue(authBody);

        const res = await request(app).post('/api/registration').send(credentials);

        expect(refreshCookie(res)).toContain('HttpOnly');
        expect(refreshCookie(res)).toContain('Secure');
        expect(refreshCookie(res)).toContain('SameSite=Lax');
    });

    it('на кривую почту отвечает ошибкой валидации', async () => {
        const res = await request(app).post('/api/registration').send({ email: 'нет', password: '123' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Ошибка при валидации');
        expect(res.body.errors.map((e) => e.msg)).toEqual([
            'Неверный формат почты',
            'Пароль должен быть минимум 8 символов',
        ]);
        expect(userService.registration).not.toHaveBeenCalled();
    });

    it('короткий пароль до сервиса не доходит', async () => {
        const res = await request(app)
            .post('/api/registration')
            .send({ email: 'nika@example.com', password: '1234567' });

        expect(res.status).toBe(400);
        expect(userService.registration).not.toHaveBeenCalled();
    });

    it('на занятую почту отдаёт текст сервиса', async () => {
        userService.registration.mockRejectedValue(ApiError.BadRequest('Пользователь уже существует'));

        const res = await request(app).post('/api/registration').send(credentials);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Пользователь уже существует');
    });
});

describe('POST /api/login', () => {
    it('на верные данные отдаёт токен и ставит куку', async () => {
        userService.login.mockResolvedValue(authBody);

        const res = await request(app).post('/api/login').send(credentials);

        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBe('access');
        expect(refreshCookie(res)).toBeDefined();
    });

    it('на неверный пароль отдаёт 400 с текстом', async () => {
        userService.login.mockRejectedValue(ApiError.BadRequest('Неверный пароль'));

        const res = await request(app).post('/api/login').send(credentials);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Неверный пароль', errors: [] });
    });

    it('кривую почту не пропускает', async () => {
        const res = await request(app).post('/api/login').send({ email: 'нет', password: 'password1' });

        expect(res.status).toBe(400);
        expect(userService.login).not.toHaveBeenCalled();
    });
});

describe('GET /api/refresh', () => {
    it('по куке обновляет сессию и выдаёт новую куку', async () => {
        userService.refresh.mockResolvedValue(authBody);

        const res = await request(app).get('/api/refresh').set('Cookie', 'refreshToken=r-1');

        expect(res.status).toBe(200);
        expect(userService.refresh).toHaveBeenCalledWith('r-1');
        expect(refreshCookie(res)).toBeDefined();
    });

    it('без куки отвечает 401 с человеческим текстом', async () => {
        userService.refresh.mockRejectedValue(ApiError.UnauthorizedError());

        const res = await request(app).get('/api/refresh');

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Пользователь не авторизован');
    });

    // Именно этот ответ клиент раньше показывал двумя уведомлениями подряд.
    it('в теле 401 нет технических подробностей', async () => {
        userService.refresh.mockRejectedValue(ApiError.UnauthorizedError());

        const res = await request(app).get('/api/refresh');

        expect(Object.keys(res.body).sort()).toEqual(['errors', 'message']);
        expect(JSON.stringify(res.body)).not.toContain('stack');
    });
});

describe('POST /api/logout', () => {
    it('удаляет сессию и гасит куку', async () => {
        userService.logout.mockResolvedValue({ deletedCount: 1 });

        const res = await request(app).post('/api/logout').set('Cookie', 'refreshToken=r-1');

        expect(res.status).toBe(200);
        expect(userService.logout).toHaveBeenCalledWith('r-1');
        expect(refreshCookie(res)).toContain('Expires=Thu, 01 Jan 1970');
    });

    it('ошибку выхода отдаёт клиенту, а не роняет запрос', async () => {
        userService.logout.mockRejectedValue(new Error('база недоступна'));

        const res = await request(app).post('/api/logout').set('Cookie', 'refreshToken=r-1');

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Непредвиденная ошибка');
    });

    // Флаги при удалении должны совпадать с флагами при установке, иначе браузер не удалит куку.
    it('гасит куку теми же флагами, что и ставил', async () => {
        userService.logout.mockResolvedValue({});

        const res = await request(app).post('/api/logout').set('Cookie', 'refreshToken=r-1');

        expect(refreshCookie(res)).toContain('HttpOnly');
        expect(refreshCookie(res)).toContain('Secure');
        expect(refreshCookie(res)).toContain('SameSite=Lax');
    });
});

describe('GET /api/reset/:email', () => {
    it('передаёт почту в сервис', async () => {
        userService.reset.mockResolvedValue(undefined);

        const res = await request(app).get('/api/reset/nika@example.com');

        expect(res.status).toBe(200);
        expect(userService.reset).toHaveBeenCalledWith('nika@example.com');
    });

    it('на неизвестную почту отвечает 400', async () => {
        userService.reset.mockRejectedValue(ApiError.BadRequest('Email не найден'));

        const res = await request(app).get('/api/reset/no@example.com');

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Email не найден');
    });
});

describe('смена пароля', () => {
    it('POST /api/password меняет пароль', async () => {
        userService.password.mockResolvedValue({ userId: 'u-1', token: 't' });

        const res = await request(app)
            .post('/api/password')
            .send({ userId: 'u-1', token: 't', password: 'newpassword1' });

        expect(res.status).toBe(200);
        expect(userService.password).toHaveBeenCalledWith({
            userId: 'u-1',
            token: 't',
            password: 'newpassword1',
        });
    });

    it('GET /api/password/:token уводит на форму на сайте', async () => {
        userService.passwordToken.mockResolvedValue({ userId: 'u-1', token: 't' });

        const res = await request(app).get('/api/password/t');

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('https://nikassdgym.ru/password?userId=u-1&token=t');
    });

    it('на просроченный токен отвечает 400', async () => {
        userService.passwordToken.mockRejectedValue(ApiError.BadRequest('Пользователь не найден'));

        const res = await request(app).get('/api/password/старый');

        expect(res.status).toBe(400);
    });

    it('ошибку смены пароля отдаёт клиенту, а не роняет запрос', async () => {
        userService.password.mockRejectedValue(ApiError.BadRequest('Время жизни токена истекло'));

        const res = await request(app)
            .post('/api/password')
            .send({ userId: 'u-1', token: 'старый', password: 'newpassword1' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Время жизни токена истекло');
    });
});

describe('GET /api/activate/:link', () => {
    it('активирует аккаунт и возвращает на сайт', async () => {
        userService.activate.mockResolvedValue(undefined);

        const res = await request(app).get('/api/activate/link-uuid');

        expect(userService.activate).toHaveBeenCalledWith('link-uuid');
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('https://nikassdgym.ru');
    });

    it('на чужую ссылку отвечает 400 и никуда не уводит', async () => {
        userService.activate.mockRejectedValue(ApiError.BadRequest('Неккоректная ссылка активации'));

        const res = await request(app).get('/api/activate/чужая');

        expect(res.status).toBe(400);
    });
});

describe('POST /api/createLinkPay', () => {
    const pay = { userId: 'u-1', date: 86400000, price: 899, name: '24 часа' };
    const created = { id: 'order-1', confirmation: { confirmation_url: 'https://yoomoney.ru/checkout/1' } };
    const jwt = require('jsonwebtoken');

    beforeEach(() => {
        process.env.JWT_ACCESS_SECRET = 'test-access-secret';
        tokenService.validateAccessToken.mockImplementation((token) => {
            try {
                return jwt.verify(token, 'test-access-secret');
            } catch {
                return null;
            }
        });
    });

    const token = () => jwt.sign({ id: 'u-1' }, 'test-access-secret', { expiresIn: '1h' });

    it('без токена не пускает', async () => {
        const res = await request(app).post('/api/createLinkPay').send(pay);

        expect(res.status).toBe(401);
        expect(paymentService.createLinkPay).not.toHaveBeenCalled();
    });

    it('с чужим токеном не пускает', async () => {
        const res = await request(app)
            .post('/api/createLinkPay')
            .set('Authorization', `Bearer ${jwt.sign({ id: 'u-1' }, 'чужой')}`)
            .send(pay);

        expect(res.status).toBe(401);
        expect(paymentService.createLinkPay).not.toHaveBeenCalled();
    });

    it('с валидным токеном отдаёт ссылку на оплату', async () => {
        paymentService.createLinkPay.mockResolvedValue(created);
        paymentService.savePayment.mockResolvedValue(undefined);

        const res = await request(app)
            .post('/api/createLinkPay')
            .set('Authorization', `Bearer ${token()}`)
            .send(pay);

        expect(res.status).toBe(200);
        expect(res.body).toBe('https://yoomoney.ru/checkout/1');
    });

    it('сохраняет заказ вместе с номером платежа', async () => {
        paymentService.createLinkPay.mockResolvedValue(created);
        paymentService.savePayment.mockResolvedValue(undefined);

        await request(app)
            .post('/api/createLinkPay')
            .set('Authorization', `Bearer ${token()}`)
            .send(pay);

        expect(paymentService.savePayment).toHaveBeenCalledWith({ ...pay, order: 'order-1' });
    });

    it('ошибку ЮKassa отдаёт как 500 без подробностей', async () => {
        paymentService.createLinkPay.mockRejectedValue(new Error('секретная подробность'));

        const res = await request(app)
            .post('/api/createLinkPay')
            .set('Authorization', `Bearer ${token()}`)
            .send(pay);

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Непредвиденная ошибка');
        expect(JSON.stringify(res.body)).not.toContain('секретная подробность');
    });
});

describe('POST /api/webhook', () => {
    it('принимает уведомление ЮKassa и отвечает ok', async () => {
        paymentService.webhook.mockResolvedValue(undefined);

        const res = await request(app)
            .post('/api/webhook')
            .send({ object: { id: 'order-1', status: 'waiting_for_capture' } });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
        expect(paymentService.webhook).toHaveBeenCalledWith({ id: 'order-1', status: 'waiting_for_capture' });
    });

    it('на неизвестный заказ отвечает 500, а не падает', async () => {
        paymentService.webhook.mockRejectedValue(new Error('Заказ не найден по id'));

        const res = await request(app).post('/api/webhook').send({ object: { id: 'нет' } });

        expect(res.status).toBe(500);
    });

    // Вебхук доступен без токена — его дёргает сама ЮKassa.
    it('не требует авторизации', async () => {
        paymentService.webhook.mockResolvedValue(undefined);

        const res = await request(app).post('/api/webhook').send({ object: { id: 'order-1' } });

        expect(res.status).toBe(200);
    });
});

// Такой маршрут был, вызывал несуществующий метод сервиса и по замыслу
// выдавал бы подписку без оплаты. Проверяем, что его больше нет.
describe('активация подписки в обход оплаты', () => {
    it('отдельного маршрута активации не существует', async () => {
        const res = await request(app)
            .post('/api/activateSubscription')
            .send({ userId: 'u-1', date: 86400000 });

        expect(res.status).toBe(404);
    });
});

describe('неизвестные адреса', () => {
    it('несуществующий маршрут отдаёт 404', async () => {
        const res = await request(app).get('/api/не-существует');
        expect(res.status).toBe(404);
    });

    it('запрос без тела не роняет сервер', async () => {
        const res = await request(app).post('/api/login').send();

        expect(res.status).toBe(400);
        expect(userService.login).not.toHaveBeenCalled();
    });

    it('битый JSON отклоняется, а не валит процесс', async () => {
        const res = await request(app)
            .post('/api/login')
            .set('Content-Type', 'application/json')
            .send('{не json');

        expect(res.status).toBeGreaterThanOrEqual(400);
        expect(errorLog).toBeDefined();
        expect(warn).toBeDefined();
    });
});
