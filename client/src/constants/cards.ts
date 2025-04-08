import { IListCards } from "../types/ICard";

export const cards: IListCards = {
    whomWorkout: [
        {
            pathIcon: '/icons/anchor.svg',
            text: 'У кого нет возможности подстраиваться под тренера из-за графика работы.',
            size: 'half'
        },
        {
            pathIcon: '/icons/arrow-right-down.svg',
            text: 'Кто тренируется месяцами, но так и не видит результата.',
            size: 'half'
        },
        {
            pathIcon: '/icons/battery.svg',
            text: 'Кто не может позволить финансово платить персональному тренеру.',
            size: 'half'
        },
        {
            pathIcon: '/icons/close.svg',
            text: 'Кто не нашел своем в зале высококвалифицированного специалиста.',
            size: 'half'
        },
        {
            pathIcon: '/icons/fire.svg',
            text: 'Кто дисциплинирован и исполнителен.',
            size: 'full',
            bgColor: 'var(--color-green)'
        }
    ],
    diet: [
        {
            pathIcon: '/icons/01.svg',
            text: 'Составляется меню под конкретную цель (похудение, набор мышечной массы, рациональное питание под различные заболевания)',
            size: 'half'
        },
        {
            pathIcon: '/icons/02.svg',
            text: 'Учитываются непереносимости, аллергии, пищевые пристрастия.',
            size: 'half'
        },
        {
            pathIcon: '/icons/03.svg',
            text: 'Рацион формируется таким образом, чтобы не тратить пол дня у плиты. Например: что приготовлено на обед, доедается на ужин следующего дня.',
            size: 'half'
        },
        {
            pathIcon: '/icons/04.svg',
            text: 'По данному рационом сможет питаться вся семья.',
            size: 'half'
        },
        {
            pathIcon: '/icons/05.svg',
            text: 'Еженедельный контроль веса, обратная связь и ответы на вопросы.',
            size: 'full',
        },
    ],
    whomFood: [
        {
            pathIcon: '/icons/close-red.svg',
            text: 'Кто ненавидит считать калории.',
            size: 'half'
        },
        {
            pathIcon: '/icons/anchor-red.svg',
            text: 'Кто привык питаться дома и имеет возможность ежедневно готовить.',
            size: 'half'
        },
        {
            pathIcon: '/icons/file-red.svg',
            text: 'Кому важна структура.',
            size: 'half'
        },
        {
            pathIcon: '/icons/pen-red.svg',
            text: 'Кто не хочет ломать голову вопросами «что же приготовить» или «где добрать белок»',
            size: 'half'
        },
        {
            pathIcon: '/icons/fire-red.svg',
            text: 'Кто любит много кушать (порции будут большие, даже на похудении).',
            size: 'full'
        },
    ],
    calories: [
        {
            pathIcon: '/icons/01.svg',
            text: 'Проводится психологический тест на расстройство пищевого поведения, чтобы в дальнейшем понимать, как самостоятельно работать со срывами.',
            size: 'half'
        },
        {
            pathIcon: '/icons/02.svg',
            text: 'Рассчитываю индивидуальную граммовку по КБЖУ, обучаю пользоваться приложением для подсчета калорий.',
            size: 'half'
        },
        {
            pathIcon: '/icons/03.svg',
            text: 'Ежедневная обратная связь и анализ дневника питания, ответы на вопросы и поддержка в месенжере.',
            size: 'full'
        },
    ],
    whomCalories: [
        {
            pathIcon: '/icons/close-red.svg',
            text: 'Кто не может ежедневно готовить.',
            size: 'half'
        },
        {
            pathIcon: '/icons/anchor-red.svg',
            text: 'Кто часто питается вне дома (кафе/столовые/рестораны/командировки).',
            size: 'half'
        },
        {
            pathIcon: '/icons/file-red.svg',
            text: 'Кто имеет ряд ограничений по базовым продуктам (вегетарианцам/аллергикам).',
            size: 'half'
        },
        {
            pathIcon: '/icons/battery-red.svg',
            text: 'Кто не может отказаться от любимых «вредных» продуктов, алкоголя и тд.',
            size: 'half'
        },
        {
            pathIcon: '/icons/arrow-red.svg',
            text: 'Кому нужен гибкий рацион (смена активности, изменение целей).',
            size: 'half'
        },
        {
            pathIcon: '/icons/rocket-red.svg',
            text: 'Кто максимально замотивирован и готов нести ответственность за свои действия.',
            size: 'half'
        },
    ]
}