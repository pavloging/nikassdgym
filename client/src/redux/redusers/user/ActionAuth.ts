import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../../http';
import { AuthResponse } from '../../../types/response/AuthResponse';
import { getErrorMessage } from '../../../utils/handleError';
import { storage, TOKEN_KEY } from '../../../utils/storage';

// Тихое восстановление сессии при загрузке страницы.
// Провал здесь — обычная ситуация (сессия истекла, вошли с другого устройства),
// поэтому пользователю ничего не показываем, а только чистим протухший токен.
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
            storage.remove(TOKEN_KEY);
            return thunkAPI.rejectWithValue(getErrorMessage(e));
        }
    }
);
