const fs = require('fs');
const os = require('os');
const path = require('path');
const { teeConsoleToFile } = require('../utils/file-log');

let dir;
let tee;

function finished(stream) {
    return new Promise((resolve) => stream.end(resolve));
}

beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'file-log-'));
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    tee?.restore();
    fs.rmSync(dir, { recursive: true, force: true });
});

describe('teeConsoleToFile', () => {
    it('пишет строки консоли в файл с временем', async () => {
        tee = teeConsoleToFile(dir);

        console.log('GET /api/refresh -> 401 %dms', 4);
        console.warn('POST /api/login -> 400: Неверный пароль');
        await finished(tee.stream);

        const lines = fs.readFileSync(path.join(dir, 'api.log'), 'utf8').trim().split('\n');
        expect(lines).toHaveLength(2);
        expect(lines[0]).toMatch(/^\d{4}-\d\d-\d\dT[\d:.]+Z GET \/api\/refresh -> 401 4ms$/);
        expect(lines[1]).toContain('Неверный пароль');
    });

    it('в консоль тоже пишет, docker logs продолжают работать', () => {
        const log = console.log;
        tee = teeConsoleToFile(dir);

        console.log('строка');

        expect(log).toHaveBeenCalledWith('строка');
    });

    // После деплоя контейнер новый, а файл тот же: старые строки не теряются.
    it('дописывает в существующий файл', async () => {
        fs.writeFileSync(path.join(dir, 'api.log'), 'старая строка\n');
        tee = teeConsoleToFile(dir);

        console.log('новая');
        await finished(tee.stream);

        const text = fs.readFileSync(path.join(dir, 'api.log'), 'utf8');
        expect(text.startsWith('старая строка\n')).toBe(true);
        expect(text).toContain('новая');
    });

    it('сломанный файл не роняет сервер', async () => {
        tee = teeConsoleToFile(dir);
        const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

        const closed = new Promise((resolve) => tee.stream.once('close', resolve));
        tee.stream.destroy(new Error('No space left on device'));
        await closed;

        expect(() => console.log('после ошибки')).not.toThrow();
        expect(stderr).toHaveBeenCalledWith(expect.stringContaining('No space left on device'));
    });
});
