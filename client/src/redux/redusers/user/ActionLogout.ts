import { createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../../services/AuthService';
import { handleError } from '../../../utils/handleError';

export const fetchLogout = createAsyncThunk('user/fetchLogout', async (_, thunkAPI) => {
    try {
        const response: void = await AuthService.logout();
        localStorage.removeItem('token');
        return response;
    } catch (e) {
        handleError(e)
        return thunkAPI.rejectWithValue((e as Error).message ?? 'Не удалось выйти из системы');
    }
});
