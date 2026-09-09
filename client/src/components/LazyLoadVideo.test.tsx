import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import LazyLoadVideo from './LazyLoadVideo';

vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

let inView = true;
vi.mock('react-intersection-observer', () => ({
    useInView: () => ({ ref: vi.fn(), inView }),
}));

const toastError = vi.mocked(toast.error);

const props = { src: '/video/squat.mp4', img: '/img/squat.png', type: 'video/mp4' };

beforeEach(() => {
    inView = true;
    toastError.mockClear();
});

describe('LazyLoadVideo', () => {
    it('пока блок вне экрана, видео не грузится', () => {
        inView = false;
        const { container } = render(<LazyLoadVideo {...props} isControls />);
        expect(container.querySelector('video')).not.toBeInTheDocument();
        expect(container.querySelector('.exercise__video')).toBeInTheDocument();
    });

    it('в зоне видимости показывает видео с постером', () => {
        const { container } = render(<LazyLoadVideo {...props} isControls />);
        const video = container.querySelector('video');
        expect(video).toBeInTheDocument();
        expect(video).toHaveAttribute('poster', props.img);
    });

    it('с подпиской отдаёт плеер и сам файл', () => {
        const { container } = render(<LazyLoadVideo {...props} isControls />);
        expect(container.querySelector('video')).toHaveAttribute('controls');
        expect(container.querySelector('source')).toHaveAttribute('src', props.src);
    });

    // Без подписки файл не должен уезжать в браузер вообще.
    it('без подписки не отдаёт ни плеер, ни адрес файла', () => {
        const { container } = render(<LazyLoadVideo {...props} isControls={false} />);
        expect(container.querySelector('video')).not.toHaveAttribute('controls');
        expect(container.querySelector('source')).toHaveAttribute('src', '');
    });

    it('клик по закрытому видео объясняет, что нужна подписка', async () => {
        const { container } = render(<LazyLoadVideo {...props} isControls={false} />);

        await userEvent.click(container.querySelector('video') as HTMLElement);

        expect(toastError).toHaveBeenCalledWith(
            'У вас не активна подписка. Пожалуйста, активируйте её, чтобы упражнения отображались'
        );
    });

    it('тип видео передаётся в source', () => {
        const { container } = render(<LazyLoadVideo {...props} isControls />);
        expect(container.querySelector('source')).toHaveAttribute('type', 'video/mp4');
    });
});
