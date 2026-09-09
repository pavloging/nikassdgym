import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-toastify';
import reducer from './User';
import { fetchAuth } from './ActionAuth';
import { fetchLogin } from './ActionLogin';
import { fetchLogout } from './ActionLogout';
import { fetchRegistration } from './ActionRegistration';
import { fetchCreateLinkPay } from './ActionCreateLinkPay';
import { AuthResponse } from '../../../types/response/AuthResponse';

vi.mock('react-toastify', () => ({
    toast: { error: vi.fn(), success: vi.fn() },
}));

const toastError = vi.mocked(toast.error);
const toastSuccess = vi.mocked(toast.success);

type State = ReturnType<typeof reducer>;

const initial: State = reducer(undefined, { type: '@@INIT' });

const authResponse: AuthResponse = {
    accessToken: 'access',
    refreshToken: 'refresh',
    user: {
        id: 'u-1',
        email: 'nika@example.com',
        isActivated: true,
        isActivatedSubscription: true,
        dateActivatedSubscription: new Date('2026-12-01T00:00:00.000Z'),
    },
};

// createAsyncThunk отклоняется через rejectWithValue, у такого экшена payload — строка.
const rejectedWith = (thunk: { rejected: { type: string } }, payload?: string) => ({
    type: thunk.rejected.type,
    payload,
    error: { message: 'Rejected' },
});

beforeEach(() => {
    toastError.mockClear();
    toastSuccess.mockClear();
});

describe('начальное состояние', () => {
    it('гость, ничего не грузится, ошибок нет', () => {
        expect(initial.isAuth).toBe(false);
        expect(initial.isLoading).toBe(false);
        expect(initial.error).toBe('');
        expect(initial.user.id).toBe('');
        expect(initial.user.email).toBe('');
    });
});

describe('fetchAuth — восстановление сессии при загрузке страницы', () => {
    it('pending включает загрузку', () => {
        expect(reducer(initial, { type: fetchAuth.pending.type }).isLoading).toBe(true);
    });

    it('fulfilled авторизует и кладёт пользователя', () => {
        const state = reducer(initial, { type: fetchAuth.fulfilled.type, payload: authResponse });
        expect(state).toMatchObject({ isAuth: true, isLoading: false, error: '' });
        expect(state.user.email).toBe('nika@example.com');
    });

    // Из-за этого случая на главной всплывали два уведомления сразу.
    it('rejected не показывает пользователю ничего', () => {
        reducer(initial, rejectedWith(fetchAuth, 'Пользователь не авторизован'));
        expect(toastError).not.toHaveBeenCalled();
        expect(toastSuccess).not.toHaveBeenCalled();
    });

    it('rejected сбрасывает в гостя и не оставляет ошибку в состоянии', () => {
        const loading = reducer(initial, { type: fetchAuth.pending.type });
        const state = reducer(loading, rejectedWith(fetchAuth, 'Пользователь не авторизован'));
        expect(state).toMatchObject({ isAuth: false, isLoading: false, error: '' });
        expect(state.user.id).toBe('');
    });

    it('rejected после успешного входа полностью вычищает пользователя', () => {
        const authed = reducer(initial, { type: fetchAuth.fulfilled.type, payload: authResponse });
        const state = reducer(authed, rejectedWith(fetchAuth));
        expect(state.user).toEqual(initial.user);
    });
});

describe.each([
    ['fetchLogin', fetchLogin],
    ['fetchRegistration', fetchRegistration],
])('%s', (_name, thunk) => {
    it('pending включает загрузку', () => {
        expect(reducer(initial, { type: thunk.pending.type }).isLoading).toBe(true);
    });

    it('fulfilled авторизует и поздравляет ровно одним уведомлением', () => {
        const state = reducer(initial, { type: thunk.fulfilled.type, payload: authResponse });
        expect(state).toMatchObject({ isAuth: true, isLoading: false, error: '' });
        expect(toastSuccess).toHaveBeenCalledTimes(1);
        expect(toastSuccess).toHaveBeenCalledWith('Вы вошли в систему!');
    });

    it('rejected показывает ровно одно уведомление с текстом от сервера', () => {
        const state = reducer(initial, rejectedWith(thunk, 'Неверный пароль'));
        expect(toastError).toHaveBeenCalledTimes(1);
        expect(toastError).toHaveBeenCalledWith('Неверный пароль');
        expect(state).toMatchObject({ isLoading: false, error: 'Неверный пароль', isAuth: false });
    });

    it('rejected без payload подставляет запасной текст, а не undefined', () => {
        const state = reducer(initial, rejectedWith(thunk));
        expect(toastError).toHaveBeenCalledWith('Произошла ошибка. Попробуйте позже');
        expect(state.error).toBe('Произошла ошибка. Попробуйте позже');
    });

    it('в уведомлении нет технической строки axios', () => {
        reducer(initial, rejectedWith(thunk, 'Неверный пароль'));
        expect(toastError.mock.calls.flat().join(' ')).not.toContain('Request failed with status code');
    });
});

describe('fetchLogout', () => {
    const authed = reducer(initial, { type: fetchAuth.fulfilled.type, payload: authResponse });

    it('fulfilled разлогинивает и сообщает об этом', () => {
        const state = reducer(authed, { type: fetchLogout.fulfilled.type });
        expect(state).toMatchObject({ isAuth: false, isLoading: false, error: '' });
        expect(state.user).toEqual(initial.user);
        expect(toastSuccess).toHaveBeenCalledWith('Вы вышли из системы');
    });

    // Сервер мог не ответить, но локально пользователь всё равно должен выйти.
    it('rejected всё равно разлогинивает', () => {
        const state = reducer(authed, rejectedWith(fetchLogout, 'Нет связи с сервером'));
        expect(state.isAuth).toBe(false);
        expect(state.user).toEqual(initial.user);
    });

    it('rejected не ругается уведомлением', () => {
        reducer(authed, rejectedWith(fetchLogout, 'Нет связи с сервером'));
        expect(toastError).not.toHaveBeenCalled();
    });
});

describe('fetchCreateLinkPay', () => {
    const authed = reducer(initial, { type: fetchAuth.fulfilled.type, payload: authResponse });

    it('pending включает загрузку', () => {
        expect(reducer(initial, { type: fetchCreateLinkPay.pending.type }).isLoading).toBe(true);
    });

    // Раньше сюда прилетала ссылка на оплату и записывалась в state.user.
    it('fulfilled не трогает пользователя', () => {
        const state = reducer(authed, {
            type: fetchCreateLinkPay.fulfilled.type,
            payload: 'https://yoomoney.ru/checkout/payments/v2/contract?orderId=1',
        });
        expect(state.user).toEqual(authed.user);
        expect(state).toMatchObject({ isLoading: false, error: '' });
    });

    // И показывался тост об активации тарифа ещё до самой оплаты.
    it('fulfilled не сообщает об активации тарифа', () => {
        reducer(authed, { type: fetchCreateLinkPay.fulfilled.type, payload: 'https://example.com' });
        expect(toastSuccess).not.toHaveBeenCalled();
    });

    it('rejected показывает одно уведомление', () => {
        const state = reducer(authed, rejectedWith(fetchCreateLinkPay, 'Произошла ошибка. Попробуйте позже'));
        expect(toastError).toHaveBeenCalledTimes(1);
        expect(state.isLoading).toBe(false);
    });
});

describe('неизвестный экшен', () => {
    it('состояние не меняется', () => {
        const authed = reducer(initial, { type: fetchAuth.fulfilled.type, payload: authResponse });
        expect(reducer(authed, { type: 'что-то/постороннее' })).toBe(authed);
    });
});
