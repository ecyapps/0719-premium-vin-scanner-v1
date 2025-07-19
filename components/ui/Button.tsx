/**
 * @component Button
 * @description Reusable button component with multiple variants and configurations
 * @props ButtonProps - Button configuration and content
 * @returns Rendered button component with proper styling and interaction
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

export type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'floating'
  | 'action'
  | 'back'
  | 'close'
  | 'toggle'
  | 'capture'
  | 'manual'
  | 'analyze'
  | 'start'
  | 'notify'
  | 'icon'
  | 'text';

export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface ButtonProps {
  /** Button variant determining the styling */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Button text content */
  title?: string;
  /** Icon component to display */
  icon?: React.ReactNode;
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right' | 'only';
  /** Button press handler */
  onPress?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is loading */
  loading?: boolean;
  /** Custom styles for the button container */
  style?: ViewStyle;
  /** Custom styles for the button text */
  textStyle?: TextStyle;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Custom border radius */
  borderRadius?: number;
  /** Custom padding */
  padding?: number;
  /** Whether button should be full width */
  fullWidth?: boolean;
  /** Active opacity for press feedback */
  activeOpacity?: number;
  /** Additional accessibility properties */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: ButtonVariant): { container: ViewStyle; text: TextStyle } => {
  const variants: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    secondary: {
      container: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    floating: {
      container: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    action: {
      container: {
        backgroundColor: '#000000',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      text: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
      },
    },
    back: {
      container: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      text: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    close: {
      container: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    toggle: {
      container: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    capture: {
      container: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    manual: {
      container: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    analyze: {
      container: {
        backgroundColor: '#333',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    start: {
      container: {
        backgroundColor: '#333',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    notify: {
      container: {
        backgroundColor: '#000000',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    icon: {
      container: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
    },
    text: {
      container: {
        backgroundColor: 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
      },
    },
  };

  return variants[variant];
};

/**
 * Get size-specific styles
 */
const getSizeStyles = (size: ButtonSize): { container: ViewStyle; text: TextStyle } => {
  const sizes: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
    small: {
      container: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
      },
      text: {
        fontSize: 14,
      },
    },
    medium: {
      container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
      },
      text: {
        fontSize: 16,
      },
    },
    large: {
      container: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
      },
      text: {
        fontSize: 18,
      },
    },
    xlarge: {
      container: {
        paddingVertical: 20,
        paddingHorizontal: 32,
        borderRadius: 20,
      },
      text: {
        fontSize: 20,
      },
    },
  };

  return sizes[size];
};

/**
 * Get disabled styles
 */
const getDisabledStyles = (): { container: ViewStyle; text: TextStyle } => ({
  container: {
    opacity: 0.6,
  },
  text: {
    opacity: 0.6,
  },
});

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  title,
  icon,
  iconPosition = 'left',
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  backgroundColor,
  textColor,
  borderRadius,
  padding,
  fullWidth = false,
  activeOpacity = 0.8,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  // Get base styles
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const disabledStyles = disabled ? getDisabledStyles() : { container: {}, text: {} };

  // Create final styles
  const buttonStyles: ViewStyle = {
    ...styles.base,
    ...variantStyles.container,
    ...sizeStyles.container,
    ...disabledStyles.container,
    // Apply custom overrides
    ...(backgroundColor && { backgroundColor }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(padding !== undefined && { padding }),
    ...(fullWidth && { width: '100%' }),
    // Apply custom styles last
    ...style,
  };

  const buttonTextStyles: TextStyle = {
    ...variantStyles.text,
    ...sizeStyles.text,
    ...disabledStyles.text,
    // Apply custom overrides
    ...(textColor && { color: textColor }),
    // Apply custom styles last
    ...textStyle,
  };

  // Handle icon and text layout
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={buttonTextStyles.color} size="small" />;
    }

    if (iconPosition === 'only') {
      return icon;
    }

    if (iconPosition === 'right') {
      return (
        <>
          {title && <Text style={buttonTextStyles}>{title}</Text>}
          {icon}
        </>
      );
    }

    // Default: left position
    return (
      <>
        {icon}
        {title && <Text style={buttonTextStyles}>{title}</Text>}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    // Base button styles
    overflow: 'hidden',
  },
});

export default Button; 