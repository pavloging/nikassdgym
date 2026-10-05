const fs = require('fs');
const path = require('path');
const util = require('util');

// Копия всего, что сервер пишет в консоль, в файл на диске хоста.
// Логи docker пропадают при пересоздании контейнера на деплое, файл остаётся.
// Каталог монтируется из /var/log/nikassdgym, ротирует его logrotate хоста
// (deploy/logrotate-nikassdgym). Время в UTC, как в логах nginx.
function teeConsoleToFile(dir, fileName = 'api.log') {
    fs.mkdirSync(dir, { recursive: true });
    const stream = fs.createWriteStream(path.join(dir, fileName), { flags: 'a' });

    // Кончилось место или сломались права: сайт работает дальше, просто без файла.
    stream.on('error', (e) => process.stderr.write(`file log off: ${e.message}\n`));

    const originals = {};
    for (const level of ['log', 'warn', 'error']) {
        originals[level] = console[level];
        console[level] = (...args) => {
            originals[level](...args);
            if (!stream.destroyed) stream.write(`${new Date().toISOString()} ${util.format(...args)}\n`);
        };
    }

    const restore = () => Object.assign(console, originals);
    return { stream, restore };
}

module.exports = { teeConsoleToFile };
