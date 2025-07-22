// File: theme/theme.utils.ts
import { ViewStyle, TextStyle } from 'react-native';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  opacity,
} from './tokens';

export const componentStyles = {
  text: {
    h1: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.black,
      lineHeight: typography.lineHeight.tight,
    } as TextStyle,
    h2: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.black,
      lineHeight: typography.lineHeight.tight,
    } as TextStyle,
    h3: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.black,
      lineHeight: typography.lineHeight.base,
    } as TextStyle,
    h4: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.black,
      lineHeight: typography.lineHeight.base,
    } as TextStyle,
    body: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      color: colors.gray[500],
      lineHeight: typography.lineHeight.base,
    } as TextStyle,
    bodyLarge: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.normal,
      color: colors.gray[500],
      lineHeight: typography.lineHeight.base,
    } as TextStyle,
    bodySmall: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      color: colors.gray[500],
      lineHeight: typography.lineHeight.tight,
    } as TextStyle,
    caption: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.gray[500],
      lineHeight: typography.lineHeight.tight,
    } as TextStyle,
    subtitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      color: colors.gray[500],
      lineHeight: typography.lineHeight.base,
    } as TextStyle,
    label: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.black,
      lineHeight: typography.lineHeight.base,
    } as TextStyle,
    vin: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.gray[500],
      fontFamily: typography.fontFamily.monospace,
      lineHeight: typography.lineHeight.tight,
    } as TextStyle,
    link: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
      lineHeight: typography.lineHeight.base,
    } as TextStyle,
    success: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.success,
      lineHeight: typography.lineHeight.tight,
    } as TextStyle,
    error: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.error,
      lineHeight: typography.lineHeight.tight,
    } as TextStyle,
    warning: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.warning,
      lineHeight: typography.lineHeight.tight,
    } as TextStyle,
  },
  container: {
    screen: {
      flex: 1,
      backgroundColor: colors.background.primary,
    } as ViewStyle,
    scrollableScreen: {
      flex: 1,
      backgroundColor: colors.background.primary,
      paddingHorizontal: spacing.component.container.padding,
    } as ViewStyle,
    content: {
      paddingHorizontal: spacing.component.container.padding,
      paddingVertical: spacing.md,
    } as ViewStyle,
    section: {
      paddingHorizontal: spacing.component.container.padding,
      marginBottom: spacing.component.section.margin,
    } as ViewStyle,
    card: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.component.card.md,
      padding: spacing.component.cardPadding.md,
      marginBottom: spacing.component.cardMargin.md,
      ...shadows.component.card,
    } as ViewStyle,
    cardLarge: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.component.card.lg,
      padding: spacing.component.cardPadding.lg,
      marginBottom: spacing.component.cardMargin.lg,
      ...shadows.component.card,
    } as ViewStyle,
  },
  layout: {
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowSpaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    column: {
      flexDirection: 'column',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      paddingTop: spacing[14],
      paddingHorizontal: spacing.component.container.padding,
      paddingBottom: spacing.lg,
      alignItems: 'center',
    } as ViewStyle,
    footer: {
      paddingHorizontal: spacing.component.container.padding,
      paddingBottom: spacing['2xl'],
    } as ViewStyle,
    statsGrid: {
      flexDirection: 'row',
      gap: spacing.md,
    } as ViewStyle,
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flexWrap: 'wrap',
    } as ViewStyle,
  },
} as const;

export const getColorWithOpacity = (color: string, opacityValue: number): string => {
  if (color.startsWith('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${opacityValue})`);
  }
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
  }
  return color;
};

export const getResponsiveSpacing = (isLandscape: boolean) => ({
  padding: isLandscape ? spacing.md : spacing.lg,
  margin: isLandscape ? spacing.sm : spacing.md,
  gap: isLandscape ? spacing.sm : spacing.md,
});

export const getResponsiveTypography = (isLandscape: boolean) => ({
  title: {
    fontSize: isLandscape ? typography.fontSize.lg : typography.fontSize.xl,
  },
  subtitle: {
    fontSize: isLandscape ? typography.fontSize.sm : typography.fontSize.base,
  },
  body: {
    fontSize: isLandscape ? typography.fontSize.xs : typography.fontSize.sm,
  },
});

