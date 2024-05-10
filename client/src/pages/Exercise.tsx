import { FC, useEffect, useState } from 'react';
import ContentContainer from '../components/ContentContainer';
import { exercises as exercisesList } from '../constants/exercises';
import { useNavigate, useParams } from 'react-router-dom';

const Exercise: FC = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const exercise = exercisesList.find((item) => item.url === name);

    // Validate Page
    useEffect(() => {
        if (!exercise) navigate('/404');
    }, [exercise, name, navigate]);

    if (!exercise) return <h1>Page 404</h1>;

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
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск"
                />
            </div>
            {filteredExercise.map((item) => (
                <div className="exercise__card" key={item.name}>
                    <div className="exercise__video-block">
                        <video className="exercise__video" controls loop>
                            <source src={item.src} type="video/mp4"></source>
                        </video>
                    </div>
                    <p className="exercise__name">{item.name}</p>
                </div>
            ))}
        </ContentContainer>
    );
};

export default Exercise;
