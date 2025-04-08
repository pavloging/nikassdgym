import { FC, useState } from 'react';
import ContentContainer from '../components/ContentContainer';
import { exercises as exercisesList } from '../constants/exercises';

import 'aos/dist/aos.css';
import CookieBanner from '../components/CookieBanner';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import reviews1 from '../assets/images/reviews/1.jpg';
import reviews2 from '../assets/images/reviews/2.jpg';
import reviews3 from '../assets/images/reviews/3.jpg';
import { Link } from 'react-router-dom';
import { subscription } from '../constants/subscription';
import { useSelector } from 'react-redux';
import { usePay } from '../hooks/usePay';
import { RootState } from '../redux/store';
import { toast } from 'react-toastify';
import Cards from '../components/Cards';
import { cards } from '../constants/cards';

const Main: FC = () => {
    const store = useSelector((state: RootState) => state.user);
    const { handlePay } = usePay();
    const [selectedPlan, setSelectedPlan] = useState('4 недели');

    const handlePayTariff = () => {
        const tariff = subscription.find((item) => item.name === selectedPlan);
        if (!tariff) return toast.error('Произошла ошибка! Попробуйте позже');
        handlePay({
            price: tariff.salePrice ? tariff.salePrice : tariff.price,
            name: tariff.name,
            date: tariff.date,
            userId: store.user.id,
        });
    };

    const name = 'back';
    const exercise = exercisesList.find((item) => item.url === name);

    if (!exercise) return <h1>Page 404</h1>;

    return (
        <ContentContainer className="main">
            <CookieBanner />

            <div className="main__welcome block">
                <h2 className="main__welcome_title">Твой виртуальный</h2>
                {/* <br /> */}
                <h1 className="main__welcome_subtitle">Тренер</h1>

                <div className="main__welcome_block-message">
                    <div className="main__welcome_block-connect">
                        <span>на</span>
                        <span className="main__welcome_connect">24/7</span>
                        <span>связи</span>
                    </div>
                    <div className="main__welcome_block-strength">
                        <span>
                            С каждым подходом <br />
                            ты становишься сильнее
                        </span>
                    </div>
                </div>
                <Link to={'/exercises'} className="main__welcome_btn">
                    <span>Начать тренировки</span>
                    <img src="/icons/arrow-right-top-black.svg" alt="" />
                </Link>
                <img className="main__welcome_avatar" src="/avatar.png" alt="" />
            </div>
            <div className="main__about-me block">
                <h2 className="main__about-me_title">Обо мне</h2>
                <h3 className="main__about-me_subtitle">Чем я отличаюсь от конкурентов?</h3>
                <div className="main__about-me_block-card">
                    <div className="main__about-me_card">
                        <div className="main__about-me_card_block-img">
                            <img src="/icons/star.svg" alt="" />
                        </div>
                        <div>
                            <h3>Высшее образование</h3>
                            <span>Диплом с отличием спортивного ВУЗа.</span>
                        </div>
                    </div>
                    <div className="main__about-me_card">
                        <div className="main__about-me_card_block-img">
                            <img src="/icons/lamp.svg" alt="" />
                        </div>
                        <div>
                            <h3>Индивидуальный подход</h3>
                            <span>
                                Мной будет услышан любой запрос: от исправления осанки и устранения
                                болей, до набора мышечной массы.
                            </span>
                        </div>
                    </div>
                    <div className="main__about-me_card">
                        <div className="main__about-me_card_block-img">
                            <img src="/icons/rocket.svg" alt="" />
                        </div>
                        <div>
                            <h3>Повышение квалификации</h3>
                            <span>Более 8 обучений по повышению квалификации.</span>
                        </div>
                    </div>
                    <div className="main__about-me_card">
                        <div className="main__about-me_card_block-img">
                            <img src="/icons/to-do-work.svg" alt="" />
                        </div>
                        <div>
                            <h3>Комплексная работа</h3>
                            <span>
                                Подхожу к вопросу работы с телом комплексно, включая сопровождение
                                по питанию.
                            </span>
                        </div>
                    </div>
                    <div className="main__about-me_card">
                        <div className="main__about-me_card_block-img">
                            <img src="/icons/mass.svg" alt="" />
                        </div>
                        <div>
                            <h3>Успех клиентов</h3>
                            <span>Мои клиенты суммарно скинули 1,5т жира.</span>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 60 }}>
                    <span>
                        Тренируясь со мной, подопечный получает кропотливую
                        <br />
                        работу с телом, учитывая индивидуальные особенности.
                    </span>
                </div>
            </div>
            {/* <div className="main__benefits-me">
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
            </div> */}
            <div className="main__whom block">
                <h2 className="main__whom_title">
                    Кому подходят
                    <br />
                    онлайн тренировки
                </h2>
                <Cards data={cards.whomWorkout} />
            </div>
            <div className="main__result block">
                <h2 className="main__result_title">Результаты подопечных</h2>
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
            <div className="main__stage block">
                <h2 className="main__stage__title">Этап работы</h2>
                <div className="main__stage_block-card">
                    <div className="main__stage_card">
                        <span className="main__stage_card_index">01</span>
                        <h3 className="main__stage_card_title">Первичная консультация</h3>
                        <span>
                            В самом начале я узнаю ваш тренировочный опыт, ограничения по здоровью и
                            другие важные факты. У меня только профессиональный подход.
                        </span>
                    </div>
                    <div className="main__stage_card">
                        <span className="main__stage_card_index">02</span>
                        <h3 className="main__stage_card_title">План тренировок</h3>
                        <span>
                            Тренировочный протокол формируется исходя из ваших целей. Каждую неделю
                            корректирую нагрузку в зависимости от успешного выполнения задач.
                        </span>
                    </div>
                    <div className="main__stage_card">
                        <span className="main__stage_card_index">03</span>
                        <h3 className="main__stage_card_title">Регистрация на сайте и оплат</h3>
                        <span>
                            Выполнение упражнений по подробным видео урокам на платформе с обратной
                            связью от меня. Мне важен ваш качественный результат!
                        </span>
                    </div>
                    <div className="main__stage_card bg-blue">
                        <img src="/icons/i.svg" alt="" />
                        <h3 className="main__stage_card_title while">
                            Посмотреть все упражнения сейчас
                        </h3>
                        <span className="while">
                            Перед принятием окончательного решения вы можете познакомиться со всем
                            списком упражнений, которые доступны на платформе.
                        </span>
                        <Link to={'/exercises'} className="main__stage_block-arrow">
                            <img src="/icons/arrow-right-top.svg" alt="" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="main__tariff block">
                <h2 className="main__tariff_title">Тарифы</h2>
                <div className="main__tariff_block-plan">
                    {subscription.map((item) => (
                        <div
                            key={item.name}
                            className={`main__tariff_plan ${
                                selectedPlan === item.name ? 'selected' : ''
                            }`}
                            onClick={() => setSelectedPlan(item.name)}
                        >
                            <input
                                className="main__tariff_input"
                                type="radio"
                                checked={selectedPlan === item.name}
                            />
                            <div className="main__tariff_block-info">
                                <div>
                                    <h3 className="main__tariff_info_title">{item.name}</h3>
                                    <p className="main__tariff_info_description">
                                        {item.description}
                                    </p>
                                </div>
                                <h3 className="main__tariff_info_price">
                                    {item.salePrice || item.price} ₽
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="main__block-link_btn">
                    <div onClick={handlePayTariff} className="main__link_btn">
                        <span>Оплатить</span>
                        <img src="/icons/arrow-right-top-black.svg" alt="" />
                    </div>
                </div>
            </div>
            <div className="main__nutritionist">
                <div className="main__nutrition block"></div>
                <div className="main__diet block">
                    <h2 className="main__diet_title">Рацион</h2>
                    <Cards data={cards.diet} />
                </div>
                <div className="main__whom-food block">
                    <h2 className="main__whom-food_title">Кому подойдет</h2>
                    <Cards data={cards.whomFood} />
                    <div className="main__block-link_btn">
                        <a className="main__link_btn">
                            <span>Узнать стоимость</span>
                            <img src="/icons/arrow-right-top-black.svg" alt="" />
                        </a>
                    </div>
                </div>
                <div className="main__calories block">
                    <h2 className="main__calories_title">Подсчет калорий</h2>
                    <Cards data={cards.calories} />
                </div>
                <div className="main__whom-calories block">
                    <h2 className="main__whom-calories_title">Кому подойдет</h2>
                    <Cards data={cards.whomCalories} />
                    <div className="main__block-link_btn">
                        <a className="main__link_btn">
                            <span>Узнать стоимость</span>
                            <img src="/icons/arrow-right-top-black.svg" alt="" />
                        </a>
                    </div>
                </div>
                <div className="main__analyzes block">
                    <h2 className="main__analyzes_title">Разбор анализов</h2>
                    <div className="main__card-list">
                        <div className="main__analyzes_card">
                            <img className="main__analyzes_card_icon" src="/icons/i.svg" alt="" />
                            <h3 className="main__analyzes_subtitle">Настоятельно рекомендую</h3>
                            <span className="main__analyzes_span">
                                Перед составлением питания пройти чек-ап по анализам крови.
                                Результаты анализов во многом диктуют дальнейшие особенности
                                питания.
                            </span>
                        </div>
                        <div className="main__analyzes_card">
                            <h3 className="main__analyzes_sale">до — 50%</h3>
                            <h3 className="main__analyzes_subtitle">
                                Скидка при сдаче анализов со мной.
                            </h3>
                        </div>
                    </div>
                    <div className="main__block-link_btn">
                        <a className="main__link_btn">
                            <span>Узнать стоимость</span>
                            <img src="/icons/arrow-right-top-black.svg" alt="" />
                        </a>
                    </div>
                    <div className="main__analyzes_block-details">
                        <div className="main__analyzes_details">
                            <img src="/icon.png" alt="" />
                            <h4 className="main__analyzes_details_title">
                                Подробнее о моей работе нутрициологом
                            </h4>
                            <div className="main__analyzes_btn main__block-link_btn">
                                <a className="main__link_btn">
                                    <span>Смотреть кейсы</span>
                                    <img src="/icons/arrow-right-top-red.svg" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="main__dreams">
                <span>Ваша тело мечты начинается с вас</span>
                <button>Начать тренеровки</button>
            </div> */}
        </ContentContainer>
    );
};

export default Main;
