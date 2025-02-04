import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import UserService from '../../../services/UserService';
import { IUser } from '../../../types/IUser';
import { IPay } from '../../../types/ISubscription';

export const fetchCreateLinkPay = createAsyncThunk(
    'user/fetchCreateLinkPay',
    async (data: IPay, thunkAPI) => {
        try {
            const response: AxiosResponse<IUser> = await UserService.createLinkPay(data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(
                (e as Error).message ?? 'Не удалось активировать оплаченный тариф'
            );
        }
    }
);
