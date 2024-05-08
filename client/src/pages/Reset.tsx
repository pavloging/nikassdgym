import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';
import ResetForm from '../components/ResetForm';

const Reset: FC = () => {
    return (
        <ContentContainer className="reset">
            <h1 className="not-found__title">Reset Page</h1>
            <ResetForm />
        </ContentContainer>
    );
};

export default Reset;
