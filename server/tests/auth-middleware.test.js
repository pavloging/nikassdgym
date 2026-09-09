const jwt = require('jsonwebtoken');
const ApiError = require('../exceptions/api-error');
const authMiddleware = require('../middlewares/auth-middleware');

const SECRET = 'test-access-secret';
const payload = { id: 'u-1', email: 'nika@example.com' };

beforeEach(() => {
    process.env.JWT_ACCESS_SECRET = SECRET;
});

const call = (headers) => {
    const req = { headers };
    const next = vi.fn();
    authMiddleware(req, {}, next);
    return { req, next };
};

const unauthorized = (next) => {
    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(401);
};

describe('authMiddleware', () => {
    it('с валидным токеном пропускает и кладёт пользователя в запрос', () => {
        const token = jwt.sign(payload, SECRET, { expiresIn: '4h' });

        const { req, next } = call({ authorization: `Bearer ${token}` });

        expect(next).toHaveBeenCalledWith();
        expect(req.user).toMatchObject(payload);
    });

    it('без заголовка Authorization не пускает', () => {
        unauthorized(call({}).next);
    });

    it('с пустым заголовком не пускает', () => {
        unauthorized(call({ authorization: '' }).next);
    });

    it('с одним словом «Bearer» без токена не пускает', () => {
        unauthorized(call({ authorization: 'Bearer' }).next);
    });

    it('с испорченным токеном не пускает', () => {
        unauthorized(call({ authorization: 'Bearer не-токен-вовсе' }).next);
    });

    it('с токеном, подписанным чужим ключом, не пускает', () => {
        const token = jwt.sign(payload, 'чужой-секрет');
        unauthorized(call({ authorization: `Bearer ${token}` }).next);
    });

    it('с просроченным токеном не пускает', () => {
        const token = jwt.sign(payload, SECRET, { expiresIn: -10 });
        unauthorized(call({ authorization: `Bearer ${token}` }).next);
    });

    // Строка "Bearer null" прилетала со старого фронта, когда токена не было.
    it('строку «Bearer null» не принимает за токен', () => {
        unauthorized(call({ authorization: 'Bearer null' }).next);
    });

    // Заголовок, присланный дважды, приходит массивом — .split по нему падает.
    it('на заголовок-массив отвечает 401, а не падает', () => {
        const next = vi.fn();
        expect(() => authMiddleware({ headers: { authorization: ['Bearer a', 'Bearer b'] } }, {}, next)).not.toThrow();
        unauthorized(next);
    });

    it('не падает, когда заголовков вообще нет', () => {
        const next = vi.fn();
        expect(() => authMiddleware({ headers: {} }, {}, next)).not.toThrow();
        unauthorized(next);
    });
});
