import { FC, useState } from 'react';
import ContentContainer from '../components/ContentContainer';
import { exercises as exercisesList } from '../constants/exercises';

import 'aos/dist/aos.css';
import CookieBanner from '../components/CookieBanner';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { subscription } from '../constants/subscription';
import { useSelector } from 'react-redux';
import { usePay } from '../hooks/usePay';
import { RootState } from '../redux/store';
import { toast } from 'react-toastify';
import Cards from '../components/Cards';
import { cards } from '../constants/cards';

import benefitsNotRobot from '../assets/images/benefit/not-robot.svg';
import benefitsSystem from '../assets/images/benefit/system.svg';
import benefitsConnect from '../assets/images/benefit/connect.svg';
import benefitsResult from '../assets/images/benefit/result.svg';
import benefitsForYou from '../assets/images/benefit/for-you.svg';
import benefitsEscort from '../assets/images/benefit/escort.svg';
import { result } from '../constants/result';

const Main: FC = () => {
    const store = useSelector((state: RootState) => state.user);
    const { handlePay } = usePay();
    const [selectedPlan, setSelectedPlan] = useState('4 недели');
    const [activeSlide, setActiveSlide] = useState(0);
    const [activeSlideResult, setActiveSlideResult] = useState(0);

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
            <div className="main__benefits-me block">
                <h2 className="main__benefits-me_title">
                    Преимущества
                    <br />
                    онлайн тренера
                </h2>
                <div className="main__benefits-me_block-card">
                    <div className="main__benefits-me_card">
                        <div className="main__benefits-me_btns">
                            <button
                                className="main__benefits-me_btn"
                                style={
                                    activeSlide === 0
                                        ? { backgroundColor: 'var(--color-green)' }
                                        : { backgroundColor: 'var(--color-white)' }
                                }
                            >
                                Онлайн тренер — живой человек
                            </button>
                            <button
                                className="main__benefits-me_btn"
                                style={
                                    activeSlide === 1
                                        ? { backgroundColor: 'var(--color-green)' }
                                        : { backgroundColor: 'var(--color-white)' }
                                }
                            >
                                Профессиональная система тренировок
                            </button>
                            <button
                                className="main__benefits-me_btn"
                                style={
                                    activeSlide === 2
                                        ? { backgroundColor: 'var(--color-green)' }
                                        : { backgroundColor: 'var(--color-white)' }
                                }
                            >
                                Тренер всегда на связи
                            </button>
                            <button
                                className="main__benefits-me_btn"
                                style={
                                    activeSlide === 3
                                        ? { backgroundColor: 'var(--color-green)' }
                                        : { backgroundColor: 'var(--color-white)' }
                                }
                            >
                                Гарантия результата
                            </button>
                            <button
                                className="main__benefits-me_btn"
                                style={
                                    activeSlide === 4
                                        ? { backgroundColor: 'var(--color-green)' }
                                        : { backgroundColor: 'var(--color-white)' }
                                }
                            >
                                Программа тренировок собирается под вас
                            </button>
                            <button
                                className="main__benefits-me_btn"
                                style={
                                    activeSlide === 5
                                        ? { backgroundColor: 'var(--color-green)' }
                                        : { backgroundColor: 'var(--color-white)' }
                                }
                            >
                                Сопровождение и обратная связь
                            </button>
                        </div>
                    </div>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={true}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                        initialSlide={activeSlide}
                        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)} // Обновляем индекс при свайпе
                    >
                        <SwiperSlide>
                            <div className="main__result-block">
                                <img
                                    className="main__result-img"
                                    loading="lazy"
                                    src={benefitsNotRobot}
                                    alt=""
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="main__result-block">
                                <img
                                    className="main__result-img"
                                    loading="lazy"
                                    src={benefitsSystem}
                                    alt=""
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="main__result-block">
                                <img
                                    className="main__result-img"
                                    loading="lazy"
                                    src={benefitsConnect}
                                    alt=""
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="main__result-block">
                                <img
                                    className="main__result-img"
                                    loading="lazy"
                                    src={benefitsResult}
                                    alt=""
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="main__result-block">
                                <img
                                    className="main__result-img"
                                    loading="lazy"
                                    src={benefitsForYou}
                                    alt=""
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="main__result-block">
                                <img
                                    className="main__result-img"
                                    loading="lazy"
                                    src={benefitsEscort}
                                    alt=""
                                />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
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

                <div className="main__result_slider">
                    <div className="main__result_block-person">
                        <div className="main__result_person">
                            <img
                                className="main__result_person_img"
                                src={result[activeSlideResult].person.pathIcon}
                                alt=""
                            />
                            <div className='main__result_person_info'>
                                <h4 className="main__result_person_name">
                                    {result[activeSlideResult].person.name}
                                </h4>
                                <span className="main__result_person_years">
                                    {result[activeSlideResult].person.years}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="main__result_block-a">
                        <img className="main__result_a_img" src="/icons/flag-blue.svg" alt="" />
                        <h3 className="main__result_a_title">Точка А</h3>
                        <span className="main__result_a_text">{result[activeSlideResult].a}</span>
                    </div>
                    <div className="main__result_block-b">
                        <img className="main__result_b_img" src="/icons/flag-green.svg" alt="" />
                        <h3 className="main__result_b_title">Точка Б</h3>
                        <span className="main__result_b_text">{result[activeSlideResult].b}</span>
                    </div>
                    <div className="main__result_block-img">
                        <img
                            className="main__result_img"
                            src={result[activeSlideResult].img}
                            alt=""
                        />
                        <div className="main__result_img_block-desc">
                            <h3 className="main__result_img_desc">До</h3>
                            <h3 className="main__result_img_desc">После</h3>
                        </div>
                    </div>
                </div>
                <div className="main__result_block-switch">
                    <div
                        className="main__result_switch-left"
                        onClick={() =>
                            setActiveSlideResult((prev) => {
                                if (prev + 1 >= result.length) return 0;
                                return prev + 1;
                            })
                        }
                    >
                        <img src="/icons/arrow-left.svg" alt="" />
                    </div>
                    <div
                        className="main__result_switch-right"
                        onClick={() =>
                            setActiveSlideResult((prev) => {
                                if (prev - 1 <= -1) return result.length - 1;
                                return prev - 1;
                            })
                        }
                    >
                        <img src="/icons/arrow-right.svg" alt="" />
                    </div>
                </div>
                <div className="case__block_block-details">
                    <div className="case__block_details">
                        <img src="/icon.png" alt="" />
                        <h4 className="case__block_details_title">
                            Ещё больше кейсов смотрите в моем Инстаграме
                        </h4>
                        <div className="case__block_btn main__block-link_btn">
                            <a className="main__link_btn">
                                <span>Смотреть кейсы</span>
                                <img src="/icons/arrow-right-top-blue.svg" alt="" />
                            </a>
                        </div>
                    </div>
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
                <div className="main__nutrition block">
                    <div className="main__nutrition_block-text">
                        <h3 className="main__nutrition_text_title">
                            Сопровождение
                            <br />
                            по питанию
                        </h3>
                        <span className="main__nutrition_text_description">
                            У меня существует два варианта
                            <br />
                            сопровождения по питанию:
                            <br />
                            рацион и подсчет калорий.
                        </span>
                    </div>
                    <div className="main__nutrition_block-img">
                        <h3 className="main__nutrition_img_title">
                            Питание — 80% успеха в построении фигуры мечты!
                        </h3>
                        <div className="main__block-link_btn">
                            <a className="main__link_btn">
                                <span>Записаться на консультацию</span>
                                <img src="/icons/arrow-right-top-red.svg" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
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
                    <div className="case__block_block-details">
                        <div className="case__block_details">
                            <img src="/icon.png" alt="" />
                            <h4 className="case__block_details_title">
                                Подробнее о моей работе нутрициологом
                            </h4>
                            <div className="case__block_btn main__block-link_btn">
                                <a className="main__link_btn">
                                    <span>Смотреть кейсы</span>
                                    <img src="/icons/arrow-right-top-red.svg" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main__dreams block">
                <div className="main__dreams_block-title">
                    <h3 className="main__dreams_title">
                        Ваша тело мечты
                        <br />
                        начинается с вас
                    </h3>
                </div>
                <div className="main__block-link_btn">
                    <Link to="/subscription" className="main__link_btn">
                        <span>Начать тренеровки</span>
                        <img src="/icons/arrow-right-top-green.svg" alt="" />
                    </Link>
                </div>
            </div>
        </ContentContainer>
    );
};

export default Main;
