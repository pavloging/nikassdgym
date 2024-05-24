import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';

import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCreateLinkPay } from '../redux/redusers/user/ActionCreateLinkPay';
import { subscription } from '../constants/subscription';
import { IPay } from '../types/ISubscription';
import { handleError } from '../utils/handleError';

const Subscription: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const store = useSelector((state: RootState) => state.user);

    // validateSubscription

    const handlePay = async (pay: IPay) => {
        try {
            const { price, name } = pay;
            if (!store.isAuth) return toast.error('Авторизуйтесь чтобы оплатить тариф');
            toast.success(`Тариф: ${name} выбран. Сейчас начнется оплата в размере: ${price}`);

            // const data = await new Promise((resolve) => {
            //     setTimeout(() => {
            //         resolve('foo');
            //     }, 300);
            // });

            setTimeout(async () => {
                const data = await dispatch(fetchCreateLinkPay(pay));
                if (!data) throw Error('Произошла ошибка при получении данных. Попробуйте позже');
                window.location.href = data.payload as string;
            }, 2500);

            // toast.success('Деньги были отправлены. После поступления на счет - Подписка активируется')
        } catch (e) {
            handleError(e);
        }
    };

    return (
        <ContentContainer className="subscription">
            <h1 className="content__title">Тарифы</h1>
            <div className="subscription__list-cards">
                {subscription.map((item) => (
                    <div key={item.name} className="subscription__card">
                        <h2 className="subscription__name">{item.name}</h2>
                        <p className="subscription__description">{item.description}</p>
                        {item.salePrice ? (
                            <div className="subscription__sale-block">
                                <h2 className="subscription__sale-price">{item.price}p</h2>
                                <h2 className="subscription__price">{item.salePrice}p</h2>
                            </div>
                        ) : (
                            <h2 className="subscription__price">{item.price}p</h2>
                        )}
                        <button
                            className="subscription__btn primary"
                            onClick={() =>
                                handlePay({
                                    price: item.salePrice ? item.salePrice : item.price,
                                    name: item.name,
                                    date: item.date,
                                    userId: store.user.id,
                                })
                            }
                        >
                            Оплатить
                        </button>
                    </div>
                ))}
            </div>
        </ContentContainer>
    );
};

export default Subscription;
