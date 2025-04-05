import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/pagination';
import './style/index.css';
import './style/ui.css';
import './style/media.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
            <ToastContainer />
        </Provider>
    </BrowserRouter>
);
