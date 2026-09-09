import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../../../services/UserService';
import { IPay } from '../../../types/ISubscription';
import { getErrorMessage } from '../../../utils/handleError';

// Сервер отдаёт ссылку на оплату в ЮKassa, по ней и уходит редирект.
export const fetchCreateLinkPay = createAsyncThunk<string, IPay, { rejectValue: string }>(
    'user/fetchCreateLinkPay',
    async (data, thunkAPI) => {
        try {
            const response = await UserService.createLinkPay(data);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(getErrorMessage(e));
        }
    }
);
