export const colors = {
  // Primary colors
  primary: {
    nocturne: '#0F0735',
    eclipse: '#180E4A',
    blueberry: '#2F2564',
    orchid: '#8B37EB',
    white: '#FFFFFF',
  },
  // Secondary colors
  secondary: {
    fuschia: '#CD52C4',
    periwinkle: '#7BA8FF',
    coral: '#DC6F70',
    lavender: '#D9B8FF',
    buttercream: '#F8EACF',
  },
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
  },
  // Semantic colors
  semantic: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },
  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    dark: '#121212',
  },
} as const;

export type ColorKeys = keyof typeof colors; 