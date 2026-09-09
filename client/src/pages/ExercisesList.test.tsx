import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import ExercisesList from './ExercisesList';
import { renderWithProviders } from '../test/utils';

vi.mock('../constants/exercises', async () => ({
    exercises: (await import('../test/mocks')).exercisesStub,
}));
vi.mock('../components/ContentContainer', () => ({
    default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

describe('ExercisesList', () => {
    it('показывает заголовок раздела', () => {
        renderWithProviders(<ExercisesList />);
        expect(screen.getByRole('heading', { name: 'Упражнения' })).toBeInTheDocument();
    });

    it('показывает все группы упражнений', () => {
        renderWithProviders(<ExercisesList />);
        expect(screen.getByText('Спина')).toBeInTheDocument();
        expect(screen.getByText('Ноги')).toBeInTheDocument();
    });

    it('каждая группа ведёт на свою страницу', () => {
        renderWithProviders(<ExercisesList />);
        expect(screen.getByRole('link', { name: /Спина/ })).toHaveAttribute('href', '/exercises/back');
        expect(screen.getByRole('link', { name: /Ноги/ })).toHaveAttribute('href', '/exercises/legs');
    });

    it('у группы есть превью-картинка', () => {
        const { container } = renderWithProviders(<ExercisesList />);
        expect(container.querySelectorAll('.exercises-list__img')).toHaveLength(2);
    });

    it('при открытии прокручивает страницу вверх', () => {
        renderWithProviders(<ExercisesList />);
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
});
