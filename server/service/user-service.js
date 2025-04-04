const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('uuid');
const axios = require('axios');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModel.create({ email, password: hashPassword, activationLink });
        await mailService.sendActivationMail(
            email,
            `${process.env.API_URL}/activate/${activationLink}`
        );

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async reset(email) {
        const user = await UserModel.findOne({ email });
        if (!user) throw ApiError.BadRequest('Email не найден');

        crypto.randomBytes(32, async (err, buffer) => {
            if (err) throw ApiError.BadRequest('Что-то пошло не так. Повторите попытку позднее!');
            const token = buffer.toString('hex');
            // const user = await UserModel.findOne({email})
            user.resetToken = token;
            user.resetTokenExp = Date.now() + 60 * 60 * 1000;

            await user.save();

            await mailService.sendResetPassword(
                user.email,
                `${process.env.API_URL}/password/${user.resetToken}`
            );
        });
    }

    async password({ userId, token, password }) {
        const user = await UserModel.findOne({
            _id: userId,
            resetToken: token,
            resetTokenExp: { $gt: Date.now() },
        });

        if (!user) throw ApiError.BadRequest('Время жизни токена истекло');

        user.password = await bcrypt.hash(password, 3);
        user.resetToken = undefined;
        user.resetTokenExp = undefined;
        await user.save();

        return { userId: user._id, token };
    }

    async passwordToken(token) {
        if (!token) throw ApiError.BadRequest('Неверный токен доступа');

        const user = await UserModel.findOne({
            resetToken: token,
            resetTokenExp: { $gt: new Date(Date.now()) },
        });

        if (!user) throw ApiError.BadRequest('Пользователь не найден');

        return { userId: user._id, token };
    }
}

module.exports = new UserService();
