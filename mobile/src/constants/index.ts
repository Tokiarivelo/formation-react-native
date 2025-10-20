// Colors
export const Colors = {
  primary: '#007AFF',
  secondary: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9F9F9',
    100: '#F2F2F2',
    200: '#E5E5E5',
    300: '#D1D1D1',
    400: '#B0B0B0',
    500: '#8E8E93',
    600: '#6D6D70',
    700: '#48484A',
    800: '#3A3A3C',
    900: '#2C2C2E',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#F9F9F9',
  },
  text: {
    primary: '#1C1C1E',
    secondary: '#6D6D70',
    tertiary: '#8E8E93',
    inverse: '#FFFFFF',
  },
  border: {
    light: '#E5E5E5',
    medium: '#D1D1D1',
    dark: '#B0B0B0',
  },
} as const;

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Font Sizes
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Font Weights
export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.API_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Formation React Native',
  VERSION: '1.0.0',
} as const;
