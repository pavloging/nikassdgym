import { IRates } from "../types/IRates";

export const rates: Array<IRates> = [
    {
        name: '24 часа',
        description: 'Разовый доступ на 24 часа',
        price: 499
    },
    {
        name: '1 месяц',
        description: 'Доступ на 1 месяц',
        price: 5999
    },
    {
        name: '3 месяца',
        description: 'Доступ на 3 месяца',
        price: 18000,
        salePrice: 16499
    }
];
