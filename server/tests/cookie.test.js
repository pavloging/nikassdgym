const ORIGINAL = process.env.COOKIE_SECURE;

// Модуль читает process.env один раз при загрузке, поэтому его надо перезагружать.
function loadConfig(cookieSecure) {
    if (cookieSecure === undefined) delete process.env.COOKIE_SECURE;
    else process.env.COOKIE_SECURE = cookieSecure;
    delete require.cache[require.resolve('../config/cookie')];
    return require('../config/cookie');
}

afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.COOKIE_SECURE;
    else process.env.COOKIE_SECURE = ORIGINAL;
});

describe('настройки refresh-куки', () => {
    it('живёт 30 дней', () => {
        const { refreshCookieOptions, REFRESH_TOKEN_MAX_AGE } = loadConfig();
        expect(REFRESH_TOKEN_MAX_AGE).toBe(30 * 24 * 60 * 60 * 1000);
        expect(refreshCookieOptions.maxAge).toBe(REFRESH_TOKEN_MAX_AGE);
    });

    // httpOnly закрывает куку от чужого JavaScript, sameSite — от отправки с чужих сайтов.
    it('недоступна из JavaScript и не уходит с чужих сайтов', () => {
        const { refreshCookieOptions } = loadConfig();
        expect(refreshCookieOptions.httpOnly).toBe(true);
        expect(refreshCookieOptions.sameSite).toBe('lax');
    });

    it('по умолчанию уходит только по https', () => {
        expect(loadConfig().refreshCookieOptions.secure).toBe(true);
    });

    it('COOKIE_SECURE=true оставляет https-режим', () => {
        expect(loadConfig('true').refreshCookieOptions.secure).toBe(true);
    });

    // Иначе локальная разработка по http не сможет войти.
    it('COOKIE_SECURE=false выключает требование https', () => {
        expect(loadConfig('false').refreshCookieOptions.secure).toBe(false);
    });
});
