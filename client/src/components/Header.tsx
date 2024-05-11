import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { fetchLogout } from '../redux/redusers/user/ActionLogout';

const Header = () => {
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
    return (
        <>
            <div className="header">
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
                <div className="header__payment-block">
                    <div className="header__payment">
                        {store.user.isActivatedRates ? <button className="primary">Подписка активна</button> : <button className="secondary">Подписка не активна</button>}
                    </div>
                    {store.isAuth && (
                        <div className="header__logout-block">
                            <button onClick={() => dispatch(fetchLogout())} className="img">
                                <img className="header__logout" src="/logout.svg" alt="Logout" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <hr />
        </>
    );
};

export default Header;
