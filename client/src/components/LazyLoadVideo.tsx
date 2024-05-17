import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface ILazyLoadVideo {
    src: string;
    type: string;
    index: number;
}

const LazyLoadVideo = ({ src, type, index }: ILazyLoadVideo) => {

    console.log(index)

    useEffect(() => {
        const videoElement = document.getElementById('0') as HTMLVideoElement;
        if(!videoElement) return

        videoElement.addEventListener('loadeddata', () => {
            //Video should now be loaded but we can add a second check

            if (videoElement.readyState >= 3) {
                console.log('hi')
                //your code goes here
            }
        });
    }, []);

    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true
      });
      
    return (
        <div ref={ref}>
                {inView ? <video className="exercise__video" controls><source src={src} type={type} /></video> : <div>СКЕЛЕТОН</div>}
        </div>
    );
};

export default LazyLoadVideo;
