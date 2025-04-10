import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { fetchLogin } from '../redux/redusers/user/ActionLogin';
import { fetchRegistration } from '../redux/redusers/user/ActionRegistration';
import CustomCheckbox from './CustomCheckbox';

interface LoginistrationFormProps {
    isLogin: boolean;
}

const LoginistrationForm: FC<LoginistrationFormProps> = ({ isLogin }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isShowPassword, setShowPassword] = useState<boolean>(false);

    const [isCheckedOfferta, setIsCheckedOfferta] = useState(false);
    const [isCheckedPolicy, setIsCheckedPolicy] = useState(false);

    const handleRegistration = async () => {
        const data = await dispatch(fetchRegistration({ email, password }));
        if (!data) throw Error('Произошла ошибка при получении данных. Попробуйте позже');
        if (data.type === 'user/fetchRegistration/rejected')
            throw Error('Произошла ошибка на стороне сервера. Попробуйте позже');

        navigate('/subscription');
    };

    const handleLogin = async () => {
        const data = await dispatch(fetchLogin({ email, password }));
        if (!data) throw Error('Произошла ошибка при получении данных. Попробуйте позже');
        if (data.type === 'user/fetchLogin/rejected')
            throw Error('Произошла ошибка на стороне сервера. Попробуйте позже');

        navigate('/exercises');
    };

    const isDisabled = !(isCheckedOfferta && isCheckedPolicy);
    return (
        <div className="login-form">
            <div className="login-form__content">
                <label className="login-form__label" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    className="login-form__email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Введите email"
                />

                <label className="login-form__label" htmlFor="password">
                    Password
                </label>
                <div className="login-form__password-block">
                    <input
                        id="password"
                        name="password"
                        className="login-form__password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type={isShowPassword ? 'text' : 'password'}
                        placeholder="Введите пароль"
                    />
                    <button onClick={() => setShowPassword((prev) => !prev)} className="img">
                        <img className="login-form__img" src="/eyes.svg" alt="" />
                    </button>
                </div>
                <div className="login-form__link-block">
                    {isLogin ? (
                        <Link className="login-form__link" to="/registration">
                            Зарегистрироваться
                        </Link>
                    ) : (
                        <Link className="login-form__link" to="/login">
                            Войти
                        </Link>
                    )}
                    {isLogin && (
                        <Link className="login-form__link" to="/reset">
                            Забыли пароль?
                        </Link>
                    )}
                </div>
                <CustomCheckbox isChecked={isCheckedOfferta} setIsChecked={setIsCheckedOfferta}>
                    Ознакомлен и согласен с <Link to={'/offerta'}>публичной офертой</Link>
                </CustomCheckbox>
                <CustomCheckbox isChecked={isCheckedPolicy} setIsChecked={setIsCheckedPolicy}>
                    Даю <Link to={'/agreement'}>согласие</Link> на обработку персональных данных в
                    соответствии с{' '}
                    <Link to={'/policy'}>политикой обработки персональных данных</Link>
                </CustomCheckbox>
            </div>

            {isLogin ? (
                <button className="login__btn" onClick={handleLogin} disabled={isDisabled}>
                    Войти
                </button>
            ) : (
                <button className="login__btn" onClick={handleRegistration} disabled={isDisabled}>
                    Зарегистрироваться
                </button>
            )}
        </div>
    );
};

export default LoginistrationForm;
