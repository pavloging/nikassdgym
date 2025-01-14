import { FC, useState } from 'react';
import ContentContainer from '../components/ContentContainer';
import { exercises as exercisesList } from '../constants/exercises';
import { useParams } from 'react-router-dom';
import LazyLoadVideo from '../components/LazyLoadVideo';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const Exercise: FC = () => {
    const { name } = useParams();
    const [search, setSearch] = useState('');
    const store = useSelector((state: RootState) => state.user);
    
    const exercise = exercisesList.find((item) => item.url === name);

    if (!store.isAuth) return <p className="txt-center">Авторизуйтесь в системе и активируйте подписку</p>;
    if (!store.user.isActivatedSubscription) return <p className="txt-center">У вас не активна подписка</p>;
    if (!exercise) return <h1>Страница не найдена</h1>;

    const filteredExercise =
        search.length !== 0
            ? exercise.list.filter((item) =>
                  item.name.toLowerCase().includes(search.toLowerCase().trim())
              )
            : exercise.list;

    return (
        <ContentContainer className="exercise">
            <div className="exercise__header">
                <h1 className="content__title">{exercise.name}</h1>
                <div className="exercise__img-block">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск"
                    />
                    <img className="exercise__img" src="/search.svg" alt="" />
                </div>
            </div>
            <div className="exercise__list-card">
                {filteredExercise.map((item) => (
                    <div className="exercise__card" key={item.name}>
                        <div className="exercise__video-block">
                            <LazyLoadVideo src={item.src} img={item.img} type="video/mp4" />
                        </div>
                        <p className="exercise__name">{item.name}</p>
                    </div>
                ))}
            </div>
            {filteredExercise.length === 0 && <p>Элементов не найдено</p>}
        </ContentContainer>
    );
};

export default Exercise;
