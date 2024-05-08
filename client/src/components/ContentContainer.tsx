import Footer from './Footer';
import Header from './Header';

type ContentContainerProps = {
    className: string;
    children: React.ReactNode;
};

const ContentContainer: React.FC<ContentContainerProps> = ({ className, children }) => {
    return (
        <>
            <Header />
            <div className={`${className} content`}>{children}</div>
            <Footer />
        </>
    );
};

export default ContentContainer;
