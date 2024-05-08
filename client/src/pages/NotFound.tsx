import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';

const NotFound: FC = () => {
    return (
        <ContentContainer className="not-found">
            <h1 className="content__title">Page Not Found</h1>
            <div>
                <img src="/not-found.webp" alt="Git Not Found" />
            </div>
        </ContentContainer>
    );
};

export default NotFound;
