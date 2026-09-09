import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import NotFound from './NotFound';
import { renderWithProviders } from '../test/utils';

describe('NotFound', () => {
    it('сообщает, что страницы нет', () => {
        renderWithProviders(<NotFound />);
        expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument();
    });

    it('шапка на месте — с 404 можно уйти в другой раздел', () => {
        renderWithProviders(<NotFound />);
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('показывает картинку', () => {
        const { container } = renderWithProviders(<NotFound />);
        expect(container.querySelector('.not-found__img')).toBeInTheDocument();
    });
});
