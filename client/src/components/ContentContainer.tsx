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
            <main className={`${className} content`}>{children}</main>
            <Footer />
        </>
    );
};

export default ContentContainer;
