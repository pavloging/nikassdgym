const { EventEmitter } = require('events');
const { requestLog, maskEmail, safePath } = require('../middlewares/request-log');

let log;

beforeEach(() => {
    log = vi.spyOn(console, 'log').mockImplementation(() => {});
});

function makeRes(statusCode = 200) {
    const res = new EventEmitter();
    res.statusCode = statusCode;
    return res;
}

describe('requestLog', () => {
    it('пишет метод, путь, статус и время ответа', () => {
        const res = makeRes(200);
        const next = vi.fn();

        requestLog({ method: 'GET', originalUrl: '/api/refresh' }, res, next);
        res.emit('finish');

        expect(next).toHaveBeenCalled();
        expect(log.mock.calls[0][0]).toMatch(/^GET \/api\/refresh - -> 200 \d+ms$/);
    });

    it('показывает, чья регистрация, но почту маскирует', () => {
        const res = makeRes(400);
        const req = { method: 'POST', originalUrl: '/api/registration', body: { email: 'nika@example.com' } };

        requestLog(req, res, vi.fn());
        res.emit('finish');

        expect(log.mock.calls[0][0]).toMatch(/^POST \/api\/registration ni\*\*\*@example\.com - -> 400 \d+ms$/);
        expect(log.mock.calls[0][0]).not.toContain('nika@');
    });

    // Так выглядит «крутится и выбрасывает»: nginx или браузер не дождались ответа.
    it('запрос, брошенный до ответа, помечает как оборванный', () => {
        const res = makeRes();

        requestLog({ method: 'POST', originalUrl: '/api/registration' }, res, vi.fn());
        res.emit('close');

        expect(log.mock.calls[0][0]).toMatch(/-> оборван \d+ms$/);
    });

    it('на один запрос одна строка, даже если после finish пришёл close', () => {
        const res = makeRes();

        requestLog({ method: 'GET', originalUrl: '/api/refresh' }, res, vi.fn());
        res.emit('finish');
        res.emit('close');

        expect(log).toHaveBeenCalledTimes(1);
    });
});

describe('IP посетителя', () => {
    it('берёт IP из X-Real-IP, который ставит nginx', () => {
        const res = makeRes(200);
        const req = { method: 'GET', originalUrl: '/api/refresh', headers: { 'x-real-ip': '91.122.143.252' } };

        requestLog(req, res, vi.fn());
        res.emit('finish');

        expect(log.mock.calls[0][0]).toMatch(/^GET \/api\/refresh 91\.122\.143\.252 -> 200 \d+ms$/);
    });

    it('принятый журнал браузера отдельной строкой не пишет', () => {
        const res = makeRes(204);

        requestLog({ method: 'POST', originalUrl: '/api/client-log' }, res, vi.fn());
        res.emit('finish');

        expect(log).not.toHaveBeenCalled();
    });
});

describe('safePath', () => {
    it('прячет токены активации и сброса пароля', () => {
        expect(safePath('/api/activate/1b9d6bcd')).toBe('/api/activate/***');
        expect(safePath('/api/password/abc123')).toBe('/api/password/***');
        expect(safePath('/api/reset/nika@example.com')).toBe('/api/reset/***');
    });

    it('обычные пути не трогает', () => {
        expect(safePath('/api/login')).toBe('/api/login');
    });
});

describe('maskEmail', () => {
    it('оставляет две буквы имени и домен', () => {
        expect(maskEmail(' nika@example.com ')).toBe('ni***@example.com');
    });

    it('не почту не печатает', () => {
        expect(maskEmail(undefined)).toBe('');
        expect(maskEmail('not-an-email')).toBe('');
    });
});
