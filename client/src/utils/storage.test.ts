import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { storage, TOKEN_KEY } from './storage';

// Подменяет window.localStorage на время теста и возвращает функцию отката.
function stubStorage(impl: Partial<Storage> | (() => never)) {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
        configurable: true,
        ...(typeof impl === 'function' ? { get: impl } : { get: () => impl as Storage }),
    });
    return () => {
        if (original) Object.defineProperty(window, 'localStorage', original);
    };
}

describe('storage', () => {
    let restore: (() => void) | undefined;

    // storage держит запасную копию в памяти модуля, между тестами её надо чистить.
    beforeEach(() => {
        ['key', 'any', 'nothing-here', TOKEN_KEY].forEach((k) => storage.remove(k));
    });

    afterEach(() => {
        restore?.();
        restore = undefined;
    });

    describe('когда localStorage работает', () => {
        it('пишет и читает значение', () => {
            storage.set('key', 'value');
            expect(storage.get('key')).toBe('value');
            expect(window.localStorage.getItem('key')).toBe('value');
        });

        it('возвращает null для незнакомого ключа', () => {
            expect(storage.get('nothing-here')).toBeNull();
        });

        it('удаляет значение', () => {
            storage.set('key', 'value');
            storage.remove('key');
            expect(storage.get('key')).toBeNull();
            expect(window.localStorage.getItem('key')).toBeNull();
        });

        it('перезаписывает значение по тому же ключу', () => {
            storage.set('key', 'first');
            storage.set('key', 'second');
            expect(storage.get('key')).toBe('second');
        });
    });

    // Ради этих случаев обёртка и появилась: раньше исключение отсюда
    // прилетало в рендер и пользователь видел пустой экран.
    describe('когда обращение к localStorage выбрасывает исключение', () => {
        it('get не бросает и отдаёт null', () => {
            restore = stubStorage(() => {
                throw new DOMException('The operation is insecure.', 'SecurityError');
            });
            expect(() => storage.get('key')).not.toThrow();
            expect(storage.get('key')).toBeNull();
        });

        it('set не бросает', () => {
            restore = stubStorage(() => {
                throw new DOMException('The operation is insecure.', 'SecurityError');
            });
            expect(() => storage.set('key', 'value')).not.toThrow();
        });

        it('remove не бросает', () => {
            restore = stubStorage(() => {
                throw new DOMException('The operation is insecure.', 'SecurityError');
            });
            expect(() => storage.remove('key')).not.toThrow();
        });

        it('записанное значение читается из памяти', () => {
            restore = stubStorage(() => {
                throw new DOMException('The operation is insecure.', 'SecurityError');
            });
            storage.set('key', 'from-memory');
            expect(storage.get('key')).toBe('from-memory');
        });

        it('удалённое значение пропадает и из памяти', () => {
            restore = stubStorage(() => {
                throw new DOMException('The operation is insecure.', 'SecurityError');
            });
            storage.set('key', 'from-memory');
            storage.remove('key');
            expect(storage.get('key')).toBeNull();
        });
    });

    // Приватный режим Safari: читать можно, писать нельзя.
    describe('когда запись запрещена, а чтение работает', () => {
        it('set не бросает и значение остаётся доступным', () => {
            const setItem = vi.fn(() => {
                throw new DOMException('QuotaExceededError', 'QuotaExceededError');
            });
            restore = stubStorage({
                getItem: () => null,
                setItem,
                removeItem: vi.fn(),
            } as unknown as Storage);

            expect(() => storage.set('key', 'value')).not.toThrow();
            expect(setItem).toHaveBeenCalledWith('key', 'value');
            expect(storage.get('key')).toBe('value');
        });
    });

    it('TOKEN_KEY — тот же ключ, что читает остальной код', () => {
        expect(TOKEN_KEY).toBe('token');
    });
});
