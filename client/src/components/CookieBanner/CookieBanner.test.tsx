import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CookieBanner from './CookieBanner';
import { storage } from '../../utils/storage';

const KEY = 'setCookieBanner';

beforeEach(() => {
    storage.remove(KEY);
});

describe('CookieBanner', () => {
    it('показывается новому посетителю', () => {
        render(<CookieBanner />);
        expect(screen.getByText(/Мы используем cookie-файлы/)).toBeInTheDocument();
    });

    it('не показывается, если согласие уже дано', () => {
        storage.set(KEY, 'true');
        render(<CookieBanner />);
        expect(screen.queryByText(/Мы используем cookie-файлы/)).not.toBeInTheDocument();
    });

    it('после «Принять» запоминает согласие и прячется', async () => {
        render(<CookieBanner />);

        await userEvent.click(screen.getByRole('button', { name: 'Принять' }));

        expect(storage.get(KEY)).toBe('true');
        await waitFor(() => expect(screen.queryByText(/Мы используем cookie-файлы/)).not.toBeInTheDocument());
    });

    // Приватный режим Safari: запись в localStorage запрещена.
    it('не падает, когда хранилище недоступно', async () => {
        const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            get() {
                throw new DOMException('The operation is insecure.', 'SecurityError');
            },
        });

        try {
            expect(() => render(<CookieBanner />)).not.toThrow();
            await userEvent.click(screen.getByRole('button', { name: 'Принять' }));
            await waitFor(() =>
                expect(screen.queryByText(/Мы используем cookie-файлы/)).not.toBeInTheDocument()
            );
        } finally {
            if (original) Object.defineProperty(window, 'localStorage', original);
        }
    });

    it('в тексте есть ссылка на политику по смыслу', () => {
        render(<CookieBanner />);
        expect(screen.getByText(/политикой\s+конфиденциальности/)).toBeInTheDocument();
    });

    it('кнопка одна — соглашаться', () => {
        render(<CookieBanner />);
        expect(screen.getAllByRole('button')).toHaveLength(1);
    });
});
