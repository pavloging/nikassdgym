import { createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../../services/AuthService';
import { getErrorMessage } from '../../../utils/handleError';
import { storage, TOKEN_KEY } from '../../../utils/storage';

export const fetchLogout = createAsyncThunk<void, void, { rejectValue: string }>(
    'user/fetchLogout',
    async (_, thunkAPI) => {
        try {
            await AuthService.logout();
        } catch (e) {
            // Даже если сервер не ответил, локально выходим: токен всё равно бесполезен.
            storage.remove(TOKEN_KEY);
            return thunkAPI.rejectWithValue(getErrorMessage(e));
        }
        storage.remove(TOKEN_KEY);
    }
);
