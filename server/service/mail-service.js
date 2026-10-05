require('dotenv').config();
const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    // Время и исход отправки пишем в лог: зависший SMTP держит регистрацию,
    // и человек видит бесконечную загрузку.
    async send(kind, letter) {
        const started = Date.now();
        try {
            await this.transporter.sendMail(letter);
            console.log(`mail ${kind} -> ok ${Date.now() - started}ms`);
        } catch (e) {
            console.error(`mail ${kind} -> ошибка ${Date.now() - started}ms: ${e.message}`);
            throw e;
        }
    }

    async sendActivationMail(to, link) {
        await this.send('activation', {
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.CLIENT_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">Активировать профиль</a>
                    </div>
                `
        })
    }

    async sendResetPassword(to, link) {
        await this.send('reset', {
            from: process.env.SMTP_USER,
            to,
            subject: 'Сброс пароля для ' + process.env.CLIENT_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Для сброса пароля перейдите по ссылке. Если вы не сбрасывали пароль, ничего не делайте!</h1>
                        <a href="${link}">Восстановить доступ</a>
                    </div>
                `
        })
    }
}

module.exports = new MailService();
