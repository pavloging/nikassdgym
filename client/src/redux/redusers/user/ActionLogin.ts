import { createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../../services/AuthService';
import { AuthResponse } from '../../../types/response/AuthResponse';
import { getErrorMessage } from '../../../utils/handleError';
import { storage, TOKEN_KEY } from '../../../utils/storage';

interface Credentials {
    email: string;
    password: string;
}

export const fetchLogin = createAsyncThunk<AuthResponse, Credentials, { rejectValue: string }>(
    'user/fetchLogin',
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await AuthService.login(email, password);
            storage.set(TOKEN_KEY, response.data.accessToken);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(getErrorMessage(e));
        }
    }
);
