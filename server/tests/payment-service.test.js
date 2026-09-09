const { mockModule } = require('./helpers/mock-module');

process.env.YOOKASSA_STORE_ID = 'store-1';
process.env.YOOKASSA_SECRET_KEY = 'secret-1';

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// Перехватываем тот же экземпляр axios, которым пользуется сервис,
// чтобы ни один тест не ушёл в настоящую ЮKassa.
const http = new MockAdapter(axios);

const paymentModel = mockModule('models/payment-model', { create: vi.fn(), findOne: vi.fn() });
const userModel = mockModule('models/user-model', { findOne: vi.fn() });

const paymentService = require('../service/payment-service');

const DAY = 24 * 60 * 60 * 1000;

const makePayment = (over = {}) => ({
    order: 'order-1',
    userId: 'u-1',
    name: '24 часа',
    price: 899,
    date: DAY,
    status: 'padding',
    save: vi.fn().mockResolvedValue(undefined),
    ...over,
});

const makeUser = (over = {}) => ({
    _id: 'u-1',
    email: 'nika@example.com',
    isActivated: true,
    save: vi.fn().mockResolvedValue(undefined),
    ...over,
});

const CREATE_URL = 'https://api.yookassa.ru/v3/payments';
const CAPTURE_URL = 'https://api.yookassa.ru/v3/payments/order-1/capture';

// Разбирает перехваченный запрос: тело, заголовки и данные авторизации.
const sent = (index = 0) => {
    const call = http.history.post[index];
    return { body: JSON.parse(call.data), headers: call.headers, auth: call.auth, url: call.url };
};

beforeEach(() => {
    http.reset();
    paymentModel.create.mockReset();
    paymentModel.findOne.mockReset();
    userModel.findOne.mockReset();
});

afterAll(() => http.restore());

describe('createLinkPay', () => {
    const created = { id: 'order-1', confirmation: { confirmation_url: 'https://yoomoney.ru/checkout/1' } };

    it('создаёт платёж в ЮKassa и возвращает его данные', async () => {
        http.onPost(CREATE_URL).reply(200, created);

        const result = await paymentService.createLinkPay({ price: 899, name: '24 часа' });

        expect(result).toEqual(created);
    });

    it('сумма уходит в рублях с копейками', async () => {
        http.onPost(CREATE_URL).reply(200, created);

        await paymentService.createLinkPay({ price: 899, name: '24 часа' });

        expect(sent().body.amount).toEqual({ value: '899.00', currency: 'RUB' });
    });

    it('после оплаты возвращает человека на страницу упражнений', async () => {
        http.onPost(CREATE_URL).reply(200, created);

        await paymentService.createLinkPay({ price: 899, name: '24 часа' });

        expect(sent().body.confirmation).toEqual({
            type: 'redirect',
            return_url: 'https://nikassdgym.ru/exercises',
        });
    });

    it('в описании платежа виден тариф', async () => {
        http.onPost(CREATE_URL).reply(200, created);

        await paymentService.createLinkPay({ price: 899, name: '24 часа' });

        expect(sent().body.description).toBe('Оплата тарифа: 24 часа');
    });

    it('запрос уходит с ключами магазина и ключом идемпотентности', async () => {
        http.onPost(CREATE_URL).reply(200, created);

        await paymentService.createLinkPay({ price: 899, name: '24 часа' });

        expect(sent().auth).toEqual({ username: 'store-1', password: 'secret-1' });
        expect(sent().headers['Idempotence-Key']).toEqual(expect.any(String));
    });

    // Иначе повторный клик мог бы создать второй платёж на ту же сумму.
    it('у двух платежей разные ключи идемпотентности', async () => {
        http.onPost(CREATE_URL).reply(200, created);

        await paymentService.createLinkPay({ price: 899, name: '24 часа' });
        await paymentService.createLinkPay({ price: 899, name: '24 часа' });

        expect(sent(0).headers['Idempotence-Key']).not.toBe(sent(1).headers['Idempotence-Key']);
    });

    it('ошибку ЮKassa пробрасывает наверх', async () => {
        http.onPost(CREATE_URL).reply(500, { error: 'ЮKassa недоступна' });

        await expect(paymentService.createLinkPay({ price: 899, name: '24 часа' })).rejects.toBeDefined();
    });
});

describe('savePayment', () => {
    it('сохраняет заказ вместе с тарифом и пользователем', async () => {
        paymentModel.create.mockResolvedValue({});

        await paymentService.savePayment({
            userId: 'u-1',
            date: DAY,
            price: 899,
            name: '24 часа',
            order: 'order-1',
        });

        expect(paymentModel.create).toHaveBeenCalledWith({
            order: 'order-1',
            userId: 'u-1',
            name: '24 часа',
            price: 899,
            date: DAY,
        });
    });
});

