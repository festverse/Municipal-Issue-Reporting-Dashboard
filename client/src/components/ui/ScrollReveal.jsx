import { useState, useEffect, useRef } from 'react';

export default function ScrollReveal({ children, direction = 'up', delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [instantReveal, setInstantReveal] = useState(false);
  const ref = useRef(null);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

  useEffect(() => {
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const currentScrollY = window.scrollY;
          // If scrolling upwards, reveal instantly without animation
          if (currentScrollY < lastScrollY.current || entry.boundingClientRect.top < 100) {
            setInstantReveal(true);
          }
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
        lastScrollY.current = window.scrollY;
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getClasses = () => {
    if (instantReveal) {
      return 'opacity-100 translate-y-0 translate-x-0 scale-100 transition-none';
    }
    const baseStyle = 'transition-all duration-1000 ease-out';
    switch (direction) {
      case 'up': return `${baseStyle} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`;
      case 'down': return `${baseStyle} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'}`;
      case 'left': return `${baseStyle} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`;
      case 'right': return `${baseStyle} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`;
      case 'scale': return `${baseStyle} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`;
      default: return `${baseStyle} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  return (
    <div
      ref={ref}
      className={`${getClasses()} ${className}`}
      style={{ transitionDelay: instantReveal ? '0ms' : `${delay}ms` }}
    >
      {children}
    </div>
  );
}
