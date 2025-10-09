import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TiltProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  perspective?: number;
  scale?: number;
  transitionDuration?: number;
  transitionEasing?: string;
}

export const Tilt = React.forwardRef<HTMLDivElement, TiltProps>(
  ({
    children,
    tiltMaxAngleX = 20,
    tiltMaxAngleY = 20,
    perspective = 1000,
    scale = 1.05,
    transitionDuration = 400,
    transitionEasing = 'cubic-bezier(0.03, 0.98, 0.52, 0.99)',
    className,
    ...props
  }, ref) => {
    const tiltRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const element = tiltRef.current;
      if (!element) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -tiltMaxAngleX;
        const rotateY = ((x - centerX) / centerX) * tiltMaxAngleY;

        element.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      };

      const handleMouseLeave = () => {
        element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      };

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [tiltMaxAngleX, tiltMaxAngleY, perspective, scale]);

    return (
      <div
        ref={tiltRef}
        className={cn('transform-gpu', className)}
        style={{
          transition: `transform ${transitionDuration}ms ${transitionEasing}`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Tilt.displayName = 'Tilt';