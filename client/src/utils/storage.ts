// Безопасная обёртка над localStorage.
//
// Обращение к localStorage выбрасывает исключение в приватном режиме Safari,
// при выключенном хранении данных сайта в Chrome и в части встроенных браузеров
// (Instagram, VK, Telegram). Раньше такое исключение падало во время рендера и
// пользователь видел белый экран, поэтому весь доступ к хранилищу идёт только
// через этот модуль. Если хранилище недоступно, значения живут в памяти вкладки.

const memory = new Map<string, string>();

export const storage = {
    get(key: string): string | null {
        try {
            const value = window.localStorage.getItem(key);
            if (value !== null) return value;
        } catch {
            // хранилище недоступно — ниже отвечаем из памяти
        }
        // В приватном режиме Safari чтение работает, а запись запрещена:
        // значение есть только в памяти вкладки, и вернуть надо именно его.
        return memory.get(key) ?? null;
    },

    set(key: string, value: string): void {
        memory.set(key, value);
        try {
            window.localStorage.setItem(key, value);
        } catch {
            // хранилище недоступно — значение осталось в memory
        }
    },

    remove(key: string): void {
        memory.delete(key);
        try {
            window.localStorage.removeItem(key);
        } catch {
            // хранилище недоступно — удалять нечего
        }
    },
};

export const TOKEN_KEY = 'token';
