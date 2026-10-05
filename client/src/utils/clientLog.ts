import { storage } from './storage';

// Журнал шагов посетителя: какие страницы открыл, что нажал, какие запросы ушли
// и чем закончились, какие ошибки упали в браузере. Пачками уходит на сервер
// (POST /api/client-log) и пишется в лог рядом со строками запросов.
// Не ушла пачка (нет сети, вкладку закрыли) — ждёт в хранилище и уходит
// при следующем открытии сайта. Пароли и токены сюда не попадают, почта только маской.

type Data = Record<string, unknown>;

interface ClientEvent {
    t: string;
    s: string;
    e: string;
    d?: Data;
}

const ENDPOINT = '/api/client-log';
const QUEUE_KEY = 'client-log';
const MAX_QUEUE = 100;
const BATCH = 50;
const FLUSH_DELAY = 3000;
const MAX_TEXT = 1000;

export const SESSION = Math.random().toString(36).slice(2, 10);

let queue: ClientEvent[] = load();
let timer: ReturnType<typeof setTimeout> | null = null;
let sending = false;

function load(): ClientEvent[] {
    try {
        const parsed = JSON.parse(storage.get(QUEUE_KEY) ?? '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function save() {
    if (queue.length) storage.set(QUEUE_KEY, JSON.stringify(queue));
    else storage.remove(QUEUE_KEY);
}

export function maskEmail(email: string): string {
    const [name, domain] = email.trim().split('@');
    if (!domain) return '';
    return `${name.slice(0, 2)}***@${domain}`;
}

// Токены и почта в адресе запроса: /reset/<почта>, /password/<токен>, /activate/<ссылка>.
export function safePath(url: string): string {
    return url.replace(/\/(reset|password|activate)\/[^/?]+/, '/$1/***');
}

function clip(value: unknown): unknown {
    return typeof value === 'string' && value.length > MAX_TEXT ? `${value.slice(0, MAX_TEXT)}…` : value;
}

function clean(data?: Data): Data | undefined {
    if (!data) return undefined;
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, clip(value)]));
}

export function context(): Data {
    const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
    return {
        ua: nav.userAgent,
        inApp: /Instagram|FBAN|FBAV|Telegram|VKClient/i.exec(nav.userAgent)?.[0] ?? null,
        online: nav.onLine,
        net: nav.connection?.effectiveType ?? null,
        screen: `${window.innerWidth}x${window.innerHeight}`,
        ref: document.referrer || null,
    };
}

function schedule() {
    if (timer) return;
    timer = setTimeout(() => {
        timer = null;
        void flushClientLog();
    }, FLUSH_DELAY);
}

// Событие с префиксом error уходит сразу: вкладку могут закрыть через секунду.
export function logEvent(event: string, data?: Data) {
    queue.push({ t: new Date().toISOString(), s: SESSION, e: event, d: clean(data) });
    if (queue.length > MAX_QUEUE) queue = queue.slice(-MAX_QUEUE);
    save();

    if (event.startsWith('error')) void flushClientLog();
    else schedule();
}

export async function flushClientLog(): Promise<void> {
    if (sending || queue.length === 0) return;
    sending = true;
    const batch = queue.slice(0, BATCH);

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ctx: context(), events: batch }),
            keepalive: true,
        });
        // 429 — сервер просит подождать, пачку оставляем. Остальное повтором не исправить.
        if (response.status !== 429) {
            queue = queue.filter((item) => !batch.includes(item));
            save();
        }
    } catch {
        // Нет сети: пачка лежит в хранилище и уйдёт со следующим событием или визитом.
    } finally {
        sending = false;
    }

    // Пока шла отправка, могли добавиться новые события.
    if (queue.some((item) => !batch.includes(item))) schedule();
}

export function startClientLog() {
    logEvent('start', { path: window.location.pathname });

    window.addEventListener(
        'error',
        (event) => {
            const target = event.target as (HTMLElement & { src?: string; href?: string }) | null;
            if (target && target !== (window as unknown as EventTarget) && (target.src || target.href)) {
                logEvent('error resource', { tag: target.tagName, src: target.src || target.href });
                return;
            }
            logEvent('error js', {
                msg: event.message,
                src: `${event.filename}:${event.lineno}:${event.colno}`,
                stack: event.error?.stack,
            });
        },
        true
    );

    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason as { message?: string; stack?: string } | undefined;
        logEvent('error promise', { msg: reason?.message ?? String(event.reason), stack: reason?.stack });
    });

    window.addEventListener('online', () => logEvent('net online'));
    window.addEventListener('offline', () => logEvent('net offline'));

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'hidden') return;
        logEvent('hidden', { path: window.location.pathname });
        void flushClientLog();
    });
    window.addEventListener('pagehide', () => void flushClientLog());

    // Хвост прошлого визита, если тогда отправить не вышло.
    void flushClientLog();
}
