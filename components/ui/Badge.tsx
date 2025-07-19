/**
 * @component Badge
 * @description Reusable badge component with multiple variants and configurations
 * @props BadgeProps - Badge configuration and content
 * @returns Rendered badge component with proper styling and layout
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export type BadgeVariant = 
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'savings'
  | 'time'
  | 'status'
  | 'dot'
  | 'icon'
  | 'do'
  | 'dont';

export type BadgeSize = 'small' | 'medium' | 'large';

export interface BadgeProps {
  /** Badge variant determining the styling */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Badge text content */
  text?: string;
  /** Icon component to display */
  icon?: React.ReactNode;
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right' | 'only';
  /** Custom styles for the badge container */
  style?: ViewStyle;
  /** Custom styles for the badge text */
  textStyle?: TextStyle;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Custom border color */
  borderColor?: string;
  /** Custom border radius */
  borderRadius?: number;
  /** Custom padding */
  padding?: number;
  /** Whether badge should be rounded */
  rounded?: boolean;
  /** Whether badge should have border */
  border?: boolean;
  /** Additional accessibility properties */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: BadgeVariant): { container: ViewStyle; text: TextStyle } => {
  const variants: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      text: {
        color: '#666666',
        fontSize: 12,
        fontWeight: '500',
      },
    },
    success: {
      container: {
        backgroundColor: '#E8F5E8',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      text: {
        color: '#00C851',
        fontSize: 12,
        fontWeight: '500',
      },
    },
    warning: {
      container: {
        backgroundColor: '#FFF3E0',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      text: {
        color: '#FF9800',
        fontSize: 12,
        fontWeight: '500',
      },
    },
    error: {
      container: {
        backgroundColor: '#FFEBEE',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      text: {
        color: '#F44336',
        fontSize: 12,
        fontWeight: '500',
      },
    },
    info: {
      container: {
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      text: {
        color: '#2196F3',
        fontSize: 12,
        fontWeight: '500',
      },
    },
    savings: {
      container: {
        backgroundColor: '#E8F5E8',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      text: {
        color: '#00C851',
        fontSize: 12,
        fontWeight: '500',
      },
    },
    time: {
      container: {
        backgroundColor: 'transparent',
        borderRadius: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      text: {
        color: '#666666',
        fontSize: 12,
        fontWeight: '400',
      },
    },
    status: {
      container: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        marginRight: 8,
      },
      text: {
        color: 'transparent',
        fontSize: 0,
      },
    },
    dot: {
      container: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#007AFF',
        marginTop: 7,
      },
      text: {
        color: 'transparent',
        fontSize: 0,
      },
    },
    icon: {
      container: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F4FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
      },
      text: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    do: {
      container: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
      },
      text: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
      },
    },
    dont: {
      container: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
      },
      text: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
      },
    },
  };

  return variants[variant];
};

/**
 * Get size-specific styles
 */
const getSizeStyles = (size: BadgeSize): { container: ViewStyle; text: TextStyle } => {
  const sizes: Record<BadgeSize, { container: ViewStyle; text: TextStyle }> = {
    small: {
      container: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
      },
      text: {
        fontSize: 10,
      },
    },
    medium: {
      container: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
      },
      text: {
        fontSize: 12,
      },
    },
    large: {
      container: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
      },
      text: {
        fontSize: 14,
      },
    },
  };

  return sizes[size];
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'medium',
  text,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  backgroundColor,
  textColor,
  borderColor,
  borderRadius,
  padding,
  rounded = false,
  border = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  // Get base styles
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  // Create final styles
  const badgeStyles: ViewStyle = {
    ...styles.base,
    ...variantStyles.container,
    ...sizeStyles.container,
    // Apply custom overrides
    ...(backgroundColor && { backgroundColor }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(padding !== undefined && { padding }),
    ...(rounded && { borderRadius: 50 }),
    ...(border && {
      borderWidth: 1,
      borderColor: borderColor || '#E5E5E5',
    }),
    // Apply custom styles last
    ...style,
  };

  const badgeTextStyles: TextStyle = {
    ...variantStyles.text,
    ...sizeStyles.text,
    // Apply custom overrides
    ...(textColor && { color: textColor }),
    // Apply custom styles last
    ...textStyle,
  };

  // Handle icon and text layout
  const renderContent = () => {
    if (variant === 'status' || variant === 'dot') {
      return null; // These are just visual indicators
    }

    if (iconPosition === 'only') {
      return icon;
    }

    if (iconPosition === 'right') {
      return (
        <>
          {text && <Text style={badgeTextStyles}>{text}</Text>}
          {icon}
        </>
      );
    }

    // Default: left position
    return (
      <>
        {icon}
        {text && <Text style={badgeTextStyles}>{text}</Text>}
      </>
    );
  };

  return (
    <View
      style={badgeStyles}
      accessibilityLabel={accessibilityLabel || text}
      accessibilityHint={accessibilityHint}
      accessibilityRole="text"
      testID={testID}
    >
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    // Base badge styles
    overflow: 'hidden',
  },
});

export default Badge; 