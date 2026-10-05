import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

type ClientLog = typeof import('./clientLog');

const fetchMock = () => fetch as unknown as ReturnType<typeof vi.fn>;
const sentBodies = () => fetchMock().mock.calls.map((call) => JSON.parse(call[1].body));

// Очередь живёт в модуле: каждый тест берёт свежий экземпляр.
async function fresh(): Promise<ClientLog> {
    vi.resetModules();
    return import('./clientLog');
}

beforeEach(() => {
    fetchMock().mockReset().mockResolvedValue(new Response(null, { status: 204 }));
});

afterEach(() => {
    vi.useRealTimers();
});

describe('logEvent', () => {
    it('ошибку отправляет сразу, вместе с контекстом браузера', async () => {
        const log = await fresh();

        log.logEvent('error api', { req: 'POST /registration', status: null });
        await log.flushClientLog();

        const [body] = sentBodies();
        expect(fetchMock().mock.calls[0][0]).toBe('/api/client-log');
        expect(body.events[0]).toMatchObject({ e: 'error api', s: log.SESSION, d: { status: null } });
        expect(body.ctx).toHaveProperty('ua');
        expect(body.ctx).toHaveProperty('online');
    });

    it('обычные события копит и отправляет одной пачкой', async () => {
        vi.useFakeTimers();
        const log = await fresh();

        log.logEvent('page', { path: '/registration' });
        log.logEvent('click registration', { email: 'ni***@mail.ru' });
        expect(fetch).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(3000);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(sentBodies()[0].events.map((event: { e: string }) => event.e)).toEqual([
            'page',
            'click registration',
        ]);
    });

    // Так ловится случай «до сервера не дошло»: события доезжают при следующем визите.
    it('без сети хранит события и отправляет их при следующем открытии сайта', async () => {
        fetchMock().mockRejectedValue(new TypeError('Load failed'));
        const first = await fresh();
        first.logEvent('error api', { req: 'POST /registration', code: 'ERR_NETWORK' });
        await first.flushClientLog();

        fetchMock().mockReset().mockResolvedValue(new Response(null, { status: 204 }));
        const second = await fresh();
        await second.flushClientLog();

        expect(sentBodies()[0].events[0]).toMatchObject({ e: 'error api', s: first.SESSION });
        expect(localStorage.getItem('client-log')).toBeNull();
    });

    it('на 429 оставляет события до следующей попытки', async () => {
        fetchMock().mockResolvedValue(new Response(null, { status: 429 }));
        const log = await fresh();

        log.logEvent('error js', { msg: 'boom' });
        await log.flushClientLog();

        expect(JSON.parse(localStorage.getItem('client-log') ?? '[]')).toHaveLength(1);
    });

    it('длинные строки обрезает', async () => {
        const log = await fresh();

        log.logEvent('error js', { stack: 'x'.repeat(5000) });
        await log.flushClientLog();

        expect(sentBodies()[0].events[0].d.stack.length).toBeLessThanOrEqual(1001);
    });
});

describe('maskEmail и safePath', () => {
    it('почту маскирует', async () => {
        const log = await fresh();

        expect(log.maskEmail(' sinica@mail.ru ')).toBe('si***@mail.ru');
        expect(log.maskEmail('без собаки')).toBe('');
    });

    it('прячет почту и токены в адресе запроса', async () => {
        const log = await fresh();

        expect(log.safePath('/reset/nika@example.com')).toBe('/reset/***');
        expect(log.safePath('/password/abc')).toBe('/password/***');
        expect(log.safePath('/login')).toBe('/login');
    });
});