describe('webhook', () => {

    it('на неизвестный заказ отвечает ошибкой', async () => {
        paymentModel.findOne.mockResolvedValue(null);

        await expect(paymentService.webhook({ id: 'нет-такого' })).rejects.toThrow('Заказ не найден по id');
    });

    it('промежуточный статус только записывает и подписку не трогает', async () => {
        const payment = makePayment();
        paymentModel.findOne.mockResolvedValue(payment);

        await paymentService.webhook({ id: 'order-1', status: 'pending' });

        expect(payment.status).toBe('pending');
        expect(payment.save).toHaveBeenCalled();
        expect(userModel.findOne).not.toHaveBeenCalled();
        expect(http.history.post).toHaveLength(0);
    });

    it('на оплату без пользователя отвечает ошибкой', async () => {
        paymentModel.findOne.mockResolvedValue(makePayment());
        userModel.findOne.mockResolvedValue(null);

        await expect(
            paymentService.webhook({ id: 'order-1', status: 'waiting_for_capture' })
        ).rejects.toThrow('Пользователь не найден по id');
    });

    it('первому платежу открывает подписку от текущего момента', async () => {
        const payment = makePayment();
        const user = makeUser();
        paymentModel.findOne.mockResolvedValue(payment);
        userModel.findOne.mockResolvedValue(user);
        http.onPost(CAPTURE_URL).reply(200, {});

        await paymentService.webhook({ id: 'order-1', status: 'waiting_for_capture' });

        expect(user.activateSubscriptionExp.getTime()).toBeGreaterThan(Date.now() + DAY - 5000);
        expect(user.save).toHaveBeenCalled();
    });

    // Продление не должно съедать остаток оплаченного времени.
    it('к живой подписке добавляет срок поверх остатка', async () => {
        const currentExpiry = new Date(Date.now() + 10 * DAY);
        const payment = makePayment();
        const user = makeUser({ activateSubscriptionExp: currentExpiry });
        paymentModel.findOne.mockResolvedValue(payment);
        userModel.findOne.mockResolvedValue(user);
        http.onPost(CAPTURE_URL).reply(200, {});

        await paymentService.webhook({ id: 'order-1', status: 'waiting_for_capture' });

        expect(user.activateSubscriptionExp.getTime()).toBe(currentExpiry.getTime() + DAY);
    });

    it('к истёкшей подписке отсчитывает срок заново от текущего момента', async () => {
        const expired = new Date(Date.now() - 10 * DAY);
        const payment = makePayment();
        const user = makeUser({ activateSubscriptionExp: expired });
        paymentModel.findOne.mockResolvedValue(payment);
        userModel.findOne.mockResolvedValue(user);
        http.onPost(CAPTURE_URL).reply(200, {});

        await paymentService.webhook({ id: 'order-1', status: 'waiting_for_capture' });

        expect(user.activateSubscriptionExp.getTime()).toBeGreaterThan(Date.now() + DAY - 5000);
    });

    it('подтверждает платёж в ЮKassa', async () => {
        paymentModel.findOne.mockResolvedValue(makePayment());
        userModel.findOne.mockResolvedValue(makeUser());
        http.onPost(CAPTURE_URL).reply(200, {});

        await paymentService.webhook({ id: 'order-1', status: 'waiting_for_capture' });

        expect(sent().url).toBe(CAPTURE_URL);
    });

    it('после подтверждения помечает заказ успешным', async () => {
        const payment = makePayment();
        paymentModel.findOne.mockResolvedValue(payment);
        userModel.findOne.mockResolvedValue(makeUser());
        http.onPost(CAPTURE_URL).reply(200, {});

        await paymentService.webhook({ id: 'order-1', status: 'waiting_for_capture' });

        expect(payment.status).toBe('success');
        expect(payment.save).toHaveBeenCalledTimes(2);
    });

    it('если ЮKassa не подтвердила — подписка не сохраняется', async () => {
        const user = makeUser();
        paymentModel.findOne.mockResolvedValue(makePayment());
        userModel.findOne.mockResolvedValue(user);
        http.onPost(CAPTURE_URL).reply(202, {});

        await expect(
            paymentService.webhook({ id: 'order-1', status: 'waiting_for_capture' })
        ).rejects.toThrow('Заказ не подтвердися сервисом YooKassa');
        expect(user.save).not.toHaveBeenCalled();
    });
});
