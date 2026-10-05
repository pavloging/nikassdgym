const { clientIp } = require('../middlewares/request-log');

// Приём журнала из браузера (client/src/utils/clientLog.ts). Каждое событие —
// строка в логе с меткой client и id сессии, контекст браузера — один раз на сессию.
// Ручка открытая, поэтому всё режется: число событий, длина строк, частота с одного IP.

const MAX_EVENTS = 50;
const MAX_TEXT = 1500;
const LIMIT_PER_MINUTE = 60;

const hits = new Map();
const seenSessions = new Set();

// Почта, которую клиент почему-то не замаскировал, маскируется здесь.
const EMAIL = /([A-Za-z0-9._%+-]{1,2})[A-Za-z0-9._%+-]*@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

function clip(value, max = MAX_TEXT) {
    const text = typeof value === 'string' ? value : JSON.stringify(value) ?? '';
    const oneLine = text.replace(/[\r\n]+/g, ' ').replace(EMAIL, '$1***@$2');
    return oneLine.length > max ? `${oneLine.slice(0, max)}…` : oneLine;
}

function limited(ip, now = Date.now()) {
    const entry = hits.get(ip);
    if (!entry || entry.reset < now) {
        if (hits.size > 10000) hits.clear();
        hits.set(ip, { count: 1, reset: now + 60 * 1000 });
        return false;
    }
    entry.count += 1;
    return entry.count > LIMIT_PER_MINUTE;
}

function clientLog(req, res) {
    const ip = clientIp(req);
    if (limited(ip)) return res.status(429).end();

    const { ctx, events } = req.body ?? {};
    if (!Array.isArray(events)) return res.status(400).end();

    for (const event of events.slice(0, MAX_EVENTS)) {
        const session = clip(event?.s, 16);
        if (ctx && !seenSessions.has(session)) {
            if (seenSessions.size > 20000) seenSessions.clear();
            seenSessions.add(session);
            console.log(`client ${session} ${ip} ctx ${clip(ctx)}`);
        }
        const data = event?.d ? ` ${clip(event.d)}` : '';
        console.log(`client ${session} ${clip(event?.t, 30)} ${clip(event?.e, 40)}${data}`);
    }

    return res.status(204).end();
}

function resetClientLogState() {
    hits.clear();
    seenSessions.clear();
}

module.exports = { clientLog, resetClientLogState };
