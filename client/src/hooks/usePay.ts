import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCreateLinkPay } from '../redux/redusers/user/ActionCreateLinkPay';
import { IPay } from '../types/ISubscription';

export const usePay = () => {
    const dispatch = useDispatch<AppDispatch>();
    const store = useSelector((state: RootState) => state.user);

    const handlePay = async (pay: IPay) => {
        if (!store.isAuth) {
            toast.error('Авторизуйтесь, чтобы оплатить тариф');
            return;
        }

        const result = await dispatch(fetchCreateLinkPay(pay));

        // Ошибку уже показал редьюсер — здесь просто никуда не уводим пользователя.
        if (fetchCreateLinkPay.rejected.match(result)) return;

        const paymentUrl = result.payload as string;
        if (!paymentUrl) {
            toast.error('Не удалось получить ссылку на оплату. Попробуйте позже');
            return;
        }

        window.location.href = paymentUrl;
    };

    return { handlePay };
};
