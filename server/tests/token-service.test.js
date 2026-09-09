const jwt = require('jsonwebtoken');

const { mockModule } = require('./helpers/mock-module');

const tokenModel = mockModule('models/token-model', {
    findOne: vi.fn(),
    create: vi.fn(),
    deleteOne: vi.fn(),
});

const ACCESS = 'test-access-secret';
const REFRESH = 'test-refresh-secret';
const payload = { id: 'u-1', email: 'nika@example.com', isActivated: true };

process.env.JWT_ACCESS_SECRET = ACCESS;
process.env.JWT_REFRESH_SECRET = REFRESH;

const tokenService = require('../service/token-service');

describe('generateTokens', () => {
    it('выдаёт пару токенов', () => {
        const tokens = tokenService.generateTokens(payload);
        expect(typeof tokens.accessToken).toBe('string');
        expect(typeof tokens.refreshToken).toBe('string');
    });

    it('токены подписаны разными ключами', () => {
        const { accessToken, refreshToken } = tokenService.generateTokens(payload);
        expect(() => jwt.verify(accessToken, REFRESH)).toThrow();
        expect(() => jwt.verify(refreshToken, ACCESS)).toThrow();
    });

    it('в токен кладётся переданная нагрузка', () => {
        const { accessToken } = tokenService.generateTokens(payload);
        expect(jwt.verify(accessToken, ACCESS)).toMatchObject(payload);
    });

    // Короткий access и длинный refresh — на этом держится схема обновления сессии.
    it('access живёт 4 часа, refresh — 180 дней', () => {
        const { accessToken, refreshToken } = tokenService.generateTokens(payload);
        const access = jwt.verify(accessToken, ACCESS);
        const refresh = jwt.verify(refreshToken, REFRESH);
        expect(access.exp - access.iat).toBe(4 * 60 * 60);
        expect(refresh.exp - refresh.iat).toBe(180 * 24 * 60 * 60);
    });
});

describe('validateAccessToken', () => {
    it('возвращает нагрузку валидного токена', () => {
        const token = jwt.sign(payload, ACCESS);
        expect(tokenService.validateAccessToken(token)).toMatchObject(payload);
    });

    it('на чужую подпись отвечает null, а не бросает', () => {
        expect(tokenService.validateAccessToken(jwt.sign(payload, 'чужой'))).toBeNull();
    });

    it('на просроченный токен отвечает null', () => {
        expect(tokenService.validateAccessToken(jwt.sign(payload, ACCESS, { expiresIn: -10 }))).toBeNull();
    });

    it('на мусор отвечает null', () => {
        expect(tokenService.validateAccessToken('не-токен')).toBeNull();
        expect(tokenService.validateAccessToken(undefined)).toBeNull();
    });
});

describe('validateRefreshToken', () => {
    it('возвращает нагрузку валидного токена', () => {
        expect(tokenService.validateRefreshToken(jwt.sign(payload, REFRESH))).toMatchObject(payload);
    });

    it('не принимает access-токен вместо refresh', () => {
        expect(tokenService.validateRefreshToken(jwt.sign(payload, ACCESS))).toBeNull();
    });

    it('на мусор отвечает null', () => {
        expect(tokenService.validateRefreshToken('не-токен')).toBeNull();
    });
});

describe('хранение токена в базе', () => {
    beforeEach(() => {
        tokenModel.findOne.mockReset();
        tokenModel.create.mockReset();
        tokenModel.deleteOne.mockReset();
    });

    it('первому входу заводит запись', async () => {
        tokenModel.findOne.mockResolvedValue(null);
        tokenModel.create.mockResolvedValue({ user: 'u-1', refreshToken: 'r-1' });

        await tokenService.saveToken('u-1', 'r-1');

        expect(tokenModel.create).toHaveBeenCalledWith({ user: 'u-1', refreshToken: 'r-1' });
    });

    // Известное ограничение: на пользователя хранится один refresh-токен,
    // поэтому вход со второго устройства разлогинивает первое.
    it('повторному входу перезаписывает существующую запись', async () => {
        const save = vi.fn().mockResolvedValue({});
        tokenModel.findOne.mockResolvedValue({ refreshToken: 'старый', save });

        await tokenService.saveToken('u-1', 'новый');

        expect(tokenModel.create).not.toHaveBeenCalled();
        expect(save).toHaveBeenCalled();
    });

    it('findToken ищет по самому токену', async () => {
        tokenModel.findOne.mockResolvedValue({ refreshToken: 'r-1' });

        await tokenService.findToken('r-1');

        expect(tokenModel.findOne).toHaveBeenCalledWith({ refreshToken: 'r-1' });
    });

    it('removeToken удаляет запись по токену', async () => {
        tokenModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

        const result = await tokenService.removeToken('r-1');

        expect(tokenModel.deleteOne).toHaveBeenCalledWith({ refreshToken: 'r-1' });
        expect(result).toEqual({ deletedCount: 1 });
    });
});
