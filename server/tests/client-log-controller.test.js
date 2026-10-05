const { clientLog, resetClientLogState } = require('../controllers/client-log-controller');

let log;

function makeRes() {
    const res = {};
    res.status = vi.fn(() => res);
    res.end = vi.fn(() => res);
    return res;
}

const request = (body, ip = '1.2.3.4') => ({ body, headers: { 'x-real-ip': ip } });
const lines = () => log.mock.calls.map((call) => call[0]);

beforeEach(() => {
    resetClientLogState();
    log = vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('clientLog', () => {
    it('пишет контекст один раз на сессию и строку на каждое событие', () => {
        const res = makeRes();
        const body = {
            ctx: { ua: 'iPhone Instagram', online: true },
            events: [
                { t: '2026-10-05T12:00:00.000Z', s: 'abc123', e: 'page', d: { path: '/registration' } },
                { t: '2026-10-05T12:00:05.000Z', s: 'abc123', e: 'error api', d: { status: null } },
            ],
        };

        clientLog(request(body), res);
        clientLog(request(body), makeRes());

        expect(res.status).toHaveBeenCalledWith(204);
        expect(lines().filter((line) => line.includes(' ctx '))).toHaveLength(1);
        expect(lines()[0]).toBe('client abc123 1.2.3.4 ctx {"ua":"iPhone Instagram","online":true}');
        expect(lines()[1]).toBe('client abc123 2026-10-05T12:00:00.000Z page {"path":"/registration"}');
    });

    it('незамаскированную почту маскирует, переводы строк убирает', () => {
        const body = { events: [{ s: 's1', t: 't', e: 'click\nregistration', d: { email: 'sinica@mail.ru' } }] };

        clientLog(request(body), makeRes());

        expect(lines()[0]).toBe('client s1 t click registration {"email":"si***@mail.ru"}');
    });

    it('мусор без списка событий отклоняет', () => {
        const res = makeRes();

        clientLog(request({ events: 'x' }), res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(log).not.toHaveBeenCalled();
    });

    it('больше 50 событий за раз не пишет', () => {
        const events = Array.from({ length: 80 }, (_, i) => ({ s: 's', t: 't', e: `e${i}` }));

        clientLog(request({ events }), makeRes());

        expect(log).toHaveBeenCalledTimes(50);
    });

    // Ручка открытая: без лимита ей можно забить диск.
    it('с одного IP больше 60 запросов в минуту не принимает', () => {
        let res;
        for (let i = 0; i < 61; i += 1) {
            res = makeRes();
            clientLog(request({ events: [] }, '5.5.5.5'), res);
        }

        expect(res.status).toHaveBeenCalledWith(429);
        const other = makeRes();
        clientLog(request({ events: [] }, '6.6.6.6'), other);
        expect(other.status).toHaveBeenCalledWith(204);
    });
});
