import { FC, useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { defaultRoutes, authRoutes } from './routes';
import { fetchAuth } from './redux/redusers/user/ActionAuth';
import { AppDispatch, RootState } from './redux/store';
import { storage, TOKEN_KEY } from './utils/storage';
import { logEvent } from './utils/clientLog';

const App: FC = () => {
    const store = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const element = useRoutes(store.isAuth ? authRoutes : defaultRoutes);

    const { pathname } = useLocation();

    useEffect(() => {
        if (storage.get(TOKEN_KEY)) dispatch(fetchAuth());
    }, [dispatch]);

    useEffect(() => {
        logEvent('page', { path: pathname, auth: store.isAuth });
    }, [pathname, store.isAuth]);

    if (store.isLoading) {
        return <span className="loader"></span>;
    }

    return element;
};

export default App;
