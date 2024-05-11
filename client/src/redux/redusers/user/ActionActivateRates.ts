import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import UserService from '../../../services/UserService';
import { IUser } from '../../../types/IUser';

export const fetchActivateRates = createAsyncThunk(
    'user/fetchActivateRates',
    async ({ userId, date }: { userId: string; date: number }, thunkAPI) => {
        try {
            const response: AxiosResponse<IUser> = await UserService.activateRates(userId, date);
            return response.data;
        } catch (e: unknown) {
            return thunkAPI.rejectWithValue('Не удалось активировать оплаченный тариф');
        }
    }
);
