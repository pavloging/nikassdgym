// Общие настройки refresh-куки. Раньше они дублировались в трёх местах контроллера.
// secure включаем на проде (сайт работает только по https), для локальной
// разработки по http его можно выключить через COOKIE_SECURE=false.
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 дней

const refreshCookieOptions = {
    maxAge: REFRESH_TOKEN_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE !== 'false',
};

module.exports = { refreshCookieOptions, REFRESH_TOKEN_MAX_AGE };
