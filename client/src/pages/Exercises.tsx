import { FC } from 'react';
import ContentContainer from '../components/ContentContainer';

const Exercises: FC = () => {
    return (
        <ContentContainer className="exercises">
            <h1 className="content__title">Упражнения</h1>
            <div className="exercises__content">
                <div className="exercises__card"></div>
                <div className="exercises__card"></div>
                <div className="exercises__card"></div>
                <div className="exercises__card"></div>
                <div className="exercises__card"></div>
            </div>
        </ContentContainer>
    );
};

export default Exercises;
