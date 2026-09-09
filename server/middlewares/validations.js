const { body } = require('express-validator');

// Регистрация задаёт требования к новому паролю.
const registrationValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 8 символов').isLength({ min: 8 }),
];

// На входе длину пароля не проверяем: у части аккаунтов пароль задан раньше
// текущих правил, и такая проверка просто не пустила бы их в систему.
const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Введите пароль').notEmpty(),
];

module.exports = { registrationValidation, loginValidation };
