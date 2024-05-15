import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { fetchLogout } from '../redux/redusers/user/ActionLogout';
import { useEffect, useState } from 'react';

const Header = () => {
    const [isBurger, setBurger] = useState(false);
    const [isOpenBurger, setOpenBurger] = useState(false);

    const store = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const { pathname } = useLocation();

    const main = `${
        pathname === '/' || pathname === '/main' ? 'secondary' : 'primary header__primary'
    }`;
    const exercises = `${
        pathname.includes('/exercises') ? 'secondary' : 'primary header__primary'
    }`;
    const rates = `${pathname === '/rates' ? 'secondary' : 'primary header__primary'}`;
    // if (!store.user.activateRatesExp)
    //     return <p className="txt-center">У вас не активна подписка</p>;
    // if (store.user.activateRatesExp >= new Date())
    //     return <p className="txt-center">У вас не активна подписка</p>;
    // const activate =
    //     store.user.activateRatesExp && store.user.activateRatesExp <= new Date()
    //         ? 'Подписка активна'
    //         : 'Подписка не активна';

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth <= 768) setBurger(true);
            else setBurger(false);
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); //

    const Burger = () => {
        return (
            <div className="burger__page">
                <Link to="/">Главная</Link>
                <Link to="/exercises">Упражнения</Link>
                <Link to="/rates">Тарифы</Link>

                {store.isAuth && (
                    <div className="header__logout-block">
                        <button onClick={() => dispatch(fetchLogout())} className="img">
                            <img className="header__logout" src="/logout.svg" alt="Logout" />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="header">
                {!isBurger ? (
                    <div className="header__content">
                        <Link to="/">
                            <button className={main}>Главная</button>
                        </Link>
                        <Link to="/exercises">
                            <button className={exercises}>Упражнения</button>
                        </Link>
                        <Link to="/rates">
                            <button className={rates}>Тарифы</button>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <input
                            onClick={() => setOpenBurger((prev) => !prev)}
                            type="checkbox"
                            id="burger-checkbox"
                            className="burger-checkbox"
                        />
                        <label className="burger" htmlFor="burger-checkbox"></label>
                    </div>
                )}
                <div className="header__payment-block">
                    <div className="header__payment">
                        {store.user.isActivatedRates ? (
                            <button className="primary header__btn-fix">Подписка активна</button>
                        ) : (
                            <button className="secondary header__btn-fix">
                                Подписка не активна
                            </button>
                        )}
                    </div>
                    {store.isAuth && !isBurger && (
                        <div className="header__logout-block">
                            <button onClick={() => dispatch(fetchLogout())} className="img">
                                <img className="header__logout" src="/logout.svg" alt="Logout" />
                            </button>
                        </div>
                    )}
                </div>
                {isBurger && <div></div>}
            </div>
            {isOpenBurger && <Burger />}
            <hr />
        </>
    );
};

export default Header;
