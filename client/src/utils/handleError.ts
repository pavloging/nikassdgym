import axios from 'axios';
import { toast } from 'react-toastify';

interface IValidationError {
    location: string;
    msg: string;
    param: string;
    value: string;
}

interface IErrorResponse {
    message?: string;
    errors?: IValidationError[];
}

// Человеческий текст ошибки: сначала сообщение от сервера, потом запасные варианты.
// Технические строки вида "Request failed with status code 401" пользователю не показываем.
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as IErrorResponse | undefined;

        if (data?.errors?.length) return data.errors.map((item) => item.msg).join('. ');
        if (data?.message) return data.message;
        if (!error.response) return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз';

        return 'Произошла ошибка. Попробуйте позже';
    }

    if (error instanceof Error && error.message) return error.message;

    return 'Произошла неизвестная ошибка';
}

// Показывает ошибку пользователю. Ошибки валидации от сервера показываем по отдельности.
export function handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
        const errors = (error.response?.data as IErrorResponse | undefined)?.errors;
        if (errors?.length) {
            errors.forEach((item) => toast.error(item.msg));
            return;
        }
    }

    toast.error(getErrorMessage(error));
}
