import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { fetchLogin } from '../redux/redusers/user/ActionLogin';
import { fetchRegistration } from '../redux/redusers/user/ActionRegistration';

interface LoginistrationFormProps {
    isLogin: boolean;
}

const LoginistrationForm: FC<LoginistrationFormProps> = ({ isLogin }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleRegistration = async () => {
        const data = await dispatch(fetchRegistration({ email, password }))
        if (!data) throw Error('Произошла ошибка при получении данных. Попробуйте позже');
        if (data.type === 'user/fetchRegistration/rejected') throw Error('Произошла ошибка на стороне сервера. Попробуйте позже');

        navigate('/rates');
    };

    const handleLogin = async () => {
        const data = await dispatch(fetchLogin({ email, password }))
        if (!data) throw Error('Произошла ошибка при получении данных. Попробуйте позже');
        if (data.type === 'user/fetchLogin/rejected') throw Error('Произошла ошибка на стороне сервера. Попробуйте позже');

        navigate('/exercises');
    };

    return (
        <div className="login-form">
            <div className='login-form__content'>
                <input
                    className='login-form__email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Email"
                />
                <input
                    className='login-form__password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Пароль"
                />
                <Link className='login-form__reset' to="/reset">Забыли пароль?</Link>
            </div>
            {isLogin ? (
                <button className='primary' onClick={handleLogin}>Войти</button>
            ) : (
                <button className='primary' onClick={handleRegistration}>
                    Зарегистрироваться
                </button>
            )}
        </div>
    );
};

export default LoginistrationForm;
