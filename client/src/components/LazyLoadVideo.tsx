import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface ILazyLoadVideo {
    src: string;
    type: string;
    index: number;
}

const LazyLoadVideo = ({ src, type }: ILazyLoadVideo) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [posterSrc, setPosterSrc] = useState('');

    useEffect(() => {
        const videoElement = document.getElementById('0') as HTMLVideoElement;
        if (!videoElement) return;

        videoElement.addEventListener('loadeddata', () => {
            //Video should now be loaded but we can add a second check

            if (videoElement.readyState >= 3) {
                console.log('hi');
                //your code goes here
            }
        });
    }, []);

    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    });


    useEffect(() => {
        const capturePoster = () => {
            const video = videoRef.current;
            if (!video) return;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setPosterSrc(canvas.toDataURL('image/jpeg'));
        };

        const video = videoRef.current;
        if (!video) return;
        video.addEventListener('loadeddata', capturePoster);

        return () => {
            video.removeEventListener('loadeddata', capturePoster);
        };
    }, [src]);

    return (
        <div ref={ref}>
            {inView ? (
                <video className="exercise__video" controls ref={videoRef} poster={posterSrc}>
                    <source src={src} type={type} />
                </video>
            ) : (
                <div className="exercise__video"></div>
            )}
        </div>
    );
};

export default LazyLoadVideo;
