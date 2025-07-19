/**
 * @fileoverview Theme System Index
 * @description Centralized exports for the complete design system
 * @related All UI components and screens use these exports
 */

// Core exports - use star exports to avoid duplicates
// =============================================================================
// DESIGN SYSTEM API
// =============================================================================

/**
 * Main design system object with all tokens and utilities
 */
import themeImport, { 
  componentStyles as styles,
  getColorWithOpacity as colorWithOpacity,
  getResponsiveSpacing as responsiveSpacing,
  getResponsiveTypography as responsiveTypography,
  createScannerStyles as scannerStyles,
  getStatusColors as statusColors,
  getScanningColors as scanningColors,
} from './theme';

import { 
  colors as designColors,
  typography as designTypography,
  spacing as designSpacing,
  borderRadius as designBorderRadius,
  shadows as designShadows,
} from './tokens';

export const designSystem = {
  // Core theme
  theme: themeImport,
  
  // Design tokens
  colors: designColors,
  typography: designTypography,
  spacing: designSpacing,
  borderRadius: designBorderRadius,
  shadows: designShadows,
  
  // Component styles
  styles,
  
  // Utilities
  utils: {
    colorWithOpacity,
    responsiveSpacing,
    responsiveTypography,
    scannerStyles,
    statusColors,
    scanningColors,
  },
  
  // Quick access
  text: styles.text,
  layout: styles.layout,
  container: styles.container,
} as const;

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

/**
 * Quick access to commonly used styles
 */
export const textStyles = styles.text;
export const layoutStyles = styles.layout;
export const containerStyles = styles.container;

/**
 * Common style mixins
 */
export const mixins = {
  // Text styles
  heading: textStyles.h3,
  subheading: textStyles.h4,
  body: textStyles.body,
  caption: textStyles.caption,
  
  // Layout styles
  flexRow: layoutStyles.row,
  flexRowBetween: layoutStyles.rowSpaceBetween,
  flexCenter: layoutStyles.center,
  
  // Container styles
  screen: containerStyles.screen,
  content: containerStyles.content,
  card: containerStyles.card,
  
  // Common backgrounds
  backgroundWhite: { backgroundColor: designColors.white },
  backgroundGray: { backgroundColor: designColors.gray[50] },
  backgroundPrimary: { backgroundColor: designColors.primary },
  
  // Common shadows
  shadowSm: designShadows.sm,
  shadowMd: designShadows.md,
  shadowLg: designShadows.lg,
  
  // Common borders
  roundedSm: { borderRadius: designBorderRadius.sm },
  roundedMd: { borderRadius: designBorderRadius.md },
  roundedLg: { borderRadius: designBorderRadius.lg },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create consistent style objects
 */
export const createStyles = <T extends Record<string, any>>(styleObj: T): T => styleObj;

/**
 * Merge styles safely
 */
export const mergeStyles = <T extends Record<string, any>>(
  baseStyles: T,
  overrideStyles?: Partial<T>
): T => ({
  ...baseStyles,
  ...overrideStyles,
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type DesignSystem = typeof designSystem;
export type TextStyles = typeof textStyles;
export type LayoutStyles = typeof layoutStyles;
export type ContainerStyles = typeof containerStyles;
export type Mixins = typeof mixins;

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default designSystem; 