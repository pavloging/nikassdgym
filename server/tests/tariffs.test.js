const fs = require('fs');
const path = require('path');
const { tariffs, findTariff } = require('../config/tariffs');

// Витрина тарифов живёт на клиенте (TypeScript). Читаем её как текст и
// выполняем, выкинув импорт и аннотацию типа: так тест ловит расхождение
// цены или срока между тем, что видит покупатель, и тем, что выставит сервер.
function loadClientTariffs() {
    const file = path.join(__dirname, '../../client/src/constants/subscription.ts');
    const source = fs
        .readFileSync(file, 'utf8')
        .replace(/^import .*$/m, '')
        .replace(/:\s*Array<ISubscription>/, '')
        .replace('export const subscription =', 'return');
    return new Function(source)();
}

describe('тарифы', () => {
    it('совпадают с витриной клиента: название, сумма к оплате, срок', () => {
        const client = loadClientTariffs();

        expect(client.map((t) => t.name).sort()).toEqual(Object.keys(tariffs).sort());
        for (const t of client) {
            expect(tariffs[t.name]).toEqual({ price: t.salePrice ?? t.price, date: t.date });
        }
    });

    it('находит тариф только по собственному названию', () => {
        expect(findTariff('1 месяц')).toEqual({ price: 8999, date: 28 * 86400000 });
        expect(findTariff('toString')).toBeNull();
        expect(findTariff(undefined)).toBeNull();
        expect(findTariff('')).toBeNull();
        expect(findTariff(['1 месяц'])).toBeNull();
    });
});
