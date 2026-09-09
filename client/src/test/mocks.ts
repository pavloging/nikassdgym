// Настоящие константы упражнений и тарифов импортируют десятки видео и картинок:
// в тестах это лишние мегабайты и медленный старт. Заглушки повторяют форму данных.
import { ICard } from '../types/ICard';
import { ISubscription } from '../types/ISubscription';

export const exercisesStub = [
    {
        name: 'Спина',
        url: 'back',
        src: '/img/back.png',
        list: [
            { name: 'Тяга верхнего блока', src: '/video/pull.mp4', img: '/img/pull.png' },
            { name: 'Гиперэкстензия', src: '/video/hyper.mp4', img: '/img/hyper.png' },
        ],
    },
    {
        name: 'Ноги',
        url: 'legs',
        src: '/img/legs.png',
        list: [{ name: 'Приседания', src: '/video/squat.mp4', img: '/img/squat.png' }],
    },
];

export const subscriptionStub: ISubscription[] = [
    { name: '24 часа', date: 86400000, description: 'Один день', price: 899 },
    { name: '1 месяц', date: 2592000000, description: 'Месяц занятий', price: 3900, salePrice: 2900 },
];

export const cardsStub: ICard[] = [
    { text: 'Половинка слева', pathIcon: '/icons/a.svg', size: 'half' },
    { text: 'Половинка справа', pathIcon: '/icons/b.svg', size: 'half' },
    { text: 'Во всю ширину', pathIcon: '/icons/c.svg', size: 'full', bgColor: '#ddff63' },
];
