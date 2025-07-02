export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    snapchat: string;
    tiktok: string;
  }
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export interface ThemeFonts {
  headings: string;
  body: string;
  styled: string;
}

export interface ThemeImages {
  banner: string;
}

export interface ThemeContextType {
  colors: ThemeColors;
  fonts: ThemeFonts;
  images: ThemeImages;
  isLoading: boolean;
  error: string | null;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  tags: string[];
  height: 'tall' | 'medium' | 'short';
}