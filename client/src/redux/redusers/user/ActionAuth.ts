import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL, isSessionExpired } from '../../../http';
import { AuthResponse } from '../../../types/response/AuthResponse';
import { getErrorMessage } from '../../../utils/handleError';
import { storage, TOKEN_KEY } from '../../../utils/storage';
import { logEvent } from '../../../utils/clientLog';

// Тихое восстановление сессии при загрузке страницы.
// Провал здесь — обычная ситуация (сессия истекла, вошли с другого устройства),
// поэтому пользователю ничего не показываем. Токен чистим, только если сервер ответил 401:
// без связи токен остаётся, и при следующем открытии вход восстановится.
export const fetchAuth = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
    'user/fetchAuth',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
                withCredentials: true,
            });
            storage.set(TOKEN_KEY, response.data.accessToken);
            return response.data;
        } catch (e) {
            if (isSessionExpired(e)) storage.remove(TOKEN_KEY);
            logEvent('error refresh', {
                status: axios.isAxiosError(e) ? e.response?.status ?? null : null,
                code: axios.isAxiosError(e) ? e.code ?? null : null,
            });
            return thunkAPI.rejectWithValue(getErrorMessage(e));
        }
    }
);
