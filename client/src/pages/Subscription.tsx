import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';

import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { subscription } from '../constants/subscription';
import { usePay } from '../hooks/usePay';

const Subscription: FC = () => {
    const store = useSelector((state: RootState) => state.user);
    const { handlePay } = usePay();

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
                            className="subscription__btn"
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
