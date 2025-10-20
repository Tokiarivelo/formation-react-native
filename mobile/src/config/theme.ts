import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../constants';

export const theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  fontSizes: FontSizes,
  fontWeights: FontWeights,
  
  // Common styles
  shadows: {
    small: {
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
} as const;

export type Theme = typeof theme;
