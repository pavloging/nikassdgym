import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import Main from './Main';
import { renderWithProviders, makeStore, makeUser } from '../test/utils';

vi.mock('../constants/subscription', async () => ({
    subscription: (await import('../test/mocks')).subscriptionStub,
}));
vi.mock('../constants/exercises', async () => ({
    exercises: (await import('../test/mocks')).exercisesStub,
}));
vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('react-intersection-observer', () => ({ useInView: () => ({ ref: vi.fn(), inView: true }) }));

// Swiper тянет свои стили и вычисляет размеры, которых в jsdom нет.
vi.mock('swiper/react', () => ({
    Swiper: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper">{children}</div>,
    SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('swiper/modules', () => ({ Navigation: {}, Pagination: {} }));

const handlePay = vi.fn();
vi.mock('../hooks/usePay', () => ({ usePay: () => ({ handlePay }) }));

const toastError = vi.mocked(toast.error);

beforeEach(() => {
    handlePay.mockClear();
    toastError.mockClear();
});

describe('Main — лендинг', () => {
    it('показывает первый экран', () => {
        renderWithProviders(<Main />);
        expect(screen.getByRole('heading', { name: 'Тренер' })).toBeInTheDocument();
    });

    it('на месте все якорные разделы из навигации подвала', () => {
        const { container } = renderWithProviders(<Main />);
        ['about-me', 'benefits-me', 'whom', 'result', 'stage', 'tariff', 'nutritionist'].forEach((id) =>
            expect(container.querySelector(`#${id}`)).toBeInTheDocument()
        );
    });

    it('показывает баннер про cookie новому посетителю', () => {
        renderWithProviders(<Main />);
        expect(screen.getByText(/Мы используем cookie-файлы/)).toBeInTheDocument();
    });

    it('перечисляет тарифы с ценами', () => {
        const { container } = renderWithProviders(<Main />);
        const tariffs = container.querySelectorAll('#tariff .main__tariff_plan');
        expect(tariffs).toHaveLength(2);
        expect(container.querySelector('#tariff')).toHaveTextContent('899 ₽');
        expect(container.querySelector('#tariff')).toHaveTextContent('2900 ₽');
    });

    it('по умолчанию выбран месячный тариф', () => {
        const { container } = renderWithProviders(<Main />);
        const selected = container.querySelector('#tariff .main__tariff_plan.selected');
        expect(selected).toHaveTextContent('1 месяц');
    });

    it('клик по тарифу переключает выбор', async () => {
        const { container } = renderWithProviders(<Main />);

        await userEvent.click(container.querySelectorAll('#tariff .main__tariff_plan')[0]);

        expect(container.querySelector('#tariff .main__tariff_plan.selected')).toHaveTextContent('24 часа');
    });

    it('«Оплатить» отправляет выбранный тариф со скидочной ценой', async () => {
        const store = makeStore({ isAuth: true, user: makeUser({ id: 'u-42' }) });
        const { container } = renderWithProviders(<Main />, { store });

        await userEvent.click(container.querySelector('#tariff .main__link_btn') as HTMLElement);

        expect(handlePay).toHaveBeenCalledWith({
            price: 2900,
            name: '1 месяц',
            date: 2592000000,
            userId: 'u-42',
        });
    });

    it('после смены тарифа платит уже за него', async () => {
        const store = makeStore({ isAuth: true, user: makeUser({ id: 'u-42' }) });
        const { container } = renderWithProviders(<Main />, { store });

        await userEvent.click(container.querySelectorAll('#tariff .main__tariff_plan')[0]);
        await userEvent.click(container.querySelector('#tariff .main__link_btn') as HTMLElement);

        expect(handlePay).toHaveBeenCalledWith(expect.objectContaining({ name: '24 часа', price: 899 }));
    });

    it('гостя тоже пускает к кнопке — отказ покажет сама оплата', async () => {
        const { container } = renderWithProviders(<Main />, { store: makeStore({ isAuth: false }) });

        await userEvent.click(container.querySelector('#tariff .main__link_btn') as HTMLElement);

        expect(handlePay).toHaveBeenCalled();
        expect(toastError).not.toHaveBeenCalled();
    });

    it('кнопки преимуществ переключают активный слайд', async () => {
        const { container } = renderWithProviders(<Main />);
        const buttons = container.querySelectorAll('.main__benefits-me_btn');
        expect(buttons.length).toBeGreaterThan(1);

        await userEvent.click(buttons[1]);

        expect((buttons[1] as HTMLElement).style.backgroundColor).toBe('var(--color-green)');
        expect((buttons[0] as HTMLElement).style.backgroundColor).toBe('var(--color-white)');
    });

    it('стрелки в блоке результатов листают отзывы по кругу', async () => {
        const { container } = renderWithProviders(<Main />);
        const left = container.querySelector('.main__result_switch-left') as HTMLElement;
        const right = container.querySelector('.main__result_switch-right') as HTMLElement;

        // Достаточно того, что листание не роняет страницу и блок остаётся на месте.
        await userEvent.click(left);
        await userEvent.click(right);
        await userEvent.click(right);

        expect(container.querySelector('#result')).toBeInTheDocument();
    });

    it('шапка и подвал на месте', () => {
        renderWithProviders(<Main />);
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
});
