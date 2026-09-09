import { FC, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { defaultRoutes, authRoutes } from './routes';
import { fetchAuth } from './redux/redusers/user/ActionAuth';
import { AppDispatch, RootState } from './redux/store';
import { storage, TOKEN_KEY } from './utils/storage';

const App: FC = () => {
    const store = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const element = useRoutes(store.isAuth ? authRoutes : defaultRoutes);

    useEffect(() => {
        if (storage.get(TOKEN_KEY)) dispatch(fetchAuth());
    }, [dispatch]);

    if (store.isLoading) {
        return <span className="loader"></span>;
    }

    return element;
};

export default App;
