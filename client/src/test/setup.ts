import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom не реализует IntersectionObserver, а на нём держится ленивая загрузка видео.
class IntersectionObserverStub {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = '';
    thresholds = [];
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);

// jsdom не реализует scrollTo — страницы дёргают его при монтировании.
vi.stubGlobal('scrollTo', vi.fn());

afterEach(() => {
    cleanup();
    localStorage.clear();
});
