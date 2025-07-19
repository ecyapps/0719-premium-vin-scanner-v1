/**
 * @fileoverview Design Tokens
 * @description Centralized design tokens for consistent styling across the app
 * @related All UI components and screens use these tokens
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
  // Brand Colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4A9EFF',
  
  secondary: '#000000',
  secondaryLight: '#333333',
  
  // Semantic Colors
  success: '#00C851',
  successDark: '#00A142',
  successLight: '#4CAF50',
  
  warning: '#FFC107',
  warningDark: '#FF9800',
  warningLight: '#FFEB3B',
  
  error: '#F44336',
  errorDark: '#D32F2F',
  errorLight: '#FF4444',
  
  info: '#2196F3',
  infoDark: '#1976D2',
  infoLight: '#64B5F6',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray Scale
  gray: {
    50: '#F8F9FA',
    100: '#F0F0F0',
    200: '#E5E5E5',
    300: '#CCCCCC',
    400: '#999999',
    500: '#666666',
    600: '#333333',
    700: '#2A2A2A',
    800: '#1A1A1A',
    900: '#000000',
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#E5E5E5',
    overlay: 'rgba(0, 0, 0, 0.2)',
    overlayDark: 'rgba(0, 0, 0, 0.4)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Surface Colors (with alpha)
  surface: {
    primary: 'rgba(255, 255, 255, 1)',
    secondary: 'rgba(248, 249, 250, 1)',
    overlay: 'rgba(255, 255, 255, 0.9)',
    modal: 'rgba(255, 255, 255, 0.95)',
    card: 'rgba(255, 255, 255, 0.8)',
    input: 'rgba(255, 255, 255, 0.15)',
    disabled: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Status/State Colors with Backgrounds
  state: {
    success: {
      text: '#00C851',
      background: '#E8F5E8',
      border: '#00C851',
    },
    warning: {
      text: '#FF9800',
      background: '#FFF3E0',
      border: '#FF9800',
    },
    error: {
      text: '#F44336',
      background: '#FFEBEE',
      border: '#F44336',
    },
    info: {
      text: '#2196F3',
      background: '#E3F2FD',
      border: '#2196F3',
    },
    primary: {
      text: '#007AFF',
      background: '#E8F4FD',
      border: '#007AFF',
    },
  },
  
  // Scanning State Colors
  scanning: {
    idle: {
      border: 'rgba(255, 255, 255, 0.6)',
      background: 'rgba(0, 0, 0, 0.1)',
      text: 'white',
    },
    scanning: {
      border: '#FFC107',
      background: 'rgba(255, 193, 7, 0.1)',
      text: '#FFC107',
    },
    detecting: {
      border: '#2196F3',
      background: 'rgba(33, 150, 243, 0.1)',
      text: '#2196F3',
    },
    success: {
      border: '#4CAF50',
      background: 'rgba(76, 175, 80, 0.1)',
      text: '#4CAF50',
    },
    error: {
      border: '#F44336',
      background: 'rgba(244, 67, 54, 0.1)',
      text: '#F44336',
    },
  },
} as const;

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    default: 'System',
    monospace: 'monospace',
  },
  
  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 24,
    '4xl': 28,
    '5xl': 36,
    '6xl': 48,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: 'bold' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 16,
    base: 20,
    relaxed: 24,
    loose: 32,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

// =============================================================================
// SPACING TOKENS
// =============================================================================

export const spacing = {
  // Base spacing scale
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
  6: 12,
  7: 14,
  8: 16,
  9: 18,
  10: 20,
  12: 24,
  14: 28,
  16: 32,
  20: 40,
  24: 48,
  28: 56,
  32: 64,
  
  // Semantic spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
  
  // Component-specific spacing
  component: {
    // Card spacing
    cardPadding: {
      sm: 12,
      md: 16,
      lg: 24,
    },
    cardMargin: {
      sm: 8,
      md: 16,
      lg: 20,
    },
    
    // Button spacing
    buttonPadding: {
      sm: { vertical: 8, horizontal: 12 },
      md: { vertical: 12, horizontal: 16 },
      lg: { vertical: 16, horizontal: 24 },
      xl: { vertical: 20, horizontal: 32 },
    },
    
    // Container spacing
    container: {
      padding: 20,
      margin: 24,
    },
    
    // Section spacing
    section: {
      margin: 32,
      padding: 24,
    },
  },
} as const;

// =============================================================================
// BORDER RADIUS TOKENS
// =============================================================================

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
  
  // Component-specific radii
  component: {
    button: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    card: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    badge: {
      sm: 6,
      md: 8,
      lg: 12,
    },
    modal: 20,
    input: 12,
  },
} as const;

// =============================================================================
// SHADOW TOKENS
// =============================================================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Component-specific shadows
  component: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    modal: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },
} as const;

// =============================================================================
// OPACITY TOKENS
// =============================================================================

export const opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  15: 0.15,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
} as const;

// =============================================================================
// ANIMATION TOKENS
// =============================================================================

export const animation = {
  duration: {
    fast: 150,
    base: 200,
    slow: 300,
    slower: 500,
  },
  
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// =============================================================================
// BREAKPOINT TOKENS
// =============================================================================

export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// =============================================================================
// Z-INDEX TOKENS
// =============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ColorToken = keyof typeof colors;
export type TypographyToken = keyof typeof typography;
export type SpacingToken = keyof typeof spacing;
export type BorderRadiusToken = keyof typeof borderRadius;
export type ShadowToken = keyof typeof shadows;
export type OpacityToken = keyof typeof opacity; 