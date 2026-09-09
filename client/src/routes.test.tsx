import { describe, it, expect, vi } from 'vitest';

// Страницы тянут за собой все медиа проекта — для проверки таблицы маршрутов
// достаточно знать, что элемент есть, поэтому подменяем их заглушками.
const stub = (name: string) => ({ default: () => <p>{name}</p> });
vi.mock('./pages/Main', () => stub('Main'));
vi.mock('./pages/Reset', () => stub('Reset'));
vi.mock('./pages/NotFound', () => stub('NotFound'));
vi.mock('./pages/Password', () => stub('Password'));
vi.mock('./pages/Policy', () => stub('Policy'));
vi.mock('./pages/Login', () => stub('Login'));
vi.mock('./pages/Registration', () => stub('Registration'));
vi.mock('./pages/Subscription', () => stub('Subscription'));
vi.mock('./pages/ExercisesList', () => stub('ExercisesList'));
vi.mock('./pages/Exercise', () => stub('Exercise'));
vi.mock('./pages/Agreement', () => stub('Agreement'));
vi.mock('./pages/Offerta', () => stub('Offerta'));

const { defaultRoutes, authRoutes } = await import('./routes');

const paths = (routes: { path?: string }[]) => routes.map((r) => r.path);

const PUBLIC_PATHS = [
    'registration',
    'login',
    'reset',
    'password',
    'offerta',
    'policy',
    'agreement',
    'subscription',
    'exercises',
    'exercises/:name',
];

describe('маршруты', () => {
    it.each(PUBLIC_PATHS)('«%s» доступен гостю', (path) => {
        expect(paths(defaultRoutes)).toContain(path);
    });

    it.each(PUBLIC_PATHS)('«%s» доступен авторизованному', (path) => {
        expect(paths(authRoutes)).toContain(path);
    });

    it('у каждого маршрута есть элемент', () => {
        [...defaultRoutes, ...authRoutes].forEach((route) => expect(route.element).toBeDefined());
    });

    // Гость с любого неизвестного адреса попадает на лендинг, а не на 404.
    it('гостя с неизвестного адреса ведёт на главную', () => {
        expect(paths(defaultRoutes)).toContain('*');
        expect(paths(defaultRoutes)).not.toContain('/');
    });

    it('авторизованному отдаёт главную по корню и 404 на неизвестное', () => {
        expect(paths(authRoutes)).toContain('/');
        expect(paths(authRoutes)).toContain('*');
    });

    it('«*» стоит последним, иначе перехватит остальные адреса', () => {
        expect(defaultRoutes.at(-1)?.path).toBe('*');
        expect(authRoutes.at(-1)?.path).toBe('*');
    });

    it('дублей путей нет', () => {
        [defaultRoutes, authRoutes].forEach((routes) => {
            const list = paths(routes);
            expect(new Set(list).size).toBe(list.length);
        });
    });
});
