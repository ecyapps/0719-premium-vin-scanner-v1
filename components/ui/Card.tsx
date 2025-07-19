/**
 * @component Card
 * @description Reusable card component with multiple variants and configurations
 * @props CardProps - Card configuration and content
 * @returns Rendered card component with proper styling and layout
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export type CardVariant = 
  | 'default'
  | 'stat'
  | 'recent' 
  | 'insight'
  | 'action'
  | 'vehicle'
  | 'savings'
  | 'analysis'
  | 'leverage'
  | 'scan'
  | 'feature'
  | 'comingSoon';

export type CardSize = 'small' | 'medium' | 'large';

export interface CardProps {
  /** Card variant determining the styling */
  variant?: CardVariant;
  /** Card size */
  size?: CardSize;
  /** Card content */
  children: React.ReactNode;
  /** Custom styles for the card container */
  style?: ViewStyle;
  /** Whether the card should have shadow */
  shadow?: boolean;
  /** Whether the card should have border */
  border?: boolean;
  /** Custom border color */
  borderColor?: string;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom border radius */
  borderRadius?: number;
  /** Custom padding */
  padding?: number;
  /** Custom margin */
  margin?: number;
  /** Whether card should be full width */
  fullWidth?: boolean;
  /** Whether card should be centered */
  centered?: boolean;
  /** Custom flex direction */
  flexDirection?: 'row' | 'column';
  /** Custom alignment */
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  /** Custom justification */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  /** Custom gap between items */
  gap?: number;
  /** Additional accessibility properties */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: CardVariant): ViewStyle => {
  const variants: Record<CardVariant, ViewStyle> = {
    default: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 0,
      marginBottom: 16,
    },
    stat: {
      backgroundColor: '#F8F9FA',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      flex: 1,
    },
    recent: {
      backgroundColor: '#F8F9FA',
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    insight: {
      backgroundColor: '#E8F4FD',
      borderRadius: 16,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#007AFF',
    },
    action: {
      backgroundColor: '#F8F9FA',
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    vehicle: {
      backgroundColor: '#F8F9FA',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
    },
    savings: {
      backgroundColor: '#E8F5E8',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#00C851',
    },
    analysis: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    leverage: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    scan: {
      backgroundColor: '#F8F9FA',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    feature: {
      backgroundColor: '#F8F9FA',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    comingSoon: {
      backgroundColor: '#F8F9FA',
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      marginHorizontal: 24,
      marginBottom: 32,
    },
  };

  return variants[variant];
};

/**
 * Get size-specific styles
 */
const getSizeStyles = (size: CardSize): ViewStyle => {
  const sizes: Record<CardSize, ViewStyle> = {
    small: {
      padding: 12,
      borderRadius: 8,
    },
    medium: {
      padding: 16,
      borderRadius: 12,
    },
    large: {
      padding: 24,
      borderRadius: 16,
    },
  };

  return sizes[size];
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  style,
  shadow = false,
  border = false,
  borderColor,
  backgroundColor,
  borderRadius,
  padding,
  margin,
  fullWidth = false,
  centered = false,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  // Get base styles
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  // Create final styles
  const cardStyles: ViewStyle = {
    ...styles.base,
    ...variantStyles,
    ...sizeStyles,
    // Apply custom overrides
    ...(backgroundColor && { backgroundColor }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(padding !== undefined && { padding }),
    ...(margin !== undefined && { margin }),
    ...(fullWidth && { width: '100%' }),
    ...(centered && { alignSelf: 'center' }),
    ...(flexDirection && { flexDirection }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(gap && { gap }),
    // Apply shadow if requested
    ...(shadow && styles.shadow),
    // Apply border if requested
    ...(border && {
      borderWidth: 1,
      borderColor: borderColor || '#E5E5E5',
    }),
    // Apply custom styles last
    ...style,
  };

  return (
    <View
      style={cardStyles}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    // Base card styles
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Card; 