import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="footer__name-link">
                <div>
                    <span className="footer__title">Ника Дупина</span>
                    <br />
                    <span className="footer__subtitle">Онлайн тренер</span>
                </div>
                <div className="footer__social-media">
                    <a href="https://t.me/nikaklubnika27" target="_blank">
                        <img
                            className="footer__social-media_img"
                            src="/icons/telegram.svg"
                            alt=""
                        />
                    </a>
                    <a href="https://wa.me/+79141636665" target="_blank">
                        <img
                            className="footer__social-media_img"
                            src="/icons/whatsapp.svg"
                            alt=""
                        />
                    </a>
                    <a href="https://t.me/nikaklubnika27" target="_blank">
                        <img
                            className="footer__social-media_img"
                            src="/icons/instagram.svg"
                            alt=""
                        />
                    </a>
                </div>
            </div>

            <div className="footer__block-navigation">
                <span className="footer__navigation_title">
                    <b>Навигация</b>
                </span>
                <span className="footer__navigation_option">Обо мне</span>
                <span className="footer__navigation_option">Преймущества</span>
                <span className="footer__navigation_option">Кому подходят онлайн тренеровки</span>
                <span className="footer__navigation_option">Результаты подопечных</span>
                <span className="footer__navigation_option">Этапы работы</span>
                <span className="footer__navigation_option">Тарифы</span>
                <span className="footer__navigation_option">Питание</span>
            </div>

            <div className="footer__block-data">
                <span className="footer__data_title">
                    <b>Дупина Ника Николаевна</b>
                </span>
                <span className="footer__data_option">ИНН 270396986640</span>
            </div>
            <div className="footer__block-link">
                <Link className="footer__link_option" to="/offerta">
                    Оферта
                </Link>
                <Link className="footer__link_option" to="/policy">
                    Политика обработки персональных данных
                </Link>
                <Link className="footer__link_option" to="/agreement">
                    Согласие на обработку персональных данных
                </Link>

                <br />
                <br />
                <div className="footer__block-creator">
                    <span className="footer__creator">
                        Дизайн разработан{' '}
                        <a className="footer__creator_link" href="https://t.me/diupin">
                            @diupin
                        </a>
                    </span>
                    <span className="footer__creator">
                        Сайт разработан{' '}
                        <a className="footer__creator_link" href="https://t.me/pavloging">
                            @pavloging
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
