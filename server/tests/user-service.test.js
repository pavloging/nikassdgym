const bcrypt = require('bcrypt');
const { mockModule } = require('./helpers/mock-module');

process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.API_URL = 'https://nikassdgym.ru/api';

const UserModel = mockModule('models/user-model', {
    findOne: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
});
const mailService = mockModule('service/mail-service', {
    sendActivationMail: vi.fn().mockResolvedValue(undefined),
    sendResetPassword: vi.fn().mockResolvedValue(undefined),
});
const tokenService = mockModule('service/token-service', {
    generateTokens: vi.fn(() => ({ accessToken: 'access', refreshToken: 'refresh' })),
    saveToken: vi.fn().mockResolvedValue({}),
    removeToken: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    findToken: vi.fn(),
    validateRefreshToken: vi.fn(),
    validateAccessToken: vi.fn(),
});

const ApiError = require('../exceptions/api-error');
const userService = require('../service/user-service');

const makeUser = (over = {}) => ({
    _id: 'u-1',
    email: 'nika@example.com',
    password: 'хеш',
    isActivated: false,
    save: vi.fn().mockResolvedValue(undefined),
    ...over,
});

beforeEach(() => {
    Object.values(UserModel).forEach((fn) => fn.mockReset());
    mailService.sendActivationMail.mockReset().mockResolvedValue(undefined);
    mailService.sendResetPassword.mockReset().mockResolvedValue(undefined);
    tokenService.generateTokens.mockReset().mockReturnValue({ accessToken: 'access', refreshToken: 'refresh' });
    tokenService.saveToken.mockReset().mockResolvedValue({});
    tokenService.findToken.mockReset();
    tokenService.validateRefreshToken.mockReset();
    tokenService.removeToken.mockReset().mockResolvedValue({ deletedCount: 1 });
});

describe('registration', () => {
    it('заводит пользователя, шлёт письмо и отдаёт токены', async () => {
        UserModel.findOne.mockResolvedValue(null);
        UserModel.create.mockResolvedValue(makeUser());

        const result = await userService.registration('nika@example.com', 'password1');

        expect(result.accessToken).toBe('access');
        expect(result.user.email).toBe('nika@example.com');
        expect(mailService.sendActivationMail).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledWith('u-1', 'refresh');
    });

    it('пароль в базу кладётся хешем, а не как есть', async () => {
        UserModel.findOne.mockResolvedValue(null);
        UserModel.create.mockResolvedValue(makeUser());

        await userService.registration('nika@example.com', 'password1');

        const saved = UserModel.create.mock.calls[0][0];
        expect(saved.password).not.toBe('password1');
        expect(await bcrypt.compare('password1', saved.password)).toBe(true);
    });

    it('на занятую почту отвечает понятной ошибкой', async () => {
        UserModel.findOne.mockResolvedValue(makeUser());

        await expect(userService.registration('nika@example.com', 'password1')).rejects.toMatchObject({
            status: 400,
            message: 'Пользователь с почтовым адресом nika@example.com уже существует',
        });
        expect(UserModel.create).not.toHaveBeenCalled();
    });

    it('в письме уходит ссылка активации с сервера', async () => {
        UserModel.findOne.mockResolvedValue(null);
        UserModel.create.mockResolvedValue(makeUser());

        await userService.registration('nika@example.com', 'password1');

        const [to, link] = mailService.sendActivationMail.mock.calls[0];
        expect(to).toBe('nika@example.com');
        expect(link).toContain('https://nikassdgym.ru/api/activate/');
    });
});

describe('login', () => {
    it('с верным паролем отдаёт токены и пользователя', async () => {
        const password = await bcrypt.hash('password1', 3);
        UserModel.findOne.mockResolvedValue(makeUser({ password }));

        const result = await userService.login('nika@example.com', 'password1');

        expect(result.accessToken).toBe('access');
        expect(result.user.email).toBe('nika@example.com');
    });

    it('на неизвестную почту отвечает ошибкой', async () => {
        UserModel.findOne.mockResolvedValue(null);

        await expect(userService.login('no@example.com', 'password1')).rejects.toMatchObject({
            status: 400,
            message: 'Пользователь с таким email не найден',
        });
    });

    it('на неверный пароль отвечает ошибкой и не выдаёт токены', async () => {
        const password = await bcrypt.hash('password1', 3);
        UserModel.findOne.mockResolvedValue(makeUser({ password }));

        await expect(userService.login('nika@example.com', 'wrong')).rejects.toMatchObject({
            status: 400,
            message: 'Неверный пароль',
        });
        expect(tokenService.saveToken).not.toHaveBeenCalled();
    });

    it('в ответе нет пароля', async () => {
        const password = await bcrypt.hash('password1', 3);
        UserModel.findOne.mockResolvedValue(makeUser({ password }));

        const result = await userService.login('nika@example.com', 'password1');

        expect(JSON.stringify(result)).not.toContain(password);
    });
});

describe('refresh', () => {
    it('по валидному токену из базы обновляет сессию', async () => {
        tokenService.validateRefreshToken.mockReturnValue({ id: 'u-1' });
        tokenService.findToken.mockResolvedValue({ refreshToken: 'refresh' });
        UserModel.findById.mockResolvedValue(makeUser());

        const result = await userService.refresh('refresh');

        expect(result.accessToken).toBe('access');
        expect(UserModel.findById).toHaveBeenCalledWith('u-1');
    });

    it('без токена отвечает 401', async () => {
        await expect(userService.refresh(undefined)).rejects.toMatchObject({ status: 401 });
    });

    it('с испорченной подписью отвечает 401', async () => {
        tokenService.validateRefreshToken.mockReturnValue(null);
        tokenService.findToken.mockResolvedValue({ refreshToken: 'refresh' });

        await expect(userService.refresh('битый')).rejects.toMatchObject({ status: 401 });
    });

    // Вышли из системы — токен удалён из базы, и подписи уже недостаточно.
    it('на отозванный токен отвечает 401', async () => {
        tokenService.validateRefreshToken.mockReturnValue({ id: 'u-1' });
        tokenService.findToken.mockResolvedValue(null);

        await expect(userService.refresh('отозванный')).rejects.toMatchObject({ status: 401 });
    });

    it('ошибка — это ApiError, а не голый Error', async () => {
        await expect(userService.refresh(null)).rejects.toBeInstanceOf(ApiError);
    });
});

