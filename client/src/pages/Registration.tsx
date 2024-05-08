import { FC } from 'react';
import LoginistrationForm from '../components/LoginistrationForm';
import ContentContainer from '../components/ContentContainer';

const Registration: FC = () => {
    return (
        <ContentContainer className="registration">
            <h1 className="content__title">Регистрация</h1>
            <LoginistrationForm isLogin={false} />
        </ContentContainer>
    );
};

export default Registration;
