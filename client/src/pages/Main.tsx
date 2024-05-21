import { FC } from 'react';
import { Link } from 'react-router-dom';
import ContentContainer from '../components/ContentContainer';
import { exercises as exercisesList } from '../constants/exercises';
import avatar from '../assets/images/avatar.png';
import dumbbell from '../assets/images/dumbbell.png';
import shaker from '../assets/images/shaker.png';

const Main: FC = () => {
    const name = 'back';
    const exercise = exercisesList.find((item) => item.url === name);

    if (!exercise) return <h1>Page 404</h1>;

    return (
        <ContentContainer className="main">
            <div className="main__welcome">
                <div className='main__welcome-text'>
                    <h1 className="content__title main__title">
                        Добро пожаловать на платформу онлайн - тренинга Дупиной Ники
                    </h1>
                    <p className="main__description">
                        После оплаты предоставляется доступ к видеоурокам<br />с
                        объяснением техники упражнений
                    </p>
                    <div className="main__buttons">
                        <Link to="/login">
                            <button className="secondary">Вход</button>
                        </Link>
                        <Link to="/registration">
                            <button className="primary">Регистрация и оплата</button>
                        </Link>
                    </div>
                </div>
                <div className='main__welcome-img'>
                    <div id='main__blue'></div>
                    <img className='main__img' src={avatar} alt="Avatar" />
                </div>
            </div>

            <hr />

            <div className="main__content">
                <div className="main__text-block">
                    <p className="main__paragraph">
                        Работаю индивидуально под любые запросы, составляя тренировочный протокол по
                        циклам с периодизацией и прогрессией нагрузки
                    </p>
                </div>

                <div className="main__text-block">
                    <p className="main__paragraph">
                        Тренировочный план отправляется в WhatsApp. Необходима обратная связь после
                        каждой тренировки: где было легко, а где было сложно.
                        <br />
                        <span className="main__span">
                            Если нет обратной связи, добавляю нагрузку на свое усмотрение
                        </span>
                    </p>
                </div>

                <div className="main__text-block">
                    <p className="main__paragraph">
                        Оплата ежемесячно, независимо от использования сайта.{' '}
                        <span className="main__span">
                            Рекомендую смотреть видеоуроки дома и перед тренировкой
                        </span>
                    </p>

                    <div className="main__buttons">
                        <Link to="/login">
                            <button className="secondary">Вход</button>
                        </Link>
                        <Link to="/registration">
                            <button className="primary">Регистрация и оплата</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div id='main__img'>
                <span id='main__first-fitness'>FITNESS</span>
                <span id='main__second-fitness'>FITNESS</span>
                <img id='main__first-dumbbell' src={dumbbell} alt="" />
                <img id='main__second-dumbbell' src={dumbbell} alt="" />
                <img id='main__shaker' src={shaker} alt="" />
            </div>
        </ContentContainer>
    );
};

export default Main;
