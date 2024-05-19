import { FC } from 'react';
import { Link } from 'react-router-dom';
import ContentContainer from '../components/ContentContainer';
import { exercises } from '../constants/exercises';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const ExercisesList: FC = () => {
    const store = useSelector((state: RootState) => state.user);

    const Content = () => {
        if (!store.isAuth) return <p className='txt-center'>Авторизуйтесь в системе</p>

        if (!store.user.isActivatedSubscription) return <p className='txt-center'>У вас не активна подписка</p>

        return <div className="exercises-list__content">
        {exercises.map((item) => (
            <Link to={`/exercises/${item.url}`} className="exercises-list__card" key={item.name}>
                <div className="exercises-list__img-block">
                    <img className="exercises-list__img" src={item.src} alt="" />
                </div>
                <div className="exercises-list__text-block">
                    <span className="exercises-list__text">{item.name}</span>
                </div>
            </Link>
        ))}
    </div>
    }

    return (
        <ContentContainer className="exercises-list">
            <h1 className="content__title">Упражнения</h1>
            {<Content/>}
        </ContentContainer>
    );
};

export default ExercisesList;
