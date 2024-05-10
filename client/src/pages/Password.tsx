import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';
import PasswordForm from '../components/PasswordForm';

const Password: FC = () => {
    return (
        <ContentContainer className="password">
            <h1 className="content__title">Новый пароль</h1>
            <PasswordForm />
        </ContentContainer>
    );
};

export default Password;
