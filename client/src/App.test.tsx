import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import App from './App';
import { renderWithProviders, makeStore } from './test/utils';
import { storage, TOKEN_KEY } from './utils/storage';

// Настоящие страницы тянут за собой все видео и картинки — для проверки
// выбора набора маршрутов достаточно заглушек.
vi.mock('./routes', () => ({
    defaultRoutes: [{ path: '*', element: <p>маршруты гостя</p> }],
    authRoutes: [{ path: '*', element: <p>маршруты авторизованного</p> }],
}));

const dispatched: string[] = [];
vi.mock('./redux/redusers/user/ActionAuth', async () => {
    const { createAsyncThunk } = await import('@reduxjs/toolkit');
    return {
        fetchAuth: createAsyncThunk('user/fetchAuth', async () => {
            dispatched.push('fetchAuth');
            return Promise.reject(new Error('не важно'));
        }),
    };
});

beforeEach(() => {
    dispatched.length = 0;
    storage.remove(TOKEN_KEY);
});

describe('App', () => {
    it('гостю отдаёт маршруты гостя', () => {
        renderWithProviders(<App />, { store: makeStore({ isAuth: false }) });
        expect(screen.getByText('маршруты гостя')).toBeInTheDocument();
    });

    it('авторизованному отдаёт маршруты авторизованного', () => {
        renderWithProviders(<App />, { store: makeStore({ isAuth: true }) });
        expect(screen.getByText('маршруты авторизованного')).toBeInTheDocument();
    });

    it('во время загрузки показывает индикатор вместо страницы', () => {
        const { container } = renderWithProviders(<App />, { store: makeStore({ isLoading: true }) });
        expect(container.querySelector('.loader')).toBeInTheDocument();
        expect(screen.queryByText('маршруты гостя')).not.toBeInTheDocument();
    });

    // Без токена дёргать сервер незачем — иначе каждый гость получает 401.
    it('без токена не пытается восстановить сессию', () => {
        renderWithProviders(<App />, { store: makeStore({ isAuth: false }) });
        expect(dispatched).toHaveLength(0);
    });

    it('с токеном восстанавливает сессию один раз', () => {
        storage.set(TOKEN_KEY, 'access-token');
        renderWithProviders(<App />, { store: makeStore({ isAuth: false }) });
        expect(dispatched).toEqual(['fetchAuth']);
    });

    // Раньше при недоступном localStorage тут всё падало и экран оставался пустым.
    it('не падает, когда хранилище недоступно', () => {
        const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            get() {
                throw new DOMException('The operation is insecure.', 'SecurityError');
            },
        });

        try {
            expect(() => renderWithProviders(<App />, { store: makeStore({ isAuth: false }) })).not.toThrow();
            expect(screen.getByText('маршруты гостя')).toBeInTheDocument();
        } finally {
            if (original) Object.defineProperty(window, 'localStorage', original);
        }
    });
});
