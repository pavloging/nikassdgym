import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { renderWithProviders, makeStore, makeUser } from '../test/utils';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigate };
});

const dispatched: string[] = [];
vi.mock('../redux/redusers/user/ActionLogout', async () => {
    const { createAsyncThunk } = await import('@reduxjs/toolkit');
    return {
        fetchLogout: createAsyncThunk('user/fetchLogout', async () => {
            dispatched.push('fetchLogout');
        }),
    };
});

function setWidth(width: number) {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
}

beforeEach(() => {
    navigate.mockClear();
    dispatched.length = 0;
    setWidth(1440);
});

describe('Header', () => {
    it('на десктопе показывает пункты меню кнопками', () => {
        renderWithProviders(<Header />);
        expect(screen.getByRole('button', { name: 'Главная' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Упражнения' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Тарифы' })).toBeInTheDocument();
    });

    it('на телефоне вместо меню показывает бургер', () => {
        setWidth(390);
        const { container } = renderWithProviders(<Header />);
        expect(container.querySelector('.burger-checkbox')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Главная' })).not.toBeInTheDocument();
    });

    it('бургер раскрывает список разделов', async () => {
        setWidth(390);
        const { container } = renderWithProviders(<Header />);

        await userEvent.click(container.querySelector('.burger-checkbox') as HTMLElement);

        expect(container.querySelector('.burger__page')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Тарифы' })).toBeInTheDocument();
    });

    it('без подписки показывает кнопку «Подписка не активна»', () => {
        renderWithProviders(<Header />, { store: makeStore({ isAuth: true }) });
        expect(screen.getByRole('button', { name: 'Подписка не активна' })).toBeInTheDocument();
    });

    it('с подпиской показывает дату окончания в формате дд.мм', () => {
        const store = makeStore({
            isAuth: true,
            user: makeUser({
                isActivatedSubscription: true,
                dateActivatedSubscription: new Date('2026-03-07T10:00:00.000Z'),
            }),
        });
        renderWithProviders(<Header />, { store });
        expect(screen.getByRole('button', { name: /Подписка активна до\s+07\.03/ })).toBeInTheDocument();
    });

    it('гостя с кнопки подписки уводит на регистрацию', async () => {
        renderWithProviders(<Header />, { store: makeStore({ isAuth: false }) });

        await userEvent.click(screen.getByRole('button', { name: 'Подписка не активна' }));

        expect(navigate).toHaveBeenCalledWith('/registration');
    });

    it('авторизованного с кнопки подписки уводит на тарифы', async () => {
        renderWithProviders(<Header />, { store: makeStore({ isAuth: true }) });

        await userEvent.click(screen.getByRole('button', { name: 'Подписка не активна' }));

        expect(navigate).toHaveBeenCalledWith('/subscription');
    });

    it('кнопка выхода есть только у авторизованного', () => {
        const { container: guest } = renderWithProviders(<Header />, { store: makeStore({ isAuth: false }) });
        expect(guest.querySelector('.header__logout')).not.toBeInTheDocument();

        const { container: authed } = renderWithProviders(<Header />, { store: makeStore({ isAuth: true }) });
        expect(authed.querySelector('.header__logout')).toBeInTheDocument();
    });

    it('нажатие на выход отправляет запрос на выход', async () => {
        const { container } = renderWithProviders(<Header />, { store: makeStore({ isAuth: true }) });

        await userEvent.click(container.querySelector('.header__logout-block button') as HTMLElement);

        expect(dispatched).toEqual(['fetchLogout']);
    });

    it('в бургер-меню у авторизованного тоже есть выход', async () => {
        setWidth(390);
        const { container } = renderWithProviders(<Header />, { store: makeStore({ isAuth: true }) });

        await userEvent.click(container.querySelector('.burger-checkbox') as HTMLElement);
        const logoutInBurger = container.querySelector('.burger__page .header__logout-block button');
        expect(logoutInBurger).toBeInTheDocument();

        await userEvent.click(logoutInBurger as HTMLElement);
        expect(dispatched).toEqual(['fetchLogout']);
    });

    it('в бургер-меню у гостя выхода нет', async () => {
        setWidth(390);
        const { container } = renderWithProviders(<Header />, { store: makeStore({ isAuth: false }) });

        await userEvent.click(container.querySelector('.burger-checkbox') as HTMLElement);

        expect(container.querySelector('.burger__page .header__logout-block')).not.toBeInTheDocument();
    });

    it('при уходе со страницы снимает слушатель resize', () => {
        const remove = vi.spyOn(window, 'removeEventListener');
        const { unmount } = renderWithProviders(<Header />);

        unmount();

        expect(remove).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('на текущем разделе кнопка подсвечена иначе', () => {
        renderWithProviders(<Header />, { route: '/subscription' });
        expect(screen.getByRole('button', { name: 'Тарифы' }).className).toBe('header__btn');
        expect(screen.getByRole('button', { name: 'Главная' }).className).toContain('header__btn-fill');
    });
});
