import { useState } from 'react';
import './CookieBanner.css';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(localStorage.getItem('setCookieBanner') ? false : true);
    const [isHiding, setIsHiding] = useState(false);

    const handleAccept = () => {
        setIsHiding(true); // Запускаем анимацию скрытия
        setTimeout(() => setIsVisible(false), 300); // Удаляем элемент после анимации
        localStorage.setItem('setCookieBanner', 'true')
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={`cookie-banner ${isHiding ? 'cookie-banner--hide' : ''}`}
            data-aos="fade-bottom"
            data-aos-delay="300"
        >
            <div className="cookie-banner__content">
                <p className="cookie-banner__text">
                    Мы используем cookie-файлы для улучшения вашего опыта на сайте.
                    <br />
                    Продолжая пользоваться сайтом, вы соглашаетесь с нашей политикой
                    конфиденциальности.
                </p>
                <button
                    className="cookie-banner__button cookie-banner__button--accept"
                    onClick={handleAccept}
                >
                    Принять
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;
