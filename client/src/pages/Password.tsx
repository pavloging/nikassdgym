import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';
import PasswordForm from '../components/PasswordForm';

const Password: FC = () => {
    return (
        <ContentContainer className="Password">
            <h1 className="content__title">Password Page</h1>
            <PasswordForm />
        </ContentContainer>
    );
};

export default Password;
