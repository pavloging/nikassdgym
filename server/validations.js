import { body } from 'express-validator';

export const authValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 8 символов').isLength({
        min: 8,
    }),
];
