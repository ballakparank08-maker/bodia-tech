import React from 'react';

interface BodiaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  layout?: 'horizontal' | 'stacked';
}

export const BodiaLogo: React.FC<BodiaLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const imageSize = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-24',
    xl: 'h-32',
  }[size];

  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${className}`}
      aria-label="Bodia Tech"
    >
      <img src="/logo.png" alt="Bodia Tech Logo" className={`${imageSize} w-auto object-contain drop-shadow-lg`} />
    </div>
  );
};

