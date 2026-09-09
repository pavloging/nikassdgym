import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import $api from '../http';
import LoginistrationForm from './LoginistrationForm';
import { renderWithProviders, makeStore } from '../test/utils';
import { storage, TOKEN_KEY } from '../utils/storage';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigate };
});
vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const authBody = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    user: {
        id: 'u-1',
        email: 'nika@example.com',
        isActivated: true,
        isActivatedSubscription: false,
        dateActivatedSubscription: new Date('2026-12-01T00:00:00.000Z'),
    },
};

let api: MockAdapter;

async function fill(email: string, password: string) {
    await userEvent.type(screen.getByPlaceholderText('Введите email'), email);
    await userEvent.type(screen.getByPlaceholderText('Введите пароль'), password);
}

async function acceptTerms() {
    for (const box of screen.getAllByRole('checkbox')) await userEvent.click(box);
}

beforeEach(() => {
    api = new MockAdapter($api);
    navigate.mockClear();
    storage.remove(TOKEN_KEY);
});

afterEach(() => api.restore());

describe('LoginistrationForm — общее поведение', () => {
    it('кнопка заблокирована, пока не приняты оферта и политика', async () => {
        renderWithProviders(<LoginistrationForm isLogin />);
        const submit = screen.getByRole('button', { name: 'Войти' });

        expect(submit).toBeDisabled();

        const [offerta, policy] = screen.getAllByRole('checkbox');
        await userEvent.click(offerta);
        expect(submit).toBeDisabled();

        await userEvent.click(policy);
        expect(submit).toBeEnabled();
    });

    it('пароль по умолчанию скрыт, кнопка-глаз его показывает', async () => {
        const { container } = renderWithProviders(<LoginistrationForm isLogin />);
        const input = screen.getByPlaceholderText('Введите пароль');

        expect(input).toHaveAttribute('type', 'password');

        await userEvent.click(container.querySelector('.login-form__password-block .img') as HTMLElement);

        expect(input).toHaveAttribute('type', 'text');
    });

    it('в режиме входа предлагает зарегистрироваться и восстановить пароль', () => {
        renderWithProviders(<LoginistrationForm isLogin />);
        expect(screen.getByRole('link', { name: 'Зарегистрироваться' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Забыли пароль?' })).toBeInTheDocument();
    });

    it('в режиме регистрации ссылки на восстановление нет', () => {
        renderWithProviders(<LoginistrationForm isLogin={false} />);
        expect(screen.getByRole('link', { name: 'Войти' })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Забыли пароль?' })).not.toBeInTheDocument();
    });
});

describe('LoginistrationForm — вход', () => {
    it('успешный вход уводит к упражнениям', async () => {
        api.onPost('/login').reply(200, authBody);
        renderWithProviders(<LoginistrationForm isLogin />, { store: makeStore({ isAuth: false }) });

        await fill('nika@example.com', 'password1');
        await acceptTerms();
        await userEvent.click(screen.getByRole('button', { name: 'Войти' }));

        expect(navigate).toHaveBeenCalledWith('/exercises');
    });

    // Раньше на этом месте бросалось исключение, которое никто не ловил.
    it('при неверном пароле остаётся на странице', async () => {
        api.onPost('/login').reply(400, { message: 'Неверный пароль', errors: [] });
        renderWithProviders(<LoginistrationForm isLogin />);

        await fill('nika@example.com', 'wrong-password');
        await acceptTerms();
        await userEvent.click(screen.getByRole('button', { name: 'Войти' }));

        expect(navigate).not.toHaveBeenCalled();
    });

    it('отправляет введённые почту и пароль', async () => {
        api.onPost('/login').reply(200, authBody);
        renderWithProviders(<LoginistrationForm isLogin />);

        await fill('nika@example.com', 'password1');
        await acceptTerms();
        await userEvent.click(screen.getByRole('button', { name: 'Войти' }));

        expect(JSON.parse(api.history.post[0].data)).toEqual({
            email: 'nika@example.com',
            password: 'password1',
        });
    });
});

describe('LoginistrationForm — регистрация', () => {
    it('успешная регистрация уводит к тарифам', async () => {
        api.onPost('/registration').reply(200, authBody);
        renderWithProviders(<LoginistrationForm isLogin={false} />);

        await fill('nika@example.com', 'password1');
        await acceptTerms();
        await userEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

        expect(navigate).toHaveBeenCalledWith('/subscription');
    });

    it('на занятую почту остаётся на странице', async () => {
        api.onPost('/registration').reply(400, {
            message: 'Пользователь с почтовым адресом nika@example.com уже существует',
            errors: [],
        });
        renderWithProviders(<LoginistrationForm isLogin={false} />);

        await fill('nika@example.com', 'password1');
        await acceptTerms();
        await userEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

        expect(navigate).not.toHaveBeenCalled();
    });
});
