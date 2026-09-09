const ApiError = require('../exceptions/api-error');

module.exports = function (err, req, res, next) {
    // Ожидаемые ошибки (401, ошибки валидации) — одна строка в логе.
    // Стек печатаем только для непредвиденных, иначе лог забивается мусором.
    if (err instanceof ApiError) {
        console.warn(`${req.method} ${req.originalUrl} -> ${err.status}: ${err.message}`);
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }

    console.error(`${req.method} ${req.originalUrl} -> 500`, err);
    return res.status(500).json({ message: 'Непредвиденная ошибка', errors: [] });
};
