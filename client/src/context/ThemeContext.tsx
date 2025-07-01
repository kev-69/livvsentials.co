import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { get } from '../lib/api';
import type { ThemeContextType } from '../types/platform';

const defaultTheme: ThemeContextType = {
  colors: {
    primary: '#4f46e5', // indigo-600
    secondary: '#1e293b', // slate-800
    accent: '#f59e0b', // amber-500
    text: '#1f2937', // gray-800
  },
  fonts: {
    headings: 'Montserrat, sans-serif',
    body: 'Inter, sans-serif',
  },
  images: {
    banner: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  },
  isLoading: true,
  error: null,
};

export const ThemeContext = createContext<ThemeContextType>(defaultTheme);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeContextType>(defaultTheme);

  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        // Try to load from localStorage first for immediate rendering
        const cachedTheme = localStorage.getItem('themeSettings');
        if (cachedTheme) {
          const parsedTheme = JSON.parse(cachedTheme);
          setTheme({
            ...defaultTheme,
            ...parsedTheme,
            isLoading: false,
          });
          applyThemeToDocument(parsedTheme);
        }

        // Fetch appearance settings from the backend
        const response = await get('/settings/appearance');
        
        // Map the backend response to our theme structure
        const themeData = {
          colors: {
            primary: response.data.settingValue.primaryColor || defaultTheme.colors.primary,
            secondary: response.data.settingValue.secondaryColor || defaultTheme.colors.secondary,
            accent: response.data.settingValue.accentColor || defaultTheme.colors.accent,
            text: response.data.settingValue.textColor || defaultTheme.colors.text,
          },
          fonts: {
            headings: response.data.settingValue.fonts.heading || defaultTheme.fonts.headings,
            body: response.data.settingValue.fonts.body || defaultTheme.fonts.body,
          },
          images: {
            banner: response.data.settingValue.siteBanner || defaultTheme.images.banner,
          },
          isLoading: false,
          error: null,
        };

        // Update state with the new theme
        setTheme(themeData);
        
        // Cache the theme in localStorage
        localStorage.setItem('themeSettings', JSON.stringify(themeData));
        
        // Apply CSS variables
        applyThemeToDocument(themeData);
        
      } catch (error) {
        console.error('Failed to fetch theme settings:', error);
        setTheme({
          ...defaultTheme,
          isLoading: false,
          error: 'Failed to load theme settings',
        });

        // Apply default theme
        applyThemeToDocument(defaultTheme);
      }
    };

    fetchThemeSettings();
  }, []);

  // Function to apply theme to document root (as CSS variables)
  const applyThemeToDocument = (themeData: any) => {
    const root = document.documentElement;
    
    // Apply colors
    root.style.setProperty('--color-primary', themeData.colors?.primary || defaultTheme.colors.primary);
    root.style.setProperty('--color-secondary', themeData.colors?.secondary || defaultTheme.colors.secondary);
    root.style.setProperty('--color-accent', themeData.colors?.accent || defaultTheme.colors.accent);
    root.style.setProperty('--color-text', themeData.colors?.text || defaultTheme.colors.text);
    
    // Apply fonts
    root.style.setProperty('--font-headings', themeData.fonts?.headings || defaultTheme.fonts.headings);
    root.style.setProperty('--font-body', themeData.fonts?.body || defaultTheme.fonts.body);
    
    // Dynamically load Google Fonts if needed
    const headingFont = themeData.fonts?.headings?.split(',')[0].trim() || 'Montserrat';
    const bodyFont = themeData.fonts?.body?.split(',')[0].trim() || 'Inter';
    
    if (headingFont !== 'system-ui' && bodyFont !== 'system-ui') {
      // Remove any existing font link to avoid duplicates
      const existingLink = document.getElementById('google-fonts');
      if (existingLink) {
        existingLink.remove();
      }
      
      const link = document.createElement('link');
      link.id = 'google-fonts';
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${headingFont.replace(' ', '+')}&family=${bodyFont.replace(' ', '+')}&display=swap`;
      document.head.appendChild(link);
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};