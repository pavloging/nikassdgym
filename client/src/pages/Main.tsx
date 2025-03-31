import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';
import { exercises as exercisesList } from '../constants/exercises';

import 'aos/dist/aos.css';
import CookieBanner from '../components/CookieBanner';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import reviews1 from '../assets/images/reviews/1.jpg';
import reviews2 from '../assets/images/reviews/2.jpg';
import reviews3 from '../assets/images/reviews/3.jpg';

const Main: FC = () => {
    const name = 'back';
    const exercise = exercisesList.find((item) => item.url === name);

    // useEffect(() => {
    //     AOS.init({
    //         once: true,
    //         duration: 500,
    //         easing: 'ease-out-cubic',
    //     });
    // }, []);

    if (!exercise) return <h1>Page 404</h1>;

    return (
        <ContentContainer className="main">
            <CookieBanner />

            <div className="main__welcome">
                <span>Твой виртуальный</span>
                <span>Тренер</span>

                <div>
                    <div>
                        <span>на</span>
                        <span>24/7</span>
                        <span>связи</span>
                    </div>
                    <div>
                        <span>
                            С каждым подходом <br />
                            ты становишься сильнее
                        </span>
                    </div>
                </div>
                <button>Начать тренировки</button>
            </div>
            <div className="main__about-me">
                <h2>Обо мне</h2>
                <p>Чем я отличаюсь от конкурентов?</p>
                <div>
                    <div>
                        <div>
                            <img src="" alt="" />
                        </div>
                        <h4>Высшее образование</h4>
                        <span>Диплом с отличием спортивного ВУЗа.</span>
                    </div>
                    <div>
                        <div>
                            <img src="" alt="" />
                        </div>
                        <h4>Повышение квалификации</h4>
                        <span>Более 8 обучений по повышению квалификации.</span>
                    </div>
                    <div>
                        <div>
                            <img src="" alt="" />
                        </div>
                        <h4>Успех клиентов</h4>
                        <span>Мои клиенты суммарно скинули 1,5т жира.</span>
                    </div>
                    <div>
                        <div>
                            <img src="" alt="" />
                        </div>
                        <h4>Индивидуальный подход</h4>
                        <span>
                            Мной будет услышан любой запрос: от исправления осанки и устранения
                            болей, до набора мышечной массы.
                        </span>
                    </div>
                    <div>
                        <div>
                            <img src="" alt="" />
                        </div>
                        <h4>Комплексная работа</h4>
                        <span>
                            Подхожу к вопросу работы с телом комплексно, включая сопровождение по
                            питанию.
                        </span>
                    </div>
                </div>
                <span>
                    Тренируясь со мной, подопечный получает кропотливую
                    <br />
                    работу с телом, учитывая индивидуальные особенности.
                </span>
            </div>
            <div className="main__benefits-me">
                <h2>
                    Преимущества
                    <br />
                    онлайн тренера
                </h2>
                <div>
                    <div>
                        <button>Онлайн тренер — живой человек</button>
                        <button>Профессиональная система тренировок</button>
                        <button>Тренер всегда на связи</button>
                        <button>Гарантия результата</button>
                        <button>Программа тренировок собирается под вас</button>
                        <button>Сопровождение и обратная связь</button>
                    </div>
                    <div>Swagger</div>
                </div>
            </div>
            <div className="main__whom">
                <h2>
                    Кому подходят
                    <br />
                    онлайн тренировки
                </h2>
                <div className="main__whom_block-card">
                    <div className="main__whom_card-list">
                        <div className="main__whom_card"></div>
                        <div className="main__whom_card"></div>
                        <div className="main__whom_card"></div>
                        <div className="main__whom_card"></div>
                    </div>
                    <div className="main__whom_card"></div>
                </div>
            </div>
            <div className="main__result">
                <h2>Результаты подопечных</h2>
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
            <div className="main__stage">
                <h2>Этап работы</h2>
            </div>
            <div className="main__tariff">
                <h2>Тарифы</h2>
            </div>
            <div className="main__nutritionist"></div>
            <div className="main__dreams">
                <span>Ваша тело мечты начинается с вас</span>
                <button>Начать тренеровки</button>
            </div>

            {/* <div className="main__welcome">
                <div className="main__welcome-text">
                    <h1 className="content__title main__title">
                        Добро пожаловать на платформу онлайн - тренинга Дупиной Ники
                    </h1>
                    <p data-aos="fade-left" className="main__description">
                        После оплаты предоставляется доступ к видеоурокам
                        <br />с объяснением техники упражнений
                    </p>
                    <div data-aos-delay="600" className="main__buttons">
                        <Link to="/login">
                            <button className="secondary">Вход</button>
                        </Link>
                        <Link to="/registration">
                            <button className="primary">Регистрация и оплата</button>
                        </Link>
                    </div>
                </div>
                <div   className="main__welcome-img">
                    <div id="main__blue"></div>
                    <img className="main__img" src={avatar} alt="Avatar" />
                </div> 
            </div> */}

            {/* <div className="main__content">
                <h1 className="main__name">Ника Дупина</h1>
                <h3>- В спорте более 15 лет</h3>
                <h3>- Высшее спортивное образование (диплом с отличием)</h3>
                <h3>- Среднее профессиональное образование нутрициолога</h3>
                <h3>- 8 курсов повышения квалификации</h3>
                <h3>- Более 150 довольных клиентов</h3>

                <div className="main__banner">
                    <h2>Система онлайн тренировок</h2>
                    <img className="main__banner-img" src={arrow} alt="" />
                </div>

                <div className="main__list-plan">
                    <div className="main__plan">
                        <div className="main__block-number">
                            <span className="main__plan-number">1</span>
                        </div>
                        <span className="main__plan-title">Вводная консультация</span>
                        <span>
                            постановка целей, обсуждение рабочих весов, ограничения по здоровью и
                            т.д.
                        </span>
                    </div>

                    <div className="main__plan">
                        <div className="main__block-number">
                            <span className="main__plan-number">2</span>
                        </div>
                        <span className="main__plan-title">Предоставление доступа к сайту</span>
                        <span>
                            на онлайн-платформе отсняты все упражнения для вашего удобства, чтобы не
                            было проблем с техникой выполнения
                        </span>
                    </div>

                    <div className="main__plan">
                        <div className="main__block-number">
                            <span className="main__plan-number">3</span>
                        </div>
                        <span className="main__plan-title">Написание тернировочного протокола</span>
                        <span>тренируемся по циклам с прогесссией и периодизацией нагрузки</span>
                    </div>

                    <div className="main__plan">
                        <div className="main__block-number">
                            <span className="main__plan-number">4</span>
                        </div>
                        <span className="main__plan-title">Обратная связь</span>
                        <span>после каждой тренировки обсуждаем нагрузку</span>
                    </div>
                </div>
            </div> */}

            {/* <div className="main__result">
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
            </div> */}

            {/* <div className="main__login">
                <Link to="/registration">
                    <button className="primary main__login-btn">Начать сейчас</button>
                </Link>
            </div> */}

            {/* <div id="main__img">
                <span id="main__first-fitness">FITNESS</span>
                <span id="main__second-fitness">FITNESS</span>
                <img id="main__first-dumbbell" src={dumbbell} alt="" />
                <img id="main__second-dumbbell" src={dumbbell} alt="" />
                <img id="main__shaker" src={shaker} alt="" />
            </div> */}
        </ContentContainer>
    );
};

export default Main;
