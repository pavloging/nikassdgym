import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomCheckbox from './CustomCheckbox';

describe('CustomCheckbox', () => {
    it('показывает переданное содержимое', () => {
        render(
            <CustomCheckbox isChecked={false} setIsChecked={vi.fn()}>
                Согласен с офертой
            </CustomCheckbox>
        );
        expect(screen.getByText('Согласен с офертой')).toBeInTheDocument();
    });

    it('отражает переданное состояние', () => {
        const { rerender } = render(
            <CustomCheckbox isChecked={false} setIsChecked={vi.fn()}>
                текст
            </CustomCheckbox>
        );
        expect(screen.getByRole('checkbox')).not.toBeChecked();

        rerender(
            <CustomCheckbox isChecked setIsChecked={vi.fn()}>
                текст
            </CustomCheckbox>
        );
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('по клику переключает значение на противоположное', async () => {
        const setIsChecked = vi.fn();
        render(
            <CustomCheckbox isChecked={false} setIsChecked={setIsChecked}>
                текст
            </CustomCheckbox>
        );

        await userEvent.click(screen.getByRole('checkbox'));

        expect(setIsChecked).toHaveBeenCalledWith(true);
    });

    it('снимает галочку, если она стояла', async () => {
        const setIsChecked = vi.fn();
        render(
            <CustomCheckbox isChecked setIsChecked={setIsChecked}>
                текст
            </CustomCheckbox>
        );

        await userEvent.click(screen.getByRole('checkbox'));

        expect(setIsChecked).toHaveBeenCalledWith(false);
    });

    it('клик по тексту тоже переключает — это label', async () => {
        const setIsChecked = vi.fn();
        render(
            <CustomCheckbox isChecked={false} setIsChecked={setIsChecked}>
                кликабельный текст
            </CustomCheckbox>
        );

        await userEvent.click(screen.getByText('кликабельный текст'));

        expect(setIsChecked).toHaveBeenCalledWith(true);
    });
});
