import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ContentContainer from '../components/ContentContainer';
import LazyLoadVideo from '../components/LazyLoadVideo';
import { exercises as exercisesList } from '../constants/exercises';
import { RootState } from '../redux/store';

const Exercise: FC = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const store = useSelector((state: RootState) => state.user);

    const [search, setSearch] = useState('');
    const exercise = exercisesList.find((item) => item.url === name);

    // Видео доступны только оплаченной подписке.
    const isSubscribed = store.isAuth && store.user.isActivatedSubscription;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [name]);

    useEffect(() => {
        if (!exercise) navigate('/404');
    }, [exercise, navigate]);

    useEffect(() => {
        if (isSubscribed) return;

        const timer = setTimeout(() => {
            toast.error(
                store.isAuth
                    ? 'У вас не активна подписка. Пожалуйста, активируйте её, чтобы упражнения отображались'
                    : 'Авторизуйтесь в системе и активируйте подписку, чтобы упражнения отображались'
            );
        }, 2000);

        return () => clearTimeout(timer);
    }, [isSubscribed, store.isAuth]);

    const filteredExercise = useMemo(() => {
        if (!exercise) return [];
        const query = search.toLowerCase().trim();
        if (!query) return exercise.list;
        return exercise.list.filter((item) => item.name.toLowerCase().includes(query));
    }, [exercise, search]);

    if (!exercise) return null;

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
                            <LazyLoadVideo
                                src={item.src}
                                img={item.img}
                                type="video/mp4"
                                isControls={isSubscribed}
                            />
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
