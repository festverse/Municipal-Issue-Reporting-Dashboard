import { useState, useEffect, useRef } from 'react';

export default function ScrollReveal({ children, direction = 'up', delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const baseStyle = 'transition-all duration-1000 ease-out';
  
  const getDirectionClasses = () => {
    switch (direction) {
      case 'up': return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12';
      case 'down': return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12';
      case 'left': return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12';
      case 'right': return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12';
      case 'scale': return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90';
      default: return isVisible ? 'opacity-100' : 'opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      className={`${baseStyle} ${getDirectionClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
