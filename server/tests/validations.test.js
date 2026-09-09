const express = require('express');
const request = require('supertest');
const { validationResult } = require('express-validator');
const { registrationValidation, loginValidation } = require('../middlewares/validations');

// Поднимает крошечное приложение с нужным набором правил и возвращает их результат.
function appWith(rules) {
    const app = express();
    app.use(express.json());
    app.post('/', rules, (req, res) => res.json({ errors: validationResult(req).array() }));
    return app;
}

const messages = (res) => res.body.errors.map((e) => e.msg);

describe('правила регистрации', () => {
    it('пропускают корректные данные', async () => {
        const res = await request(appWith(registrationValidation))
            .post('/')
            .send({ email: 'nika@example.com', password: 'password1' });

        expect(messages(res)).toEqual([]);
    });

    it('ловят кривую почту', async () => {
        const res = await request(appWith(registrationValidation))
            .post('/')
            .send({ email: 'нет-собаки', password: 'password1' });

        expect(messages(res)).toContain('Неверный формат почты');
    });

    it('ловят короткий пароль', async () => {
        const res = await request(appWith(registrationValidation))
            .post('/')
            .send({ email: 'nika@example.com', password: '1234567' });

        expect(messages(res)).toContain('Пароль должен быть минимум 8 символов');
    });

    it('пароль ровно из восьми символов подходит', async () => {
        const res = await request(appWith(registrationValidation))
            .post('/')
            .send({ email: 'nika@example.com', password: '12345678' });

        expect(messages(res)).toEqual([]);
    });

    it('на пустое тело выдают обе ошибки сразу', async () => {
        const res = await request(appWith(registrationValidation)).post('/').send({});

        expect(messages(res)).toEqual([
            'Неверный формат почты',
            'Пароль должен быть минимум 8 символов',
        ]);
    });
});

describe('правила входа', () => {
    it('пропускают корректные данные', async () => {
        const res = await request(appWith(loginValidation))
            .post('/')
            .send({ email: 'nika@example.com', password: 'password1' });

        expect(messages(res)).toEqual([]);
    });

    it('ловят кривую почту', async () => {
        const res = await request(appWith(loginValidation))
            .post('/')
            .send({ email: 'нет-собаки', password: 'password1' });

        expect(messages(res)).toContain('Неверный формат почты');
    });

    it('ловят пустой пароль', async () => {
        const res = await request(appWith(loginValidation))
            .post('/')
            .send({ email: 'nika@example.com', password: '' });

        expect(messages(res)).toContain('Введите пароль');
    });

    // Пароль мог быть задан до появления требования в восемь символов —
    // на входе длину не проверяем, иначе такие люди не смогли бы войти.
    it('короткий пароль на входе не блокируют', async () => {
        const res = await request(appWith(loginValidation))
            .post('/')
            .send({ email: 'nika@example.com', password: '123' });

        expect(messages(res)).toEqual([]);
    });
});
