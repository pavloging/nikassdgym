const userService = require('../service/user-service');
const paymentService = require('../service/payment-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const { refreshCookieOptions } = require('../config/cookie');

// Общая проверка для маршрутов с валидацией: возвращает ошибку, если данные не прошли.
function validationError(req) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return null;
    return ApiError.BadRequest('Ошибка при валидации', errors.array());
}

class UserController {
    async registration(req, res, next) {
        try {
            const invalid = validationError(req);
            if (invalid) return next(invalid);

            const { email, password } = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, refreshCookieOptions);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            // Без этой проверки подключённая к маршруту валидация ничего не делала
            // и мусорный запрос доходил до базы, отвечая непредвиденной ошибкой.
            const invalid = validationError(req);
            if (invalid) return next(invalid);

            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, refreshCookieOptions);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken', {
                httpOnly: refreshCookieOptions.httpOnly,
                sameSite: refreshCookieOptions.sameSite,
                secure: refreshCookieOptions.secure,
            });
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async reset(req, res, next) {
        try {
            const email = req.params.email;
            const user = await userService.reset(email);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async password(req, res, next) {
        try {
            const userId = req.body.userId;
            const token = req.body.token;
            const password = req.body.password;
            const userData = await userService.password({ userId, token, password });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async passwordToken(req, res, next) {
        try {
            const token = req.params.token;
            const user = await userService.passwordToken(token);
            return res.redirect(
                `${process.env.CLIENT_URL}/password?userId=${user.userId}&token=${user.token}`
            );
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, refreshCookieOptions);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async createLinkPay(req, res, next) {
        try {
            const { userId, date, price, name } = req.body;
            const createdData = await paymentService.createLinkPay({ price, name });
            await paymentService.savePayment({ userId, date, price, name, order: createdData.id})
            return res.json(createdData.confirmation.confirmation_url);
        } catch (e) {
            next(e);
        }
    }

    async webhook(req, res, next) {
        try {
            const data = req.body;
            await paymentService.webhook(data.object)

            res.status(200).json({ status: 'ok' });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
