/**
 * @fileoverview UI Components Export Index
 * @description Centralized export for all reusable UI components
 * @related 
 * - components/ui/Card.tsx
 * - components/ui/Button.tsx
 * - components/ui/Badge.tsx
 * - components/ui/AnimatedModal.tsx
 * - components/ui/ScanningFrame.tsx
 * - components/ui/ScanningFrameDemo.tsx
 * - components/ui/UIComponentsDemo.tsx
 */

// Core UI Components
export { default as Card, type CardProps, type CardVariant, type CardSize } from './Card';
export { default as Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button';
export { default as Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from './Badge';

// Modal Components
export { default as AnimatedModal } from './AnimatedModal';

// Scanning Components
export { default as ScanningFrame } from './ScanningFrame';
export { default as ScanningFrameDemo } from './ScanningFrameDemo';

// Demo Components
export { default as UIComponentsDemo } from './UIComponentsDemo';
export { default as UIComponentsTest } from './UIComponentsTest';
export { default as StyleGuide } from './StyleGuide';

// Re-export commonly used types
export type { ViewStyle, TextStyle } from 'react-native'; 