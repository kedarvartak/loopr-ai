import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Logo: React.FC = () => {
  const { theme } = useTheme();

  return (
    <img 
      src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'} 
      alt="Penta" 
      className="h-8" 
    />
  );
};

export default Logo; 