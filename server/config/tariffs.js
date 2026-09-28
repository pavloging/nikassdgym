// Тарифы, по которым сервер выставляет счёт в ЮKassa: сумма к оплате и срок доступа.
// Витрина показывает те же тарифы из client/src/constants/subscription.ts —
// меняешь цену или срок, правь оба файла (тест tariffs.test.js сверяет их).
const DAY = 24 * 60 * 60 * 1000;

const tariffs = {
    '24 часа': { price: 899, date: DAY },
    '1 месяц': { price: 8999, date: 28 * DAY },
    '3 месяца': { price: 20999, date: 84 * DAY },
};

function findTariff(name) {
    if (typeof name !== 'string') return null;
    return Object.prototype.hasOwnProperty.call(tariffs, name) ? tariffs[name] : null;
}

module.exports = { tariffs, findTariff };
