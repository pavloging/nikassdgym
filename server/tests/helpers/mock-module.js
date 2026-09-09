const path = require('path');

// Корень серверного проекта: helpers лежит в server/tests/helpers.
const ROOT = path.join(__dirname, '..', '..');

// Проект на CommonJS, и vi.mock здесь не перехватывает require: модуль успевает
// загрузиться раньше. Поэтому подменяем модуль прямо в кеше require до того,
// как его затребует тестируемый код. Путь задаётся от корня server/.
function mockModule(modulePath, exports) {
    const filename = require.resolve(path.join(ROOT, modulePath));
    require.cache[filename] = {
        id: filename,
        filename,
        path: path.dirname(filename),
        loaded: true,
        children: [],
        paths: [],
        exports,
    };
    return exports;
}

// Убирает модуль из кеша, чтобы следующий require загрузил настоящий.
function unmockModule(modulePath) {
    delete require.cache[require.resolve(path.join(ROOT, modulePath))];
}

module.exports = { mockModule, unmockModule };
