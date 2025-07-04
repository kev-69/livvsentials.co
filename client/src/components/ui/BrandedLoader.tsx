import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface BrandedLoaderProps {
  className?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  speed?: 'slow' | 'normal' | 'fast';
  animation?: 'bounce' | 'fade' | 'wave' | 'typing';
  text?: string;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({
  className,
  textColor = 'text-primary',
  size = 'md',
  speed = 'normal',
  animation = 'bounce',
  text = 'LIVSSENTIALS',
}) => {
  const letters = text.split('');
  
  // Font size based on the size prop
  const fontSize = {
    sm: 'text-lg md:text-xl',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
  }[size];
  
  // Animation speed based on the speed prop
  const animationDuration = {
    slow: 2,
    normal: 1.5,
    fast: 1,
  }[speed];
  
  // Calculate staggered delay for each letter
  const getDelay = (index: number) => {
    return (index * (animation === 'typing' ? 0.15 : 0.1)).toFixed(1);
  };
  
  // For typing animation, we need to track which letters are visible
  const [visibleCount, setVisibleCount] = useState(0);
  
  useEffect(() => {
    if (animation === 'typing') {
      // Reset when changing to typing animation
      setVisibleCount(0);
      
      // Show letters one by one
      const interval = setInterval(() => {
        setVisibleCount(prev => {
          if (prev < letters.length) {
            return prev + 1;
          } else {
            // After showing all letters, pause and then reset
            clearInterval(interval);
            setTimeout(() => {
              setVisibleCount(0);
              // Restart the animation
              setTimeout(() => {
                if (document.hasFocus()) { // Only restart if page is focused
                  setVisibleCount(0);
                }
              }, 500); // Small pause before restart
            }, 1500); // Pause at full text
            return prev;
          }
        });
      }, 150); // Time between letters
      
      return () => clearInterval(interval);
    }
  }, [animation, letters.length]);
  
  // Generate animation class name
  const getAnimationClass = () => {
    switch (animation) {
      case 'bounce':
        return 'animate-brand-bounce';
      case 'fade':
        return 'animate-brand-fade';
      case 'wave':
        return 'animate-brand-wave';
      case 'typing':
        return '';
      default:
        return 'animate-brand-bounce';
    }
  };
  
  return (
    <div className={cn('flex items-center justify-center gap-1 md:gap-2', className)}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={cn(
            'inline-block font-medium tracking-widest', 
            fontSize,
            textColor,
            animation !== 'typing' && getAnimationClass(),
            animation === 'typing' && 'opacity-0 transition-opacity duration-200',
            animation === 'typing' && index < visibleCount && 'opacity-100',
          )}
          style={
            animation !== 'typing' 
              ? {
                  animationDelay: `${getDelay(index)}s`,
                  animationDuration: `${animationDuration}s`,
                  animationIterationCount: 'infinite',
                  animationFillMode: 'forwards',
                }
              : {}
          }
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Bounce Animation */
        @keyframes brand-bounce {
          0%, 20% {
            transform: translateY(0);
            opacity: 0.3;
          }
          40% {
            transform: translateY(-20px);
            opacity: 1;
          }
          50% {
            transform: translateY(0);
            opacity: 0.8;
          }
          60% {
            transform: translateY(-7px);
            opacity: 1;
          }
          80%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
        }
        
        /* Fade Animation */
        @keyframes brand-fade {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        /* Wave Animation */
        @keyframes brand-wave {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          25% {
            transform: translateY(-15px);
            opacity: 1;
          }
          50% {
            transform: translateY(0);
            opacity: 0.5;
          }
          75% {
            transform: translateY(15px);
            opacity: 1;
          }
        }
        
        .animate-brand-bounce {
          animation-name: brand-bounce;
        }
        
        .animate-brand-fade {
          animation-name: brand-fade;
        }
        
        .animate-brand-wave {
          animation-name: brand-wave;
        }
      `
      }} />
    </div>
  );
};

// Full-page loading component that uses the branded loader
export const FullPageLoader: React.FC<{
  className?: string;
  animation?: 'bounce' | 'fade' | 'wave' | 'typing';
  message?: string;
}> = ({ className, animation = 'bounce', message = 'Loading...' }) => {
  return (
    <div className={cn('fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50', className)}>
      <BrandedLoader size="lg" animation={animation} className='custom' />
      <p className="mt-6 text-muted-foreground">{message}</p>
    </div>
  );
};