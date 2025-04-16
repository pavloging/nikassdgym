import { useSelector } from 'react-redux';
import { FC, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import ContentContainer from '../components/ContentContainer';
import { exercises as exercisesList } from '../constants/exercises';
import CookieBanner from '../components/CookieBanner';
import { subscription } from '../constants/subscription';
import Cards from '../components/Cards';
import { usePay } from '../hooks/usePay';
import { RootState } from '../redux/store';
import { cards } from '../constants/cards';
import { result } from '../constants/result';
import { benefits } from '../constants/benefits';

const Main: FC = () => {
    const store = useSelector((state: RootState) => state.user);
    const { handlePay } = usePay();
    const [selectedPlan, setSelectedPlan] = useState('1 месяц');
    const [activeSlideResult, setActiveSlideResult] = useState(0);

    // Benefits
    const [activeSlide, setActiveSlide] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);

    // Обработчик клика по кнопке
    const handleButtonClick = (index: number) => {
        setActiveSlide(index);
        if (swiperRef.current) {
            swiperRef.current.slideTo(index); // Переключаем на нужный слайд
        }
    };

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
                <Link to={'/subscription'} className="main__welcome_btn">
                    <span>Начать тренировки</span>
                    <img src="/icons/arrow-right-top-black.svg" alt="" />
                </Link>
                <img className="main__welcome_avatar" src="/avatar.png" alt="" />
            </div>
            <div className="main__about-me block" id="about-me">
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
            <div className="main__benefits-me block" id="benefits-me">
                <h2 className="main__benefits-me_title">
                    Преимущества
                    <br />
                    онлайн тренера
                </h2>
                <div className="main__benefits-me_block-card">
                    <div className="main__benefits-me_card">
                        <div className="main__benefits-me_btns">
                            {benefits.map((item, index) => (
                                <button
                                    key={item.name}
                                    className="main__benefits-me_btn"
                                    onClick={() => handleButtonClick(index)}
                                    style={
                                        activeSlide === index
                                            ? { backgroundColor: 'var(--color-green)' }
                                            : { backgroundColor: 'var(--color-white)' }
                                    }
                                >
                                    {item.name}
                                </button>
                            ))}
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
                        onSwiper={(swiper) => (swiperRef.current = swiper)} // Сохраняем ссылку на Swiper
                        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)} // Обновляем активный слай
                    >
                        {benefits.map((item) => (
                            <SwiperSlide key={item.name}>
                                <div className="main__result-block">
                                    <img
                                        className="main__result-img"
                                        src={item.urlImg}
                                        alt={item.name}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <div className="main__whom block" id="whom">
                <h2 className="main__whom_title">
                    Кому подходят
                    <br />
                    онлайн тренировки
                </h2>
                <Cards data={cards.whomWorkout} />
            </div>
            <div className="main__result block" id="result">
                <h2 className="main__result_title">Результаты подопечных</h2>

                <div className="main__result_slider">
                    <div className="main__result_block-person">
                        <div className="main__result_person">
                            <img
                                className="main__result_person_img"
                                src={result[activeSlideResult].person.pathIcon}
                                alt=""
                            />
                            <div className="main__result_person_info">
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
                            setActiveSlideResult((prev) => (result[prev + 1] ? prev + 1 : 0))
                        }
                    >
                        <img src="/icons/arrow-left.svg" alt="" />
                    </div>
                    <div
                        className="main__result_switch-right"
                        onClick={() =>
                            setActiveSlideResult((prev) =>
                                result[prev - 1] ? prev - 1 : result.length - 1
                            )
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
                            <a
                                href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTg2NzMwNTY3NDQ3MDAx?igsh=azFma3FhemJkaXEy"
                                target="_blank"
                                className="main__link_btn"
                            >
                                <span>Смотреть кейсы</span>
                                <img src="/icons/arrow-right-top-blue.svg" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main__stage block" id="stage">
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
            <div className="main__tariff block" id="tariff">
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
                                defaultChecked={selectedPlan === item.name}
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
            <div className="main__nutritionist" id="nutritionist">
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
                            <a
                                href="https://wa.me/79141636665?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%9F%D0%B8%D1%88%D1%83%20%D0%B2%D0%B0%D0%BC%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%2C%20%D0%BC%D0%B5%D0%BD%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D0%BE%20%D1%81%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8E%20%D0%BF%D0%BE%20%D0%BF%D0%B8%D1%82%D0%B0%D0%BD%D0%B8%D1%8E%2C%20%D0%BF%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D0%B6%D0%B8%D1%82%D0%B5%2C%20%D0%BD%D0%B0%20%D0%BA%D0%B0%D0%BA%D1%83%D1%8E%20%D0%B4%D0%B0%D1%82%D1%83%20%D0%B5%D1%81%D1%82%D1%8C%20%D0%B1%D0%BB%D0%B8%D0%B6%D0%B0%D0%B9%D1%88%D0%B0%D1%8F%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%8C%3F"
                                target="_blank"
                                className="main__link_btn"
                            >
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
                        <a
                            href="https://wa.me/79141636665?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%9F%D0%B8%D1%88%D1%83%20%D0%B2%D0%B0%D0%BC%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%2C%20%D0%BC%D0%B5%D0%BD%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D1%80%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%2C%20%D0%BF%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D0%B6%D0%B8%D1%82%D0%B5%2C%20%D0%BD%D0%B0%20%D0%BA%D0%B0%D0%BA%D1%83%D1%8E%20%D0%B4%D0%B0%D1%82%D1%83%20%D0%B5%D1%81%D1%82%D1%8C%20%D0%B1%D0%BB%D0%B8%D0%B6%D0%B0%D0%B9%D1%88%D0%B0%D1%8F%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%8C%3F"
                            target="_blank"
                            className="main__link_btn"
                        >
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
                        <a
                            href="https://wa.me/79141636665?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%9F%D0%B8%D1%88%D1%83%20%D0%B2%D0%B0%D0%BC%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%2C%20%D0%BC%D0%B5%D0%BD%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D0%BE%20%D0%BF%D0%B8%D1%82%D0%B0%D0%BD%D0%B8%D1%8E%20%D1%81%20%D1%80%D0%B0%D1%81%D1%81%D1%87%D0%B5%D1%82%D0%BE%D0%BC%20%D0%BA%D0%B0%D0%BB%D0%BE%D1%80%D0%B8%D0%B9%2C%20%D0%BF%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D0%B6%D0%B8%D1%82%D0%B5%2C%20%D0%BD%D0%B0%20%D0%BA%D0%B0%D0%BA%D1%83%D1%8E%20%D0%B4%D0%B0%D1%82%D1%83%20%D0%B5%D1%81%D1%82%D1%8C%20%D0%B1%D0%BB%D0%B8%D0%B6%D0%B0%D0%B9%D1%88%D0%B0%D1%8F%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%8C%3F"
                            target="_blank"
                            className="main__link_btn"
                        >
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
                        <a
                            href="https://wa.me/79141636665?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%9F%D0%B8%D1%88%D1%83%20%D0%B2%D0%B0%D0%BC%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%2C%20%D0%BC%D0%B5%D0%BD%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D1%80%D0%B0%D0%B7%D0%B1%D0%BE%D1%80%20%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%D0%BE%D0%B2%2C%20%D0%BF%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D0%B6%D0%B8%D1%82%D0%B5%2C%20%D0%BD%D0%B0%20%D0%BA%D0%B0%D0%BA%D1%83%D1%8E%20%D0%B4%D0%B0%D1%82%D1%83%20%D0%B5%D1%81%D1%82%D1%8C%20%D0%B1%D0%BB%D0%B8%D0%B6%D0%B0%D0%B9%D1%88%D0%B0%D1%8F%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%8C%3F"
                            target="_blank"
                            className="main__link_btn"
                        >
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
                                <a
                                    href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTg2NzMwNTY3NDQ3MDAx?igsh=azFma3FhemJkaXEy"
                                    target="_blank"
                                    className="main__link_btn"
                                >
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
