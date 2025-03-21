
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  animation?: 'fade-in' | 'fade-up' | 'scale-in' | 'blur-in';
  once?: boolean;
  threshold?: number;
  children: React.ReactNode;
}

export function AnimatedSection({
  delay = 0,
  animation = 'fade-up',
  once = true,
  threshold = 0.1,
  className,
  children,
  ...props
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);

  const animationClass = isVisible ? `animate-${animation}` : 'opacity-0';
  const delayStyle = delay ? { animationDelay: `${delay}ms`, style: { animationFillMode: 'forwards' } } : {};

  return (
    <div
      ref={ref}
      className={cn(animationClass, className)}
      style={{ ...delayStyle, animationFillMode: 'forwards' }}
      {...props}
    >
      {children}
    </div>
  );
}

export default AnimatedSection;
