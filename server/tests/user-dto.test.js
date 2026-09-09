const UserDto = require('../dtos/user-dto');

const model = (over = {}) => ({
    _id: 'u-1',
    email: 'nika@example.com',
    isActivated: true,
    ...over,
});

describe('UserDto', () => {
    it('переносит только безопасные поля пользователя', () => {
        const dto = new UserDto(model({ password: 'хеш-пароля', activationLink: 'секрет' }));
        expect(dto.email).toBe('nika@example.com');
        expect(dto.id).toBe('u-1');
        expect(dto.isActivated).toBe(true);
    });

    // Пароль и служебные токены наружу уходить не должны.
    it('не тащит наружу пароль и служебные поля', () => {
        const dto = new UserDto(
            model({ password: 'хеш-пароля', activationLink: 'секрет', resetToken: 'токен' })
        );
        expect(Object.keys(dto)).toEqual([
            'email',
            'id',
            'isActivated',
            'isActivatedSubscription',
            'dateActivatedSubscription',
        ]);
    });

    it('подписка активна, пока не прошла дата окончания', () => {
        const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
        expect(new UserDto(model({ activateSubscriptionExp: future })).isActivatedSubscription).toBe(true);
    });

    it('подписка не активна после даты окончания', () => {
        const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
        expect(new UserDto(model({ activateSubscriptionExp: past })).isActivatedSubscription).toBe(false);
    });

    it('без даты подписки считается неактивной', () => {
        const dto = new UserDto(model());
        expect(dto.isActivatedSubscription).toBe(false);
        expect(dto.dateActivatedSubscription).toBeUndefined();
    });

    it('отдаёт дату окончания подписки как есть', () => {
        const exp = new Date('2027-01-01T00:00:00.000Z');
        expect(new UserDto(model({ activateSubscriptionExp: exp })).dateActivatedSubscription).toBe(exp);
    });
});
