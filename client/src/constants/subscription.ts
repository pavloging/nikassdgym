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
        description: 'Доступ на 4 недели',
        date: 28 * 24 * 60 * 60 * 1000, // 28 дней
        price: 9600,
        salePrice: 6999
    },
    {
        name: '3 месяца',
        description: 'Доступ на 12 недель',
        date: 84 * 24 * 60 * 60 * 1000, // 84 дней
        price: 21000,
        salePrice: 18900
    }
];
