import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';
import $api from '../http';
import ResetForm from './ResetForm';

vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const toastError = vi.mocked(toast.error);
const toastSuccess = vi.mocked(toast.success);
let api: MockAdapter;

beforeEach(() => {
    api = new MockAdapter($api);
});
afterEach(() => api.restore());

describe('ResetForm', () => {
    it('отправляет введённую почту на сервер', async () => {
        api.onGet('/reset/nika@example.com').reply(200, {});
        render(<ResetForm />);

        await userEvent.type(screen.getByPlaceholderText('Введите email'), 'nika@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Отправить письмо' }));

        expect(api.history.get[0].url).toBe('/reset/nika@example.com');
    });

    it('после успеха сообщает, что письмо ушло', async () => {
        api.onGet(/\/reset\//).reply(200, {});
        render(<ResetForm />);

        await userEvent.type(screen.getByPlaceholderText('Введите email'), 'nika@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Отправить письмо' }));

        expect(toastSuccess).toHaveBeenCalledWith('Сообщение было отправленно на вашу почту');
    });

    it('на неизвестную почту показывает текст сервера', async () => {
        api.onGet(/\/reset\//).reply(400, { message: 'Email не найден', errors: [] });
        render(<ResetForm />);

        await userEvent.type(screen.getByPlaceholderText('Введите email'), 'no@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Отправить письмо' }));

        expect(toastError).toHaveBeenCalledWith('Email не найден');
        expect(toastSuccess).not.toHaveBeenCalled();
    });

    it('без связи с сервером не обещает, что письмо отправлено', async () => {
        api.onGet(/\/reset\//).networkError();
        render(<ResetForm />);

        await userEvent.type(screen.getByPlaceholderText('Введите email'), 'nika@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Отправить письмо' }));

        expect(toastSuccess).not.toHaveBeenCalled();
        expect(toastError).toHaveBeenCalledWith('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз');
    });
});
