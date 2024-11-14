import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';
import LoginistrationForm from '../components/LoginistrationForm';

const Login: FC = () => {
    return (
        <ContentContainer className="login">
            <h1 className="content__title">Вход</h1>
            <LoginistrationForm isLogin={true} />
        </ContentContainer>
    );
};

export default Login;
