import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  dark: {
    name: 'dark',
    colors: {
      // Background gradients
      primaryBg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%)',
      welcomeBg: 'radial-gradient(ellipse at center, rgba(169, 169, 169, 0.15) 0%, rgba(169, 169, 169, 0.05) 40%, transparent 70%), linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%)',
      
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      textFaded: 'rgba(255, 255, 255, 0.4)',
      
      // Accent colors - Purple/Cyan gradient theme
      accent: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
      accentSolid: '#8b5cf6',
      accentSecondary: '#06b6d4',
      accentHover: 'linear-gradient(45deg, #7c3aed, #0891b2)',
      
      // Message colors
      userMessage: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      userMessageBorder: 'rgba(139, 92, 246, 0.3)',
      botMessage: 'rgba(255, 255, 255, 0.1)',
      botMessageBorder: 'rgba(255, 255, 255, 0.2)',
      
      // UI elements
      sidebarBg: 'rgba(0, 0, 0, 0.4)',
      chatBg: 'rgba(0, 0, 0, 0.1)',
      searchBarBg: 'rgba(0, 0, 0, 0.4)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderHover: 'rgba(255, 255, 255, 0.3)',
      
      // Status colors
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    }
  },
  light: {
    name: 'light',
    colors: {
      // Background gradients
      primaryBg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      welcomeBg: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      
      // Text colors
      textPrimary: '#1e293b',
      textSecondary: '#475569',
      textMuted: '#64748b',
      textFaded: '#94a3b8',
      
      // Accent colors - Purple/Cyan gradient theme
      accent: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
      accentSolid: '#8b5cf6',
      accentSecondary: '#06b6d4',
      accentHover: 'linear-gradient(45deg, #7c3aed, #0891b2)',
      
      // Message colors
      userMessage: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      userMessageBorder: 'rgba(139, 92, 246, 0.3)',
      botMessage: 'rgba(255, 255, 255, 0.8)',
      botMessageBorder: 'rgba(0, 0, 0, 0.1)',
      
      // UI elements
      sidebarBg: 'rgba(255, 255, 255, 0.9)',
      chatBg: 'rgba(255, 255, 255, 0.5)',
      searchBarBg: 'rgba(255, 255, 255, 0.8)',
      buttonBg: 'rgba(0, 0, 0, 0.1)',
      buttonHover: 'rgba(0, 0, 0, 0.15)',
      border: 'rgba(0, 0, 0, 0.1)',
      borderHover: 'rgba(0, 0, 0, 0.2)',
      
      // Status colors
      success: '#059669',
      error: '#dc2626',
      warning: '#d97706',
      info: '#2563eb',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('rizzTheme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('rizzTheme', currentTheme);
    // Apply theme to document root for CSS custom properties
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    toggleTheme,
    setTheme: setCurrentTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};