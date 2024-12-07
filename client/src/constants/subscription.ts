import { ISubscription } from "../types/ISubscription";

export const subscription: Array<ISubscription> = [
    {
        name: '24 часа',
        description: 'Разовый доступ на 24 часа',
        date: 24 * 60 * 60 * 1000, // 24 часа
        price: 799
    },
    {
        name: '1 месяц',
        description: 'Доступ на 30 дней',
        date: 30 * 24 * 60 * 60 * 1000, // 30 дней
        price: 9600,
        salePrice: 6999
    },
    {
        name: '3 месяца',
        description: 'Доступ на 90 дней',
        date: 90 * 24 * 60 * 60 * 1000, // 90 дней
        price: 21000,
        salePrice: 18900
    }
];
