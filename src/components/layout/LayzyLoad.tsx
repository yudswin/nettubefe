import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazyLoadProps {
    children: ReactNode;
    placeholder?: ReactNode;
    className?: string;
}

const LazyLoad = ({
    children,
    placeholder = <div className="min-h-40 flex items-center justify-center"><div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div></div>,
    className = ""
}: LazyLoadProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px',
                threshold: 0.1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return <div ref={ref} className={className}>{isVisible ? children : placeholder}</div>;
};

export default LazyLoad;