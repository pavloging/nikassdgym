import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';
import { rates } from '../constants/rates';
import { toast } from 'react-toastify';

const Rates: FC = () => {
    const handlePay = (price: number) => {
        toast.success(`Тариф стоимостью: ${price} выбран. Сейчас начнется оплата`)
    }

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
                        <button className="rates__btn primary" onClick={() => handlePay(item.salePrice ? item.salePrice : item.price)}>Оплатить</button>
                    </div>
                ))}
            </div>
        </ContentContainer>
    );
};

export default Rates;