export const getShadowForElevation = (level: 1 | 2 | 3 | 4 | 5): ViewStyle => {
  const shadowMap = {
    1: shadows.sm,
    2: shadows.base,
    3: shadows.md,
    4: shadows.lg,
    5: shadows.xl,
  };
  return shadowMap[level];
};

export const createButtonVariant = (
  backgroundColor: string,
  textColor: string,
  borderColor?: string
): { container: ViewStyle; text: TextStyle } => ({
  container: {
    backgroundColor,
    borderRadius: borderRadius.component.button.md,
    paddingVertical: spacing.component.buttonPadding.md.vertical,
    paddingHorizontal: spacing.component.buttonPadding.md.horizontal,
    alignItems: 'center',
    justifyContent: 'center',
    ...(borderColor && { borderWidth: 1, borderColor }),
    ...shadows.component.button,
  },
  text: {
    color: textColor,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});

export const createCardVariant = (
  backgroundColor: string,
  borderColor?: string,
  shadow: boolean = true
): ViewStyle => ({
  backgroundColor,
  borderRadius: borderRadius.component.card.md,
  padding: spacing.component.cardPadding.md,
  marginBottom: spacing.component.cardMargin.md,
  ...(borderColor && { borderWidth: 1, borderColor }),
  ...(shadow && shadows.component.card),
});

export const createBadgeVariant = (
  backgroundColor: string,
  textColor: string,
  size: 'sm' | 'md' | 'lg' = 'md'
): { container: ViewStyle; text: TextStyle } => ({
  container: {
    backgroundColor,
    borderRadius: borderRadius.component.badge[size],
    paddingHorizontal: spacing[size === 'sm' ? 3 : size === 'md' ? 4 : 6],
    paddingVertical: spacing[size === 'sm' ? 1 : size === 'md' ? 2 : 3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  text: {
    color: textColor,
    fontSize: typography.fontSize[size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'base'],
    fontWeight: typography.fontWeight.medium,
  },
});

export const getStatusColors = (status: 'success' | 'warning' | 'error' | 'info' | 'primary') => {
  return colors.state[status];
};

export const getScanningColors = (state: 'idle' | 'scanning' | 'detecting' | 'success' | 'error') => {
  return colors.scanning[state];
};

export const createOverlay = (opacityLevel: 'light' | 'medium' | 'dark' = 'medium'): ViewStyle => {
  const opacityMap = {
    light: opacity[10],
    medium: opacity[20],
    dark: opacity[40],
  };
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: getColorWithOpacity(colors.black, opacityMap[opacityLevel]),
  };
};

export const createModalStyles = () => ({
  backdrop: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  } as ViewStyle,
  content: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.component.modal,
    padding: spacing.lg,
    maxWidth: '90%',
    width: '100%',
    ...shadows.component.modal,
  } as ViewStyle,
});

export const createScannerStyles = (isLandscape: boolean) => {
  const responsiveSpacing = getResponsiveSpacing(isLandscape);
  return {
    overlay: createOverlay('light'),
    topSection: {
      flex: isLandscape ? 0.6 : 0.8,
      paddingTop: isLandscape ? spacing.md : spacing['3xl'],
      paddingHorizontal: responsiveSpacing.padding,
      paddingBottom: responsiveSpacing.padding,
    } as ViewStyle,
    middleSection: {
      flex: 2.2,
      paddingHorizontal: responsiveSpacing.padding + spacing.sm,
      paddingTop: responsiveSpacing.padding,
    } as ViewStyle,
    bottomSection: {
      flex: 1.2,
      paddingHorizontal: responsiveSpacing.padding,
      paddingVertical: responsiveSpacing.padding,
    } as ViewStyle,
  };
};

export const createTabBarStyles = () => ({
  style: {
    backgroundColor: colors.white,
    borderTopColor: 'transparent',
    borderTopWidth: 0,
    height: 80,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    elevation: 0,
    shadowOpacity: 0,
    justifyContent: 'center',
  } as ViewStyle,
  activeTintColor: colors.black,
  inactiveTintColor: colors.gray[300],
  labelStyle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing[1],
  } as TextStyle,
  iconStyle: {
    marginBottom: 0,
  } as ViewStyle,
  itemStyle: {
    paddingHorizontal: spacing.sm,
    maxWidth: 100,
  } as ViewStyle,
});
