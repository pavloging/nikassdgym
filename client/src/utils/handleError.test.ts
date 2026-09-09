import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { toast } from 'react-toastify';
import { getErrorMessage, handleError } from './handleError';

vi.mock('react-toastify', () => ({
    toast: { error: vi.fn(), success: vi.fn() },
}));

const toastError = vi.mocked(toast.error);

// Собирает AxiosError с нужным ответом сервера.
function axiosError(status: number, data: unknown): AxiosError {
    const headers = new AxiosHeaders();
    const config = { headers };
    const error = new AxiosError('Request failed with status code ' + status, 'ERR_BAD_REQUEST', config);
    error.response = { status, statusText: '', data, headers, config } as AxiosError['response'];
    return error;
}

function networkError(): AxiosError {
    return new AxiosError('Network Error', 'ERR_NETWORK', { headers: new AxiosHeaders() });
}

beforeEach(() => {
    toastError.mockClear();
});

describe('getErrorMessage', () => {
    it('берёт message из ответа сервера', () => {
        expect(getErrorMessage(axiosError(400, { message: 'Неверный пароль', errors: [] })))
            .toBe('Неверный пароль');
    });

    it('склеивает ошибки валидации и предпочитает их общему message', () => {
        const error = axiosError(400, {
            message: 'Ошибка при валидации',
            errors: [{ msg: 'Неверный формат почты' }, { msg: 'Пароль должен быть минимум 8 символов' }],
        });
        expect(getErrorMessage(error)).toBe('Неверный формат почты. Пароль должен быть минимум 8 символов');
    });

    it('не показывает техническую строку axios вместо текста сервера', () => {
        expect(getErrorMessage(axiosError(401, { message: 'Пользователь не авторизован', errors: [] })))
            .not.toContain('Request failed with status code');
    });

    it('различает отсутствие связи', () => {
        expect(getErrorMessage(networkError()))
            .toBe('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз');
    });

    // Раньше здесь был доступ к data.errors.length и обработчик ошибок падал сам.
    it('не падает, когда в теле ответа нет ни message, ни errors', () => {
        expect(() => getErrorMessage(axiosError(500, {}))).not.toThrow();
        expect(getErrorMessage(axiosError(500, {}))).toBe('Произошла ошибка. Попробуйте позже');
    });

    it('не падает, когда тело ответа вообще не объект', () => {
        expect(getErrorMessage(axiosError(502, '<html>502 Bad Gateway</html>')))
            .toBe('Произошла ошибка. Попробуйте позже');
    });

    it('не падает на пустом массиве errors', () => {
        expect(getErrorMessage(axiosError(400, { errors: [] }))).toBe('Произошла ошибка. Попробуйте позже');
    });

    it('берёт текст обычного Error', () => {
        expect(getErrorMessage(new Error('Сервер не вернул токен доступа')))
            .toBe('Сервер не вернул токен доступа');
    });

    it('даёт запасной текст для Error без сообщения', () => {
        expect(getErrorMessage(new Error(''))).toBe('Произошла неизвестная ошибка');
    });

    it.each([[null], [undefined], ['строка'], [42], [{ что: 'угодно' }]])(
        'даёт запасной текст для значения %o',
        (value) => {
            expect(getErrorMessage(value)).toBe('Произошла неизвестная ошибка');
        }
    );
});

describe('handleError', () => {
    it('показывает ошибки валидации по отдельности', () => {
        handleError(axiosError(400, {
            message: 'Ошибка при валидации',
            errors: [{ msg: 'Неверный формат почты' }, { msg: 'Пароль должен быть минимум 8 символов' }],
        }));
        expect(toastError).toHaveBeenCalledTimes(2);
        expect(toastError).toHaveBeenNthCalledWith(1, 'Неверный формат почты');
        expect(toastError).toHaveBeenNthCalledWith(2, 'Пароль должен быть минимум 8 символов');
    });

    it('на обычную ошибку показывает ровно одно уведомление', () => {
        handleError(axiosError(400, { message: 'Неверный пароль', errors: [] }));
        expect(toastError).toHaveBeenCalledTimes(1);
        expect(toastError).toHaveBeenCalledWith('Неверный пароль');
    });

    it('показывает уведомление и когда ошибка не от axios', () => {
        handleError(new Error('что-то сломалось'));
        expect(toastError).toHaveBeenCalledTimes(1);
        expect(toastError).toHaveBeenCalledWith('что-то сломалось');
    });

    it('не бросает на ответе без тела', () => {
        expect(() => handleError(networkError())).not.toThrow();
        expect(toastError).toHaveBeenCalledTimes(1);
        expect(toastError).toHaveBeenCalledWith(
            'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз'
        );
    });
});
