import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';
import { rates } from '../constants/rates';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchActivateRates } from '../redux/redusers/user/ActionActivateRates';

const Rates: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const store = useSelector((state: RootState) => state.user);

    const handlePay = async (price: number, name: string, date: number, userId: string) => {
        try {
            if (!store.isAuth) return toast.error('Авторизуйтесь чтобы оплатить тариф')
            toast.success(`Тариф: ${name} выбран. Сейчас начнется оплата в размере: ${price}`);

            const data = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve('foo');
                }, 300);
            });
            if (!data) throw Error('Произошла ошибка при оплате. Попробуйте позже');
            const result = await dispatch(fetchActivateRates({userId, date}))

            if (!result) throw Error('Произошла ошибка при получении данных. Попробуйте позже');
            toast.success(`Тариф на ${name} активирован`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ContentContainer className="rates">
            <h1 className="content__title">Тарифы</h1>
            <div className="rates__list-cards">
                {rates.map((item) => (
                    <div key={item.name} className="rates__card">
                        <h2 className="rates__name">{item.name}</h2>
                        <p className="rates__description">{item.description}</p>
                        {item.salePrice ? (
                            <div className="rates__sale-block">
                                <h2 className="rates__sale-price">{item.price}p</h2>
                                <h2 className="rates__price">{item.salePrice}p</h2>
                            </div>
                        ) : (
                            <h2 className="rates__price">{item.price}p</h2>
                        )}
                        <button
                            className="rates__btn primary"
                            onClick={() => handlePay(item.salePrice ? item.salePrice : item.price, item.name, item.date, store.user.id)}
                        >
                            Оплатить
                        </button>
                    </div>
                ))}
            </div>
        </ContentContainer>
    );
};

export default Rates;
