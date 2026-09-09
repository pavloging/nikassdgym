const ApiError = require('../exceptions/api-error');
const errorMiddleware = require('../middlewares/error-middleware');

function makeRes() {
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);
    return res;
}

const req = { method: 'POST', originalUrl: '/api/login' };

let warn;
let error;

beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    error = vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('errorMiddleware', () => {
    it('ожидаемую ошибку отдаёт с её статусом и текстом', () => {
        const res = makeRes();

        errorMiddleware(ApiError.BadRequest('Неверный пароль'), req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Неверный пароль', errors: [] });
    });

    it('передаёт ошибки валидации клиенту', () => {
        const res = makeRes();
        const errors = [{ msg: 'Неверный формат почты' }];

        errorMiddleware(ApiError.BadRequest('Ошибка при валидации', errors), req, res, vi.fn());

        expect(res.json).toHaveBeenCalledWith({ message: 'Ошибка при валидации', errors });
    });

    it('401 отдаётся как 401', () => {
        const res = makeRes();

        errorMiddleware(ApiError.UnauthorizedError(), req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(401);
    });

    // Раньше на каждый штатный 401 в лог падала простыня стека.
    it('на ожидаемую ошибку пишет одну строку без стека', () => {
        errorMiddleware(ApiError.UnauthorizedError(), req, makeRes(), vi.fn());

        expect(error).not.toHaveBeenCalled();
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toBe('POST /api/login -> 401: Пользователь не авторизован');
    });

    it('непредвиденную ошибку прячет за общим текстом', () => {
        const res = makeRes();

        errorMiddleware(new TypeError('Cannot read properties of undefined'), req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Непредвиденная ошибка', errors: [] });
    });

    it('внутренности непредвиденной ошибки клиенту не показываются', () => {
        const res = makeRes();

        errorMiddleware(new TypeError('секретная подробность'), req, res, vi.fn());

        expect(JSON.stringify(res.json.mock.calls)).not.toContain('секретная подробность');
    });

    it('непредвиденную ошибку пишет в лог целиком — её надо чинить', () => {
        errorMiddleware(new TypeError('поломка'), req, makeRes(), vi.fn());

        expect(error).toHaveBeenCalledTimes(1);
        expect(error.mock.calls[0][0]).toBe('POST /api/login -> 500');
    });
});
