import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCreateLinkPay } from '../redux/redusers/user/ActionCreateLinkPay';
import { handleError } from '../utils/handleError';
import { IPay } from '../types/ISubscription';

export const usePay = () => {
    const dispatch = useDispatch<AppDispatch>();
    const store = useSelector((state: RootState) => state.user);

    const handlePay = async (pay: IPay) => {
        try {
            const { price, name } = pay;
            if (!store.isAuth) return toast.error('Авторизуйтесь чтобы оплатить тариф');
            toast.success(`Тариф: ${name} выбран. Сейчас начнется оплата в размере: ${price}`);

            setTimeout(async () => {
                const data = await dispatch(fetchCreateLinkPay(pay));
                if (!data) throw Error('Произошла ошибка при получении данных. Попробуйте позже');
                window.location.href = data.payload as string;
            }, 2500);
        } catch (e) {
            handleError(e);
        }
    };

    return { handlePay };
};