const ApiError = require('../exceptions/api-error');

describe('ApiError', () => {
    it('остаётся обычной ошибкой — instanceof Error работает', () => {
        const error = new ApiError(418, 'чайник');
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ApiError);
    });

    it('хранит статус, сообщение и список ошибок', () => {
        const error = new ApiError(400, 'сообщение', [{ msg: 'поле' }]);
        expect(error.status).toBe(400);
        expect(error.message).toBe('сообщение');
        expect(error.errors).toEqual([{ msg: 'поле' }]);
    });

    it('по умолчанию список ошибок пустой, а не undefined', () => {
        expect(new ApiError(500, 'что-то').errors).toEqual([]);
    });

    it('UnauthorizedError — 401 с текстом для пользователя', () => {
        const error = ApiError.UnauthorizedError();
        expect(error.status).toBe(401);
        expect(error.message).toBe('Пользователь не авторизован');
        expect(error.errors).toEqual([]);
    });

    it('BadRequest — 400 с переданным текстом', () => {
        const error = ApiError.BadRequest('Неверный пароль');
        expect(error.status).toBe(400);
        expect(error.message).toBe('Неверный пароль');
    });

    it('BadRequest переносит ошибки валидации', () => {
        const errors = [{ msg: 'Неверный формат почты' }, { msg: 'Пароль короткий' }];
        expect(ApiError.BadRequest('Ошибка при валидации', errors).errors).toEqual(errors);
    });
});
