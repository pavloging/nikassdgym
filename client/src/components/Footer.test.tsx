import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Footer from './Footer';
import { renderWithProviders } from '../test/utils';

describe('Footer', () => {
    it('показывает имя тренера', () => {
        renderWithProviders(<Footer />);
        expect(screen.getByText('Ника Дупина')).toBeInTheDocument();
    });

    it('ссылки на соцсети открываются в новой вкладке', () => {
        const { container } = renderWithProviders(<Footer />);
        const social = container.querySelectorAll('.footer__social-media a');
        expect(social.length).toBeGreaterThan(0);
        social.forEach((link) => expect(link).toHaveAttribute('target', '_blank'));
    });

    it('ведёт на телеграм и WhatsApp тренера', () => {
        const { container } = renderWithProviders(<Footer />);
        const hrefs = [...container.querySelectorAll('.footer__social-media a')].map((a) => a.getAttribute('href'));
        expect(hrefs.some((h) => h?.includes('t.me'))).toBe(true);
        expect(hrefs.some((h) => h?.includes('wa.me'))).toBe(true);
    });

    it('в навигации есть якоря на разделы главной', () => {
        const { container } = renderWithProviders(<Footer />);
        const anchors = [...container.querySelectorAll('.footer__navigation_option')].map((a) => a.getAttribute('href'));
        expect(anchors).toContain('#tariff');
        expect(anchors).toContain('#result');
    });
});
