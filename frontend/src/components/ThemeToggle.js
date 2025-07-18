import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <div className="toggle-track">
        <div className={`toggle-thumb ${theme}`}>
          <span className="theme-icon">
            {theme === 'dark' ? '🌙' : '☀️'}
          </span>
        </div>
      </div>
      <span className="theme-label">
        {theme === 'dark' ? 'Dark' : 'Light'} Mode
      </span>
    </button>
  );
};

export default ThemeToggle;