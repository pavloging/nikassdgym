import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <>
            <hr />
            <div className="footer">
                <h2 className="footer__title">Мои контакты</h2>
                <div className="footer__contact-block">
                    <div className="footer__contact">
                        <img className="footer__img" src="/tel.svg" alt="" />
                        <a className="footer__link" href="https://wa.me/+79141636665">
                            + 7 914 163 66 65
                        </a>
                    </div>
                    <div className="footer__contact">
                        <img className="footer__img" src="/instagram.svg" alt="" />
                        <a
                            className="footer__link"
                            href="https://www.instagram.com/nikass.d?igsh=MTRkODdydmZhNWlsYQ=="
                        >
                            Instagram
                        </a>
                    </div>
                    <div className="footer__contact">
                        <img className="footer__img" src="/youtube.svg" alt="" />
                        <a
                            className="footer__link"
                            href="https://youtube.com/@nikass.d?si=805QKxSV-zpTlBJk"
                        >
                            YouTube
                        </a>
                    </div>
                    <div>
                        <span>
                            <b>Дупина Ника Николаевна</b>
                        </span>
                        <p style={{ marginTop: '10px' }}>ИНН 270396986640</p>
                    </div>
                </div>
                <div className="footer__container">
                    <div className='footer__links'>
                            <Link to="/offerta" className="footer__policy">
                                Оферта
                            </Link>
                            <Link to="/policy" className="footer__policy">
                                Политика обработки персональных данных
                            </Link>
                            <Link to="/agreement" className="footer__policy">
                                Согласие на обработку персональных данных
                            </Link>
                    </div>
                    <p className="footer__policy">2024</p>
                </div>
            </div>
        </>
    );
};

export default Footer;
