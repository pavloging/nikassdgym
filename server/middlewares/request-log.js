// Одна строка на каждый запрос к API: метод, путь, почта (замаскирована),
// статус и время ответа. По этой строке жалоба «не могу зарегистрироваться»
// сверяется с логом nginx: дошёл ли запрос до сервера и чем закончился.
// Запрос, который клиент или nginx бросили до ответа, помечается «оборван».

// Токены в пути не печатаем: по ним можно активировать аккаунт или сменить пароль.
const SECRET_PATHS = [/^(\/api\/activate\/)[^/?]+/, /^(\/api\/password\/)[^/?]+/, /^(\/api\/reset\/)[^/?]+/];

function maskEmail(email) {
    if (typeof email !== 'string' || !email.includes('@')) return '';
    const [name, domain] = email.trim().split('@');
    return `${name.slice(0, 2)}***@${domain}`;
}

function safePath(url) {
    return SECRET_PATHS.reduce((path, pattern) => path.replace(pattern, '$1***'), url);
}

// IP посетителя передаёт nginx в X-Real-IP. Без него виден только адрес docker-сети.
function clientIp(req) {
    return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || '-';
}

function requestLog(req, res, next) {
    const started = Date.now();
    let done = false;

    const write = (status) => {
        if (done) return;
        done = true;
        // Принятый журнал браузера сам пишет свои строки, лишняя строка тут только шум.
        if (status === 204 && req.originalUrl.startsWith('/api/client-log')) return;
        const email = maskEmail(req.body?.email);
        const who = email ? ` ${email}` : '';
        console.log(
            `${req.method} ${safePath(req.originalUrl)}${who} ${clientIp(req)} -> ${status} ${Date.now() - started}ms`
        );
    };

    res.on('finish', () => write(res.statusCode));
    res.on('close', () => write('оборван'));
    next();
}

module.exports = { requestLog, maskEmail, safePath, clientIp };
