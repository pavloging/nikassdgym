import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

const Boom = ({ crash }: { crash: boolean }) => {
    if (crash) throw new Error('рендер упал');
    return <p>содержимое страницы</p>;
};

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
    // React сам печатает пойманную ошибку — глушим, чтобы не засорять вывод тестов.
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    consoleError.mockRestore();
});

describe('ErrorBoundary', () => {
    it('в обычной ситуации просто рисует детей', () => {
        render(
            <ErrorBoundary>
                <Boom crash={false} />
            </ErrorBoundary>
        );
        expect(screen.getByText('содержимое страницы')).toBeInTheDocument();
    });

    // Ровно это и защищает от пустого экрана: раньше падение рендера
    // размонтировало всё дерево и человек видел пустую страницу.
    it('при падении рендера показывает экран с объяснением', () => {
        render(
            <ErrorBoundary>
                <Boom crash />
            </ErrorBoundary>
        );
        expect(screen.getByRole('heading', { name: 'Что-то пошло не так' })).toBeInTheDocument();
        expect(screen.getByText(/Обновите её/)).toBeInTheDocument();
    });

    it('на экране ошибки нет содержимого упавшей страницы', () => {
        render(
            <ErrorBoundary>
                <Boom crash />
            </ErrorBoundary>
        );
        expect(screen.queryByText('содержимое страницы')).not.toBeInTheDocument();
    });

    it('кнопка перезагружает страницу', async () => {
        const reload = vi.fn();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...window.location, reload },
        });

        render(
            <ErrorBoundary>
                <Boom crash />
            </ErrorBoundary>
        );
        await userEvent.click(screen.getByRole('button', { name: 'Обновить страницу' }));

        expect(reload).toHaveBeenCalledTimes(1);
    });

    it('пишет ошибку в консоль, чтобы её было видно в поддержке', () => {
        render(
            <ErrorBoundary>
                <Boom crash />
            </ErrorBoundary>
        );
        const logged = consoleError.mock.calls.flat().join(' ');
        expect(logged).toContain('Ошибка рендера');
    });

    it('экран ошибки раскрашен сам, без внешнего CSS', () => {
        const { container } = render(
            <ErrorBoundary>
                <Boom crash />
            </ErrorBoundary>
        );
        const wrapper = container.firstElementChild as HTMLElement;
        expect(wrapper.style.background).not.toBe('');
        expect(wrapper.style.color).not.toBe('');
    });
});
