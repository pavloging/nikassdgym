import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';
import ResetForm from '../components/ResetForm';

const Reset: FC = () => {
    return (
        <ContentContainer className="reset">
            <h1 className="content__title">Восстановить пароль</h1>
            <ResetForm />
        </ContentContainer>
    );
};

export default Reset;
