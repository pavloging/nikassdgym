import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Login from './Login';
import Registration from './Registration';
import Reset from './Reset';
import Password from './Password';
import Policy from './Policy';
import Offerta from './Offerta';
import Agreement from './Agreement';
import { renderWithProviders } from '../test/utils';

vi.mock('react-toastify', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

// Страницы-обёртки: заголовок, нужная форма и общая рамка с шапкой и подвалом.
describe.each([
    ['Вход', <Login key="login" />, 'Введите email'],
    ['Регистрация', <Registration key="reg" />, 'Введите email'],
    ['Восстановить пароль', <Reset key="reset" />, 'Введите email'],
    ['Новый пароль', <Password key="pass" />, 'Введите password'],
])('страница «%s»', (title, element, placeholder) => {
    it('показывает свой заголовок', () => {
        renderWithProviders(element);
        expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    });

    it('показывает свою форму', () => {
        renderWithProviders(element);
        expect(screen.getAllByPlaceholderText(placeholder).length).toBeGreaterThan(0);
    });

    it('обёрнута в шапку и подвал', () => {
        renderWithProviders(element);
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
});

// Юридические страницы: содержимое статичное, важно что оно есть и не пустое.
describe.each([
    ['Политика обработки персональных данных', <Policy key="policy" />],
    ['Публичная оферта', <Offerta key="offerta" />],
    ['Согласие на обработку персональных данных', <Agreement key="agreement" />],
])('страница «%s»', (title, element) => {
    it('показывает заголовок', () => {
        renderWithProviders(element);
        expect(screen.getByRole('heading', { name: new RegExp(title, 'i') })).toBeInTheDocument();
    });

    it('текст не пустой', () => {
        renderWithProviders(element);
        expect(screen.getByRole('main').textContent!.length).toBeGreaterThan(500);
    });

    it('с неё можно уйти по шапке', () => {
        renderWithProviders(element);
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });
});
