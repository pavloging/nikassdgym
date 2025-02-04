import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../../http';
import { AuthResponse } from '../../../types/response/AuthResponse';
import { handleError } from '../../../utils/handleError';

export const fetchAuth = createAsyncThunk('user/fetchAuth', async (_, thunkAPI) => {
    try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
            withCredentials: true,
        });
        localStorage.setItem('token', response.data.accessToken);
        return response.data;
    } catch (e) {
        handleError(e)
        return thunkAPI.rejectWithValue((e as Error).message ?? 'Не удалось авторизоваться');
    }
});
