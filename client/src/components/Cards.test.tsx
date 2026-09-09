import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Cards from './Cards';
import { cardsStub } from '../test/mocks';

describe('Cards', () => {
    it('показывает все карточки', () => {
        render(<Cards data={cardsStub} />);
        cardsStub.forEach((card) => expect(screen.getByText(card.text)).toBeInTheDocument());
    });

    it('половинчатые карточки собраны в отдельный ряд', () => {
        const { container } = render(<Cards data={cardsStub} />);
        expect(container.querySelectorAll('.main__card-list .main__card')).toHaveLength(2);
    });

    it('широкая карточка стоит вне ряда половинок', () => {
        const { container } = render(<Cards data={cardsStub} />);
        expect(container.querySelectorAll('.main__block-card > .main__card')).toHaveLength(1);
    });

    it('применяет заданный цвет фона', () => {
        const { container } = render(<Cards data={cardsStub} />);
        const full = container.querySelector('.main__block-card > .main__card') as HTMLElement;
        expect(full.style.backgroundColor).toBe('rgb(221, 255, 99)');
    });

    it('без цвета фона не выставляет инлайновый стиль', () => {
        const { container } = render(<Cards data={[{ ...cardsStub[2], bgColor: undefined }]} />);
        const full = container.querySelector('.main__block-card > .main__card') as HTMLElement;
        expect(full.style.backgroundColor).toBe('');
    });

    it('на пустом списке ничего не рисует и не падает', () => {
        const { container } = render(<Cards data={[]} />);
        expect(container.querySelectorAll('.main__card')).toHaveLength(0);
    });
});
