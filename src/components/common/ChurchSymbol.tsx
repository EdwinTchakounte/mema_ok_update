import React from 'react';

interface ChurchSymbolProps {
  type: 'cross' | 'dove' | 'bible' | 'church' | 'praying-hands';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ChurchSymbol: React.FC<ChurchSymbolProps> = ({ 
  type, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const symbols = {
    cross: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`}>
        <path d="M13 3V11H21V13H13V21H11V13H3V11H11V3H13Z" />
      </svg>
    ),
    dove: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`}>
        <path d="M9.5 2C11.71 2 13.5 3.79 13.5 6C13.5 6.65 13.35 7.25 13.11 7.78L22 16.67L20.67 18L11.78 9.11C11.25 9.35 10.65 9.5 10 9.5C7.79 9.5 6 7.71 6 5.5S7.79 1.5 10 1.5M10 3.5C8.9 3.5 8 4.4 8 5.5S8.9 7.5 10 7.5 12 6.6 12 5.5 11.1 3.5 10 3.5M2 12L4.5 14.5L2 17L3.5 18.5L6 16L8.5 18.5L10 17L7.5 14.5L10 12L8.5 10.5L6 13L3.5 10.5L2 12Z" />
      </svg>
    ),
    bible: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`}>
        <path d="M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.68 6.5 20.68C8.45 20.68 10.55 21.1 12 22C13.35 21.15 15.8 20.68 17.5 20.68C19.15 20.68 20.85 20.9 22 21.34V6.5C20.55 5.4 18.45 5 16.5 5C14.55 5 12.45 5.4 11 6.5C9.55 5.4 7.45 5 5.5 5H6.5M7.5 7V9H9.5V7H7.5M7.5 10V12H9.5V10H7.5Z" />
      </svg>
    ),
    church: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`}>
        <path d="M18 12.22V9L12 5.5L6 9V12.22L4 13.2V21H9V15H15V21H20V13.2L18 12.22M12 7.7L16 10.3V11.4L12 9L8 11.4V10.3L12 7.7M11 2H13V4H15V6H13V8H11V6H9V4H11V2Z" />
      </svg>
    ),
    'praying-hands': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`}>
        <path d="M12.5 4C13.3 4 14 4.7 14 5.5S13.3 7 12.5 7 11 6.3 11 5.5 11.7 4 12.5 4M14.5 8.5C15.3 8.5 16 9.2 16 10S15.3 11.5 14.5 11.5 13 10.8 13 10 13.7 8.5 14.5 8.5M9.5 8.5C10.3 8.5 11 9.2 11 10S10.3 11.5 9.5 11.5 8 10.8 8 10 8.7 8.5 9.5 8.5M12 13C13.1 13 14 13.9 14 15V22H10V15C10 13.9 10.9 13 12 13Z" />
      </svg>
    )
  };

  return symbols[type];
};