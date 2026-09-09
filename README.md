# nikassdgym

Сайт онлайн-тренинга Ники Дупиной: лендинг, личный кабинет, видео-упражнения
и оплата подписки через ЮKassa.

Прод: https://nikassdgym.ru

## Состав

- `client/` — SPA на React 18 + TypeScript, сборка Vite.
- `server/` — REST API на Express + MongoDB (Mongoose), JWT-авторизация
  с подтверждением почты и сбросом пароля.
- `docker-compose.yml` — оба сервиса; наружу их проксирует nginx хоста
  (`/` → клиент :3000, `/api` → сервер :5000).

## Локальный запуск

```bash
# сервер
cd server && cp .env.example .env   # заполнить DB_URL, SMTP_*, JWT_*, YOOKASSA_*
npm install && npm run dev

# клиент
cd client && npm install && npm run dev
```

Переменные окружения сервера:

| Переменная | Зачем |
| --- | --- |
| `PORT` | порт API, по умолчанию 5000 |
| `DB_URL` | строка подключения к MongoDB |
| `CLIENT_URL` | адрес фронта, используется в CORS и в письмах |
| `API_URL` | публичный адрес API, используется в ссылках из писем |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | подпись токенов |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | отправка писем |
| `YOOKASSA_STORE_ID`, `YOOKASSA_SECRET_KEY` | приём платежей |
| `COOKIE_SECURE` | `false` только для локальной разработки по http |

Адрес API на клиенте не настраивается: он берётся от текущего домена
(`window.location.origin + '/api'`), поэтому при смене домена править код не нужно.

## Деплой

На сервере проект лежит в `/root/nikassdgym`:

```bash
git -C /root/nikassdgym pull
docker compose -f /root/nikassdgym/docker-compose.yml up -d --build
```

Сборка клиента тянет за собой видео из `client/src/assets`, образ получается
около 4 ГБ — перед деплоем стоит проверить свободное место (`df -h /`)
и подчистить старое (`docker image prune -f`).
