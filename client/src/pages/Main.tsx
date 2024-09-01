import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import AOS from 'aos';
import ContentContainer from '../components/ContentContainer';
import { exercises as exercisesList } from '../constants/exercises';
import avatar from '../assets/images/avatar.png';
import arrow from '../assets/images/arrow.svg';
import dumbbell from '../assets/images/dumbbell.png';
import shaker from '../assets/images/shaker.png';
import reviews1 from '../assets/images/reviews/1.jpg';
import reviews2 from '../assets/images/reviews/2.jpg';
import reviews3 from '../assets/images/reviews/3.jpg';

import 'aos/dist/aos.css';

const Main: FC = () => {
    const name = 'back';
    const exercise = exercisesList.find((item) => item.url === name);

    useEffect(() => {
        AOS.init({
            once: true,
            duration: 500,
            easing: 'ease-out-cubic',
        });
    }, []);

    if (!exercise) return <h1>Page 404</h1>;

    return (
        <ContentContainer className="main">
            <div className="main__welcome">
                <div className="main__welcome-text">
                    <h1
                        data-aos="fade-right"
                        data-aos-delay="400"
                        className="content__title main__title"
                    >
                        Добро пожаловать на платформу онлайн - тренинга Дупиной Ники
                    </h1>
                    <p data-aos="fade-left" data-aos-delay="500" className="main__description">
                        После оплаты предоставляется доступ к видеоурокам
                        <br />с объяснением техники упражнений
                    </p>
                    <div data-aos="fade-right" data-aos-delay="600" className="main__buttons">
                        <Link to="/login">
                            <button className="secondary">Вход</button>
                        </Link>
                        <Link to="/registration">
                            <button className="primary">Регистрация и оплата</button>
                        </Link>
                    </div>
                </div>
                <div data-aos="fade-right" data-aos-delay="500" className="main__welcome-img">
                    <div id="main__blue"></div>
                    <img className="main__img" src={avatar} alt="Avatar" />
                </div>
            </div>

            <hr />

            <div className="main__content">
                <h1 data-aos="fade-right" data-aos-delay="200" className="main__name">
                    Ника Дупина
                </h1>
                <h3 data-aos="fade-right" data-aos-delay="250">
                    - В спорте более 15 лет
                </h3>
                <h3 data-aos="fade-right" data-aos-delay="300">
                    - Высшее спортивное образование (диплом с отличием)
                </h3>
                <h3 data-aos="fade-right" data-aos-delay="350">
                    - Среднее профессиональное образование нутрициолога
                </h3>
                <h3 data-aos="fade-right" data-aos-delay="400">
                    - 8 курсов повышения квалификации
                </h3>
                <h3 data-aos="fade-right" data-aos-delay="450">
                    - Более 150 довольных клиентов
                </h3>

                <div data-aos="flip-up" data-aos-delay="500" className="main__banner">
                    <h2>Система онлайн тренировок</h2>
                    <img className="main__banner-img" src={arrow} alt="" />
                </div>

                <div className="main__list-plan">
                    <div data-aos="flip-up" data-aos-delay="500" className="main__plan">
                        <div className="main__block-number">
                            <span className="main__plan-number">1</span>
                        </div>
                        <span className="main__plan-title">Вводная консультация</span>
                        <span>
                            постановка целей, обсуждение рабочих весов, ограничения по здаровью и
                            т.д.
                        </span>
                    </div>

                    <div data-aos="flip-up" data-aos-delay="500" className="main__plan">
                        <div className="main__block-number">
                            <span className="main__plan-number">2</span>
                        </div>
                        <span className="main__plan-title">Предоставление доступа к сайту</span>
                        <span>
                            на онлайн-платформе отсняты все упражнения для вашего удобства, чтобы не
                            было проблем с техникой выполнения
                        </span>
                    </div>

                    <div data-aos="flip-up" data-aos-delay="500" className="main__plan">
                        <div className="main__block-number">
                            <span className="main__plan-number">3</span>
                        </div>
                        <span className="main__plan-title">Написание тернировочного протокола</span>
                        <span>тренируемся по циклам с прогесссией и периодизацией нагрузки</span>
                    </div>

                    <div data-aos="flip-up" data-aos-delay="500" className="main__plan">
                        <div className="main__block-number">
                            <span className="main__plan-number">4</span>
                        </div>
                        <span className="main__plan-title">Обратная связь</span>
                        <span>после каждой тренировки обсуждаем нагрузку</span>
                    </div>
                </div>
            </div>

            <div data-aos="flip-up" data-aos-delay="500" className="main__result">
                <h2 className="main__result-title">Результаты</h2>
                <div>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={true}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                    >
                        <SwiperSlide>
                            <div className="main__result-block">
                                <img className="main__result-img" src={reviews1} alt="" />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="main__result-block">
                                <img className="main__result-img" src={reviews2} alt="" />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="main__result-block">
                                <img className="main__result-img" src={reviews3} alt="" />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>

            <div className="main__login">
                <Link to="/registration">
                    <button className="primary main__login-btn">Начать сейчас</button>
                </Link>
            </div>

            <div id="main__img">
                <span id="main__first-fitness">FITNESS</span>
                <span id="main__second-fitness">FITNESS</span>
                <img id="main__first-dumbbell" src={dumbbell} alt="" />
                <img id="main__second-dumbbell" src={dumbbell} alt="" />
                <img id="main__shaker" src={shaker} alt="" />
            </div>
        </ContentContainer>
    );
};

export default Main;
