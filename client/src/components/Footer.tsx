import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <>
            <hr />
            <div className="footer">
                <h2 className="footer__title">Мои контакты</h2>
                <div className='footer__container'>
                    <Link to="/policy" className="footer__policy">
                        Политика конфиденциальности
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Footer;
