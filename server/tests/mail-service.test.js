const { mockModule } = require('./helpers/mock-module');

process.env.SMTP_HOST = 'smtp.example.com';
process.env.SMTP_PORT = '465';
process.env.SMTP_USER = 'robot@nikassdgym.ru';
process.env.SMTP_PASSWORD = 'smtp-secret';
process.env.CLIENT_URL = 'https://nikassdgym.ru';

const sendMail = vi.fn().mockResolvedValue({ messageId: 'id-1' });
const createTransport = vi.fn(() => ({ sendMail }));
mockModule('node_modules/nodemailer/lib/nodemailer.js', { createTransport });

const mailService = require('../service/mail-service');

// Транспорт создаётся один раз при загрузке модуля, а vitest чистит историю
// вызовов между тестами — поэтому запоминаем настройки сразу.
const transportOptions = createTransport.mock.calls[0][0];

const letter = () => sendMail.mock.calls[0][0];

beforeEach(() => {
    sendMail.mockClear().mockResolvedValue({ messageId: 'id-1' });
});

describe('настройка транспорта', () => {
    it('берёт адрес, порт и учётные данные из окружения', () => {
        expect(transportOptions).toMatchObject({
            host: 'smtp.example.com',
            port: '465',
            auth: { user: 'robot@nikassdgym.ru', pass: 'smtp-secret' },
        });
    });

    it('соединение шифруется', () => {
        expect(transportOptions.secure).toBe(true);
    });
});

describe('sendActivationMail', () => {
    it('шлёт письмо на указанный адрес от почты сервиса', async () => {
        await mailService.sendActivationMail('nika@example.com', 'https://nikassdgym.ru/api/activate/uuid');

        expect(letter().to).toBe('nika@example.com');
        expect(letter().from).toBe('robot@nikassdgym.ru');
    });

    it('в теме письма виден адрес сайта', async () => {
        await mailService.sendActivationMail('nika@example.com', 'https://nikassdgym.ru/api/activate/uuid');

        expect(letter().subject).toBe('Активация аккаунта на https://nikassdgym.ru');
    });

    it('в письме есть кликабельная ссылка активации', async () => {
        const link = 'https://nikassdgym.ru/api/activate/uuid';

        await mailService.sendActivationMail('nika@example.com', link);

        expect(letter().html).toContain(`href="${link}"`);
    });

    it('ошибку SMTP пробрасывает наверх', async () => {
        sendMail.mockRejectedValue(new Error('SMTP недоступен'));

        await expect(mailService.sendActivationMail('nika@example.com', 'ссылка')).rejects.toThrow(
            'SMTP недоступен'
        );
    });
});

describe('sendResetPassword', () => {
    it('шлёт письмо на указанный адрес', async () => {
        await mailService.sendResetPassword('nika@example.com', 'https://nikassdgym.ru/api/password/token');

        expect(letter().to).toBe('nika@example.com');
        expect(letter().subject).toBe('Сброс пароля для https://nikassdgym.ru');
    });

    it('в письме есть ссылка восстановления', async () => {
        const link = 'https://nikassdgym.ru/api/password/token';

        await mailService.sendResetPassword('nika@example.com', link);

        expect(letter().html).toContain(`href="${link}"`);
    });

    // Если человек не сбрасывал пароль, письмо должно об этом предупредить.
    it('письмо предупреждает о чужом запросе', async () => {
        await mailService.sendResetPassword('nika@example.com', 'ссылка');

        expect(letter().html).toContain('Если вы не сбрасывали пароль, ничего не делайте');
    });

    it('ошибку SMTP пробрасывает наверх', async () => {
        sendMail.mockRejectedValue(new Error('SMTP недоступен'));

        await expect(mailService.sendResetPassword('nika@example.com', 'ссылка')).rejects.toThrow(
            'SMTP недоступен'
        );
    });
});
