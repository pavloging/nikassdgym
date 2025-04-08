import { FC } from 'react';
import { ICard } from '../types/ICard';

interface CardsProps {
    data: Array<ICard>;
}

const Cards: FC<CardsProps> = ({ data }) => {
    const listCardsHalf = data.filter((item) => item.size === 'half');
    const listCardsFull = data.filter((item) => item.size === 'full');
    return (
        <div className="main__block-card">
            <div className="main__card-list">
                {listCardsHalf.map((item) => (
                    <div key={item.text} className="main__card">
                        <img src={item.pathIcon} alt="" />
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
            {listCardsFull.map((item) => (
                <div key={item.text} style={item.bgColor ? { backgroundColor: item.bgColor } : {}} className="main__card">
                    <img src={item.pathIcon} alt="" />
                    <span>{item.text}</span>
                </div>
            ))}
        </div>
    );
};

export default Cards;
