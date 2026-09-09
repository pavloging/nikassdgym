import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';
import $api from '../http';
import { usePay } from './usePay';
import { makeStore } from '../test/utils';
import { IPay } from '../types/ISubscription';

vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const toastError = vi.mocked(toast.error);
const toastSuccess = vi.mocked(toast.success);

const pay: IPay = { price: 899, name: '24 часа', date: 86400000, userId: 'u-1' };
const paymentUrl = 'https://yoomoney.ru/checkout/payments/v2/contract?orderId=1';

let api: MockAdapter;
let assignedHref: string | null;

function setup(isAuth: boolean) {
    const store = makeStore({ isAuth });
    const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
    return { store, ...renderHook(() => usePay(), { wrapper }) };
}

beforeEach(() => {
    api = new MockAdapter($api);
    assignedHref = null;
    // jsdom не умеет переходить по адресу — перехватываем присваивание.
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
            ...window.location,
            get href() {
                return 'http://localhost/';
            },
            set href(value: string) {
                assignedHref = value;
            },
        },
    });
});

afterEach(() => {
    api.restore();
});

describe('usePay', () => {
    it('гостя не пускает к оплате и объясняет почему', async () => {
        const { result } = setup(false);

        await act(() => result.current.handlePay(pay));

        expect(toastError).toHaveBeenCalledWith('Авторизуйтесь, чтобы оплатить тариф');
        expect(api.history.post).toHaveLength(0);
        expect(assignedHref).toBeNull();
    });

    it('авторизованного уводит на страницу оплаты', async () => {
        api.onPost('/createLinkPay').reply(200, paymentUrl);
        const { result } = setup(true);

        await act(() => result.current.handlePay(pay));

        expect(assignedHref).toBe(paymentUrl);
    });

    it('шлёт на сервер выбранный тариф', async () => {
        api.onPost('/createLinkPay').reply(200, paymentUrl);
        const { result } = setup(true);

        await act(() => result.current.handlePay(pay));

        expect(JSON.parse(api.history.post[0].data)).toEqual(pay);
    });

    // Ошибку показывает редьюсер — второй раз её показывать не надо.
    it('на ошибке сервера никуда не уводит и не дублирует уведомление', async () => {
        api.onPost('/createLinkPay').reply(500, { message: 'Непредвиденная ошибка', errors: [] });
        const { result } = setup(true);

        await act(() => result.current.handlePay(pay));

        expect(assignedHref).toBeNull();
        expect(toastError).toHaveBeenCalledTimes(1);
        expect(toastError).toHaveBeenCalledWith('Непредвиденная ошибка');
    });

    it('если сервер вернул пустую ссылку — сообщает и остаётся на месте', async () => {
        api.onPost('/createLinkPay').reply(200, '');
        const { result } = setup(true);

        await act(() => result.current.handlePay(pay));

        expect(assignedHref).toBeNull();
        expect(toastError).toHaveBeenCalledWith('Не удалось получить ссылку на оплату. Попробуйте позже');
    });

    // Раньше здесь был setTimeout и «оплата началась» показывалась до ответа сервера.
    it('не обещает оплату заранее', async () => {
        api.onPost('/createLinkPay').reply(200, paymentUrl);
        const { result } = setup(true);

        await act(() => result.current.handlePay(pay));

        expect(toastSuccess).not.toHaveBeenCalled();
    });

    it('редирект происходит без задержки на таймере', async () => {
        vi.useFakeTimers();
        try {
            api.onPost('/createLinkPay').reply(200, paymentUrl);
            const { result } = setup(true);

            await act(() => result.current.handlePay(pay));

            expect(assignedHref).toBe(paymentUrl);
        } finally {
            vi.useRealTimers();
        }
    });
});
