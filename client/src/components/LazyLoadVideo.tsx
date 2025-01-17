import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';

interface ILazyLoadVideo {
    src: string;
    img: string;
    type: string;
    isControls: boolean;
}

const LazyLoadVideo = ({ src, img, type, isControls }: ILazyLoadVideo) => {
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    });

    return (
        <div ref={ref}>
            {inView ? (
                <video
                    className="exercise__video"
                    controls={isControls}
                    poster={img}
                    onClick={() =>
                        toast.error('У вас не активна подписка. Пожалуйста, активируйте её, чтобы упражнения отображались')
                    }
                >
                    <source src={isControls ? src : ''} type={type} />
                </video>
            ) : (
                <div className="exercise__video"></div>
            )}
        </div>
    );
};

export default LazyLoadVideo;
