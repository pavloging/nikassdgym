import { createSlice, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchAuth } from './ActionAuth';
import { fetchLogin } from './ActionLogin';
import { fetchLogout } from './ActionLogout';
import { fetchRegistration } from './ActionRegistration';
import { fetchCreateLinkPay } from './ActionCreateLinkPay';
import { AuthResponse } from '../../../types/response/AuthResponse';
import { IUser } from '../../../types/IUser';

interface UserState {
    user: IUser;
    isLoading: boolean;
    isAuth: boolean;
    error: string;
}

const emptyUser: IUser = {
    id: '',
    email: '',
    isActivated: false,
    isActivatedSubscription: false,
    dateActivatedSubscription: new Date(),
};

const initialState: UserState = {
    user: emptyUser,
    isLoading: false,
    isAuth: false,
    error: '',
};

// Все thunk-и отклоняются через rejectWithValue(getErrorMessage(e)),
// поэтому payload у rejected — готовая строка для пользователя.
type RejectedPayload = string | undefined;

const signIn = (state: UserState, action: PayloadAction<AuthResponse>) => {
    state.isLoading = false;
    state.isAuth = true;
    state.error = '';
    state.user = action.payload.user;
};

const startLoading = (state: UserState) => {
    state.isLoading = true;
};

// Единственное место, где ошибка показывается пользователю: одна ошибка — одно уведомление.
const failWithToast = (state: UserState, action: PayloadAction<RejectedPayload>) => {
    state.isLoading = false;
    const message = action.payload ?? 'Произошла ошибка. Попробуйте позже';
    state.error = message;
    toast.error(message);
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
        builder
            // Восстановление сессии при загрузке страницы.
            // Провал — штатная ситуация (сессия истекла), молча остаёмся гостем.
            .addCase(fetchAuth.pending, startLoading)
            .addCase(fetchAuth.fulfilled, signIn)
            .addCase(fetchAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuth = false;
                state.error = '';
                state.user = emptyUser;
            })

            .addCase(fetchRegistration.pending, startLoading)
            .addCase(fetchRegistration.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                signIn(state, action);
                toast.success('Вы вошли в систему!');
            })
            .addCase(fetchRegistration.rejected, failWithToast)

            .addCase(fetchLogin.pending, startLoading)
            .addCase(fetchLogin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                signIn(state, action);
                toast.success('Вы вошли в систему!');
            })
            .addCase(fetchLogin.rejected, failWithToast)

            .addCase(fetchLogout.pending, startLoading)
            .addCase(fetchLogout.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuth = false;
                state.error = '';
                state.user = emptyUser;
                toast.success('Вы вышли из системы');
            })
            // Сервер мог не ответить, но локально пользователь всё равно выходит.
            .addCase(fetchLogout.rejected, (state) => {
                state.isLoading = false;
                state.isAuth = false;
                state.user = emptyUser;
            })

            // Тут только получение ссылки на оплату. Подписка активируется
            // вебхуком ЮKassa после реального платежа, а не здесь.
            .addCase(fetchCreateLinkPay.pending, startLoading)
            .addCase(fetchCreateLinkPay.fulfilled, (state) => {
                state.isLoading = false;
                state.error = '';
            })
            .addCase(fetchCreateLinkPay.rejected, failWithToast);
    },
});

export default userSlice.reducer;
