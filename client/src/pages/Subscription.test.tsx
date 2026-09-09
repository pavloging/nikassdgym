import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Subscription from './Subscription';
import { renderWithProviders, makeStore, makeUser } from '../test/utils';

vi.mock('../constants/subscription', async () => ({
    subscription: (await import('../test/mocks')).subscriptionStub,
}));
vi.mock('../components/ContentContainer', () => ({
    default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

const handlePay = vi.fn();
vi.mock('../hooks/usePay', () => ({ usePay: () => ({ handlePay }) }));

beforeEach(() => handlePay.mockClear());

describe('Subscription', () => {
    it('показывает все тарифы', () => {
        renderWithProviders(<Subscription />);
        expect(screen.getByRole('heading', { name: '24 часа' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: '1 месяц' })).toBeInTheDocument();
    });

    it('у тарифа со скидкой показывает обе цены', () => {
        renderWithProviders(<Subscription />);
        expect(screen.getByText('3900p')).toBeInTheDocument();
        expect(screen.getByText('2900p')).toBeInTheDocument();
    });

    it('у тарифа без скидки показывает одну цену', () => {
        renderWithProviders(<Subscription />);
        expect(screen.getByText('899p')).toBeInTheDocument();
    });

    it('у каждого тарифа есть кнопка оплаты', () => {
        renderWithProviders(<Subscription />);
        expect(screen.getAllByRole('button', { name: 'Оплатить' })).toHaveLength(2);
    });

    it('передаёт в оплату полную цену тарифа без скидки', async () => {
        const store = makeStore({ isAuth: true, user: makeUser({ id: 'u-42' }) });
        renderWithProviders(<Subscription />, { store });

        await userEvent.click(screen.getAllByRole('button', { name: 'Оплатить' })[0]);

        expect(handlePay).toHaveBeenCalledWith({
            price: 899,
            name: '24 часа',
            date: 86400000,
            userId: 'u-42',
        });
    });

    // Иначе со скидочного тарифа списалась бы полная цена.
    it('со скидкой передаёт в оплату цену со скидкой', async () => {
        const store = makeStore({ isAuth: true, user: makeUser({ id: 'u-42' }) });
        renderWithProviders(<Subscription />, { store });

        await userEvent.click(screen.getAllByRole('button', { name: 'Оплатить' })[1]);

        expect(handlePay).toHaveBeenCalledWith(expect.objectContaining({ price: 2900, name: '1 месяц' }));
    });
});
