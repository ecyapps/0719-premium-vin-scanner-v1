// File: theme/theme.ts
import { ViewStyle, TextStyle } from 'react-native';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  opacity,
  animation,
  breakpoints,
  zIndex,
} from './tokens';

import {
  componentStyles,
  getColorWithOpacity,
  getResponsiveSpacing,
  getResponsiveTypography,
  getShadowForElevation,
  createButtonVariant,
  createCardVariant,
  createBadgeVariant,
  getStatusColors,
  getScanningColors,
  createOverlay,
  createModalStyles,
  createScannerStyles,
  createTabBarStyles,
} from './theme.utils';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  opacity,
  animation,
  breakpoints,
  zIndex,
} as const;

export {
  componentStyles,
  getColorWithOpacity,
  getResponsiveSpacing,
  getResponsiveTypography,
  getShadowForElevation,
  createButtonVariant,
  createCardVariant,
  createBadgeVariant,
  getStatusColors,
  getScanningColors,
  createOverlay,
  createModalStyles,
  createScannerStyles,
  createTabBarStyles,
};

export type Theme = typeof theme;
export type ComponentStyles = typeof componentStyles;

export default theme;
