import { ReactElement, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, RenderOptions } from '@testing-library/react';
import userReducer from '../redux/redusers/user/User';
import { IUser } from '../types/IUser';

export const makeUser = (over: Partial<IUser> = {}): IUser => ({
    id: 'user-1',
    email: 'test@example.com',
    isActivated: true,
    isActivatedSubscription: false,
    dateActivatedSubscription: new Date('2026-01-15T00:00:00.000Z'),
    ...over,
});

type UserState = ReturnType<typeof userReducer>;

export const makeState = (over: Partial<UserState> = {}): UserState => ({
    user: makeUser(),
    isLoading: false,
    isAuth: false,
    error: '',
    ...over,
});

export const makeStore = (userState?: Partial<UserState>) =>
    configureStore({
        reducer: { user: userReducer },
        preloadedState: userState ? { user: makeState(userState) } : undefined,
    });

interface Options extends Omit<RenderOptions, 'wrapper'> {
    store?: ReturnType<typeof makeStore>;
    route?: string;
}

export function renderWithProviders(ui: ReactElement, { store = makeStore(), route = '/', ...rest }: Options = {}) {
    const Wrapper = ({ children }: { children: ReactNode }) => (
        <MemoryRouter initialEntries={[route]}>
            <Provider store={store}>{children}</Provider>
        </MemoryRouter>
    );
    return { store, ...render(ui, { wrapper: Wrapper, ...rest }) };
}
