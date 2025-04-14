import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContentContainer from '../components/ContentContainer';
import { exercises } from '../constants/exercises';

const ExercisesList: FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    const ItemList = () => {
        return (
            <div className="exercises-list__content">
                {exercises.map((item) => (
                    <Link
                        to={`/exercises/${item.url}`}
                        className="exercises-list__card"
                        key={item.name}
                    >
                        <div className="exercises-list__img-block">
                            <img className="exercises-list__img" src={item.src} alt="" />
                        </div>
                        <div className="exercises-list__text-block">
                            <span className="exercises-list__text">{item.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <ContentContainer className="exercises-list">
            <h1 className="content__title">Упражнения</h1>
            {<ItemList />}
        </ContentContainer>
    );
};

export default ExercisesList;
