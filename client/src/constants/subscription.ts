import { ISubscription } from "../types/ISubscription";

export const subscription: Array<ISubscription> = [
    {
        name: '24 часа',
        description: 'Разовый доступ на 24 часа',
        date: 24 * 60 * 60 * 1000, // 24 часа
        price: 799
    },
    {
        name: '4 недели',
        description: 'Доступ на 28 дней',
        date: 28 * 24 * 60 * 60 * 1000, // 28 дней
        price: 9600,
        salePrice: 6999
    },
    {
        name: '12 недель',
        description: 'Доступ на 84 дня',
        date: 84 * 24 * 60 * 60 * 1000, // 84 дней
        price: 21000,
        salePrice: 18900
    }
];
