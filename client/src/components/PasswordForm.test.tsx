import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';
import $api from '../http';
import PasswordForm from './PasswordForm';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigate };
});
vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const toastError = vi.mocked(toast.error);
const toastSuccess = vi.mocked(toast.success);
let api: MockAdapter;

function setSearch(search: string) {
    window.history.replaceState({}, '', `/password${search}`);
}

const renderForm = () => render(<PasswordForm />, { wrapper: MemoryRouter });

async function fill(first: string, second: string) {
    const [a, b] = screen.getAllByPlaceholderText('Введите password');
    await userEvent.type(a, first);
    await userEvent.type(b, second);
}

beforeEach(() => {
    api = new MockAdapter($api);
    navigate.mockClear();
    setSearch('?userId=u-1&token=reset-token');
});
afterEach(() => api.restore());

describe('PasswordForm', () => {
    it('кнопка заблокирована, пока пароль пуст', () => {
        renderForm();
        expect(screen.getByRole('button', { name: 'Задать новый пароль' })).toBeDisabled();
    });

    it('кнопка заблокирована, пока пароли не совпадают', async () => {
        renderForm();
        await fill('password1', 'password2');
        expect(screen.getByRole('button', { name: 'Задать новый пароль' })).toBeDisabled();
    });

    it('кнопка заблокирована, пока пароль короче восьми символов', async () => {
        renderForm();
        await fill('short', 'short');
        expect(screen.getByRole('button', { name: 'Задать новый пароль' })).toBeDisabled();
    });

    it('кнопка открывается, когда пароли совпали и достаточно длинные', async () => {
        renderForm();
        await fill('password1', 'password1');
        expect(screen.getByRole('button', { name: 'Задать новый пароль' })).toBeEnabled();
    });

    it('отправляет пароль вместе с данными из ссылки', async () => {
        api.onPost('/password').reply(200, {});
        renderForm();

        await fill('password1', 'password1');
        await userEvent.click(screen.getByRole('button', { name: 'Задать новый пароль' }));

        expect(JSON.parse(api.history.post[0].data)).toEqual({
            userId: 'u-1',
            token: 'reset-token',
            password: 'password1',
        });
    });

    it('после успеха уводит на главную и сообщает об этом', async () => {
        api.onPost('/password').reply(200, {});
        renderForm();

        await fill('password1', 'password1');
        await userEvent.click(screen.getByRole('button', { name: 'Задать новый пароль' }));

        expect(navigate).toHaveBeenCalledWith('/');
        expect(toastSuccess).toHaveBeenCalledWith('Вы успешно изменили пароль');
    });

    it('на просроченный токен показывает текст сервера и никуда не уводит', async () => {
        api.onPost('/password').reply(400, { message: 'Время жизни токена истекло', errors: [] });
        renderForm();

        await fill('password1', 'password1');
        await userEvent.click(screen.getByRole('button', { name: 'Задать новый пароль' }));

        expect(toastError).toHaveBeenCalledWith('Время жизни токена истекло');
        expect(navigate).not.toHaveBeenCalled();
    });

    it('без параметров в ссылке ругается и не шлёт запрос', async () => {
        setSearch('');
        renderForm();

        await fill('password1', 'password1');
        await userEvent.click(screen.getByRole('button', { name: 'Задать новый пароль' }));

        expect(api.history.post).toHaveLength(0);
        expect(toastError).toHaveBeenCalledWith('Нет данных');
    });
});
