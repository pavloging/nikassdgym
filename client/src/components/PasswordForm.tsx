import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils/handleError';
import { toast } from 'react-toastify';
import AuthService from '../services/AuthService';

interface IPassword {
    passwordFirst: string;
    passwordSecond: string;
}

const PasswordForm: FC = () => {
    const [password, setPassword] = useState<IPassword>({ passwordFirst: '', passwordSecond: '' });
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            const searchParams = new URLSearchParams(location.search);
            const userId = searchParams.get('userId');
            const token = searchParams.get('token');
            if (!userId || !token) throw Error('Нет данных');

            const data = await AuthService.password(userId, token, password.passwordFirst);
            if (!data) throw Error('Произошла ошибка при получении данных. Попробуйте позже');

            navigate('/');
            toast.success('Вы успешно изменили пароль');
        } catch (error) {
            handleError(error);
        }
    };

    const handlePress = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
        setPassword({ ...password, [name]: value });
    };

    const isDisabled = !(
        password.passwordFirst === password.passwordSecond &&
        password.passwordFirst.length >= 8 &&
        password.passwordSecond.length >= 8
    );

    return (
        <div className="login-form">
            <div className="login-form__content">
                <label className="login-form__label" htmlFor="passwordFirst">
                    Password
                </label>
                <input
                    className="login-form__email"
                    onChange={(e) => handlePress(e)}
                    value={password.passwordFirst}
                    id="passwordFirst"
                    name="passwordFirst"
                    type="password"
                    placeholder="Введите password"
                />

                <label className="login-form__label" htmlFor="passwordSecond">
                    Password
                </label>
                <input
                    onChange={(e) => handlePress(e)}
                    value={password.passwordSecond}
                    id="passwordSecond"
                    name="passwordSecond"
                    type="password"
                    placeholder="Введите password"
                />
            </div>
            <button className="secondary" disabled={isDisabled} onClick={handleClick}>
                Задать новый пароль
            </button>
        </div>
    );
};

export default PasswordForm;
