import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface IError {
    location: string;
    msg: string;
    param: string;
    value: string;
}

// Функция для обработки ошибок от Axios
export function handleError(error: unknown) {
    if (error instanceof AxiosError) {
        console.log('Error:', error)
        console.log('isShow msg', error.response && error.response.data && error.response.data.errors.length !== 0)
        if (error.response && error.response.data && error.response.data.errors.length !== 0) {
            error.response.data.errors.forEach((item: IError) => {
                toast.error(item.msg);
            });
        } else if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
        } else {
            toast('Произошла неизвестная ошибка');
            console.error(error);
        }
    }
}