describe('logout', () => {
    it('удаляет refresh-токен из базы', async () => {
        await userService.logout('refresh');
        expect(tokenService.removeToken).toHaveBeenCalledWith('refresh');
    });
});

describe('activate', () => {
    it('по корректной ссылке помечает аккаунт активированным', async () => {
        const user = makeUser();
        UserModel.findOne.mockResolvedValue(user);

        await userService.activate('link-uuid');

        expect(user.isActivated).toBe(true);
        expect(user.save).toHaveBeenCalled();
    });

    it('на неизвестную ссылку отвечает ошибкой', async () => {
        UserModel.findOne.mockResolvedValue(null);

        await expect(userService.activate('чужая-ссылка')).rejects.toMatchObject({
            status: 400,
            message: 'Неккоректная ссылка активации',
        });
    });
});

describe('reset', () => {
    it('на неизвестную почту отвечает ошибкой', async () => {
        UserModel.findOne.mockResolvedValue(null);

        await expect(userService.reset('no@example.com')).rejects.toMatchObject({
            status: 400,
            message: 'Email не найден',
        });
    });

    it('известной почте записывает токен и шлёт письмо', async () => {
        const user = makeUser();
        UserModel.findOne.mockResolvedValue(user);

        await userService.reset('nika@example.com');

        expect(user.resetToken).toEqual(expect.any(String));
        expect(user.resetTokenExp).toBeGreaterThan(Date.now());
        expect(user.save).toHaveBeenCalled();
        expect(mailService.sendResetPassword).toHaveBeenCalledTimes(1);
    });

    it('в письме уходит ссылка с токеном', async () => {
        const user = makeUser();
        UserModel.findOne.mockResolvedValue(user);

        await userService.reset('nika@example.com');

        const [to, link] = mailService.sendResetPassword.mock.calls[0];
        expect(to).toBe('nika@example.com');
        expect(link).toContain(user.resetToken);
    });

    it('у двух запросов разные токены', async () => {
        const first = makeUser();
        const second = makeUser();
        UserModel.findOne.mockResolvedValueOnce(first).mockResolvedValueOnce(second);

        await userService.reset('nika@example.com');
        await userService.reset('nika@example.com');

        expect(first.resetToken).not.toBe(second.resetToken);
    });

    // Раньше ответ уходил раньше письма, и клиент видел успех даже при мёртвом SMTP.
    it('если письмо не ушло — отвечает ошибкой, а не молчаливым успехом', async () => {
        UserModel.findOne.mockResolvedValue(makeUser());
        mailService.sendResetPassword.mockRejectedValue(new Error('SMTP недоступен'));

        await expect(userService.reset('nika@example.com')).rejects.toThrow('SMTP недоступен');
    });
});

describe('password', () => {
    it('по живому токену меняет пароль на новый хеш', async () => {
        const user = makeUser({ password: 'старый-хеш' });
        UserModel.findOne.mockResolvedValue(user);

        const result = await userService.password({ userId: 'u-1', token: 't', password: 'newpassword1' });

        expect(await bcrypt.compare('newpassword1', user.password)).toBe(true);
        expect(user.save).toHaveBeenCalled();
        expect(result).toEqual({ userId: 'u-1', token: 't' });
    });

    it('после смены пароля токен сброса гасится', async () => {
        const user = makeUser({ resetToken: 't', resetTokenExp: Date.now() + 1000 });
        UserModel.findOne.mockResolvedValue(user);

        await userService.password({ userId: 'u-1', token: 't', password: 'newpassword1' });

        expect(user.resetToken).toBeUndefined();
        expect(user.resetTokenExp).toBeUndefined();
    });

    it('ищет пользователя с ещё не истёкшим токеном', async () => {
        UserModel.findOne.mockResolvedValue(makeUser());

        await userService.password({ userId: 'u-1', token: 't', password: 'newpassword1' });

        expect(UserModel.findOne).toHaveBeenCalledWith(
            expect.objectContaining({ _id: 'u-1', resetToken: 't', resetTokenExp: { $gt: expect.any(Number) } })
        );
    });

    it('на просроченный токен отвечает ошибкой', async () => {
        UserModel.findOne.mockResolvedValue(null);

        await expect(
            userService.password({ userId: 'u-1', token: 'старый', password: 'newpassword1' })
        ).rejects.toMatchObject({ status: 400, message: 'Время жизни токена истекло' });
    });
});

describe('passwordToken', () => {
    it('по живому токену отдаёт данные для формы', async () => {
        UserModel.findOne.mockResolvedValue(makeUser());

        expect(await userService.passwordToken('t')).toEqual({ userId: 'u-1', token: 't' });
    });

    it('без токена отвечает ошибкой', async () => {
        await expect(userService.passwordToken('')).rejects.toMatchObject({
            status: 400,
            message: 'Неверный токен доступа',
        });
    });

    it('на просроченный токен отвечает ошибкой', async () => {
        UserModel.findOne.mockResolvedValue(null);

        await expect(userService.passwordToken('старый')).rejects.toMatchObject({
            status: 400,
            message: 'Пользователь не найден',
        });
    });
});
