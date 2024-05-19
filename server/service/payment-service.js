const UserModel = require('../models/user-model');
const uuid = require('uuid');
const axios = require('axios');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const paymentModel = require('../models/payment-model');
const userModel = require('../models/user-model');

class PaymentService {
    async createLinkPay({ price, name }) {
        const storeId = process.env.YOOKASSA_STORE_ID;
        const secretKey = process.env.YOOKASSA_SECRET_KEY;
        const idempotenceKey = uuid.v4();

        console.log(storeId, secretKey, idempotenceKey);

        const data = {
            amount: {
                value: `${price}.00`,
                currency: 'RUB',
            },
            confirmation: {
                type: 'redirect',
                return_url: 'https://nikassdgym.ru/exercises',
            },
            description: `Оплата тарифа: ${name}`,
        };
        console.log(data);

        const link = await axios.post('https://api.yookassa.ru/v3/payments', data, {
            headers: {
                'Content-Type': 'application/json',
                'Idempotence-Key': idempotenceKey,
            },
            auth: {
                username: storeId,
                password: secretKey,
            },
        });

        return link.data;
    }

    async savePayment({ userId, date, price, name, order }) {
        await paymentModel.create({ order, userId, name, price, date });
    }

    // async activateSubscription({ userId, date }) {
    //     const user = await UserModel.findOne({ _id: userId });
    //     if (!user) throw ApiError.BadRequest('User not found');

    //     if (!user.activateSubscriptionExp)
    //         user.activateSubscriptionExp = new Date(new Date().getTime() + date);
    //     else {
    //         const currentDate = new Date(user.activateSubscriptionExp);
    //         const newDate = new Date(currentDate.getTime() + date);
    //         user.activateSubscriptionExp = newDate;
    //     }

    //     await user.save();
    //     return new UserDto(user);
    // }

    async webhook(data) {
        const payment = await paymentModel.findOne({ order: data.id });
        if (!payment) throw Error('Заказ не найден по id');

        payment.status = data.status
        await payment.save();

        if (payment.status !== 'waiting_for_capture') return 'Статус заявки обновился'

        // Активация подписки
        const user = await userModel.findOne({ _id: payment.userId });
        if (!user) throw Error('Пользователь не найден по id');

        if (!user.activateSubscriptionExp) user.activateSubscriptionExp = new Date(new Date().getTime() + payment.date);
        else {
            const currentDate = new Date(user.activateSubscriptionExp);
            const newDate = new Date(currentDate.getTime() + payment.date);
            user.activateSubscriptionExp = newDate;
        }

        await user.save();
        return new UserDto(user);
    }
}

module.exports = new PaymentService();
