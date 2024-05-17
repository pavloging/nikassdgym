import { useState, useEffect, useRef } from 'react';

interface ILazyLoadVideo {
    src: string;
    type: string;
}

const LazyLoadVideo = ({ src, type }: ILazyLoadVideo) => {
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const currentVideoRef = videoRef.current; // Capture the current value

        if (currentVideoRef) {
            observer.observe(currentVideoRef);
        }

        return () => {
            if (currentVideoRef) {
                // Use the captured value in the cleanup
                observer.unobserve(currentVideoRef);
            }
        };
    }, []); // Ensure the dependency array is correct

    return (
        <div ref={videoRef}>
            {isVisible ? (
                <video className="exercise__video" controls autoPlay loop muted>
                    <source src={src} type={type} />
                </video>
            ) : (
                <div className="video-placeholder">Загрузка видео...</div>
            )}
        </div>
    );
};

export default LazyLoadVideo;
