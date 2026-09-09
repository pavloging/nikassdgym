import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import Exercise from './Exercise';
import { renderWithProviders, makeStore, makeUser } from '../test/utils';

vi.mock('../constants/exercises', async () => ({
    exercises: (await import('../test/mocks')).exercisesStub,
}));
vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('../components/ContentContainer', () => ({
    default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock('react-intersection-observer', () => ({ useInView: () => ({ ref: vi.fn(), inView: true }) }));

const navigate = vi.fn();
let params: { name?: string } = { name: 'back' };
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigate, useParams: () => params };
});

const toastError = vi.mocked(toast.error);

const subscribed = () =>
    makeStore({ isAuth: true, user: makeUser({ isActivatedSubscription: true }) });

beforeEach(() => {
    params = { name: 'back' };
    navigate.mockClear();
    toastError.mockClear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
    vi.useRealTimers();
});

describe('Exercise', () => {
    it('показывает название группы и её упражнения', () => {
        renderWithProviders(<Exercise />, { store: subscribed() });
        expect(screen.getByRole('heading', { name: 'Спина' })).toBeInTheDocument();
        expect(screen.getByText('Тяга верхнего блока')).toBeInTheDocument();
        expect(screen.getByText('Гиперэкстензия')).toBeInTheDocument();
    });

    it('поиск отбирает упражнения по названию', async () => {
        renderWithProviders(<Exercise />, { store: subscribed() });

        await userEvent.type(screen.getByPlaceholderText('Поиск'), 'тяга');

        expect(screen.getByText('Тяга верхнего блока')).toBeInTheDocument();
        expect(screen.queryByText('Гиперэкстензия')).not.toBeInTheDocument();
    });

    it('поиск не зависит от регистра и пробелов по краям', async () => {
        renderWithProviders(<Exercise />, { store: subscribed() });

        await userEvent.type(screen.getByPlaceholderText('Поиск'), '  ГИПЕР  ');

        expect(screen.getByText('Гиперэкстензия')).toBeInTheDocument();
    });

    it('когда ничего не нашлось — говорит об этом', async () => {
        renderWithProviders(<Exercise />, { store: subscribed() });

        await userEvent.type(screen.getByPlaceholderText('Поиск'), 'жим лёжа на луне');

        expect(screen.getByText('Элементов не найдено')).toBeInTheDocument();
    });

    it('неизвестную группу упражнений уводит на 404', () => {
        params = { name: 'no-such-group' };
        renderWithProviders(<Exercise />, { store: subscribed() });
        expect(navigate).toHaveBeenCalledWith('/404');
    });

    it('с подпиской видео открыты', () => {
        const { container } = renderWithProviders(<Exercise />, { store: subscribed() });
        container.querySelectorAll('video').forEach((v) => expect(v).toHaveAttribute('controls'));
    });

    it('без подписки видео закрыты', () => {
        const { container } = renderWithProviders(<Exercise />, {
            store: makeStore({ isAuth: true, user: makeUser({ isActivatedSubscription: false }) }),
        });
        container.querySelectorAll('video').forEach((v) => expect(v).not.toHaveAttribute('controls'));
    });

    it('с подпиской ничем не докучает', async () => {
        renderWithProviders(<Exercise />, { store: subscribed() });

        await vi.advanceTimersByTimeAsync(3000);

        expect(toastError).not.toHaveBeenCalled();
    });

    it('авторизованному без подписки предлагает её активировать', async () => {
        renderWithProviders(<Exercise />, {
            store: makeStore({ isAuth: true, user: makeUser({ isActivatedSubscription: false }) }),
        });

        await vi.advanceTimersByTimeAsync(2500);

        await waitFor(() =>
            expect(toastError).toHaveBeenCalledWith(
                'У вас не активна подписка. Пожалуйста, активируйте её, чтобы упражнения отображались'
            )
        );
    });

    it('гостю предлагает сначала авторизоваться', async () => {
        renderWithProviders(<Exercise />, { store: makeStore({ isAuth: false }) });

        await vi.advanceTimersByTimeAsync(2500);

        await waitFor(() =>
            expect(toastError).toHaveBeenCalledWith(
                'Авторизуйтесь в системе и активируйте подписку, чтобы упражнения отображались'
            )
        );
    });

    // Раньше таймер не снимался и уведомление всплывало на уже покинутой странице.
    it('уведомление не всплывает, если со страницы ушли раньше', async () => {
        const { unmount } = renderWithProviders(<Exercise />, { store: makeStore({ isAuth: false }) });

        unmount();
        await vi.advanceTimersByTimeAsync(3000);

        expect(toastError).not.toHaveBeenCalled();
    });
});
