import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { handleError } from '../utils/handleError';
import AuthService from '../services/AuthService';

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('');

    const handleClick = async () => {
        try {
            const data = await AuthService.reset(email);
            if (!data) throw Error('Произошла ошибка при получении данных. Попробуйте позже');
            toast.success('Сообщение было отправленно на вашу почту');
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className='reset-form'>
            <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder="Введите email"
            />
            <button className="secondary" onClick={handleClick}>
                Отправить письмо
            </button>
        </div>
    );
};

export default LoginForm;
