/**
 * PROPRIETARY CODE PROTECTION SYSTEM
 * Copyright (c) 2025 VisiblePaths Inc. All rights reserved.
 * 
 * WARNING: This file contains proprietary code protection mechanisms.
 * Unauthorized modification, removal, or circumvention of these protections
 * is strictly prohibited and may result in legal action.
 * 
 * Digital Fingerprint: VIN-SCANNER-PROTECTION-CORE-2025
 * License: Proprietary - See LICENSE file for terms
 */

// Protection configuration
const WATERMARK_DATA = {
  buildId: `VIN-SCANNER-${Date.now()}`,
  company: 'VisiblePaths Inc.',
  fingerprint: 'PROTECTED-BUILD-2025',
  timestamp: new Date().toISOString()
};

// Global protection markers
declare global {
  var __PROTECTION_ACTIVE: boolean;
  var __BUILD_WATERMARK: string;
  var __VISIBLEPATHS_PROTECTED: boolean;
}

/**
 * Enhanced development mode detection
 * Multiple checks to ensure we don't interfere with development
 */
const isDevelopmentEnvironment = (): boolean => {
  // ALWAYS return true during development - owner has full control
  // This ensures no interference with development workflow
  
  // Manual development override (primary method)
  if (typeof process !== 'undefined' && process.env?.DISABLE_PROTECTION === 'true') {
    return true;
  }
  
  // React Native __DEV__ flag
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return true;
  }
  
  // Expo development mode
  if (typeof process !== 'undefined' && (
    process.env?.NODE_ENV === 'development' ||
    process.env?.EXPO_DEV_CLIENT === 'true'
  )) {
    return true;
  }
  
  // Local development indicators
  if (typeof window !== 'undefined' && (
    window.location?.hostname === 'localhost' ||
    window.location?.hostname === '127.0.0.1' ||
    window.location?.hostname?.includes('local')
  )) {
    return true;
  }
  
  // Expo/Metro bundler indicators
  if (typeof global !== 'undefined' && (
    (global as any).__EXPO_DEV__ ||
    (global as any).__METRO_GLOBAL_PREFIX__ ||
    (global as any).__DEV__
  )) {
    return true;
  }
  
  // Default to development mode to avoid issues
  // Owner can enable protection explicitly for production
  return true;
};

/**
 * Initialize code protection system
 * Only activates in true production environments
 */
export const initializeCodeProtection = (): boolean => {
  try {
    // Always mark as initialized for compatibility
    global.__VISIBLEPATHS_PROTECTED = true;
    
    // Check if we're in development
    if (isDevelopmentEnvironment()) {
      console.log('🛠️  DEVELOPMENT MODE: Protection system disabled');
      global.__PROTECTION_ACTIVE = false;
      return true; // Return true to not block development
    }
    
    // Production mode - passive protection (no interference)
    console.log('🔒 PRODUCTION MODE: VisiblePaths Inc. VIN Scanner');
    console.log('⚖️  Copyright (c) 2025 VisiblePaths Inc. All rights reserved.');
    console.log('📧 Contact: paulynice@visiblepaths.com');
    
    global.__PROTECTION_ACTIVE = true;
    global.__BUILD_WATERMARK = btoa(JSON.stringify(WATERMARK_DATA));
    
    // NO monitoring in production to avoid any interference
    // Protection is handled through copyright headers and licensing
    
    return true;
  } catch (error) {
    console.error('Protection initialization error:', error);
    return true; // Never block app functionality
  }
};

/**
 * Get current protection status
 */
export const getProtectionStatus = () => ({
  active: global.__PROTECTION_ACTIVE || false,
  environment: isDevelopmentEnvironment() ? 'development' : 'production',
  watermark: global.__BUILD_WATERMARK || 'none',
  company: 'VisiblePaths Inc.',
  contact: 'paulynice@visiblepaths.com',
  protected: global.__VISIBLEPATHS_PROTECTED || false,
  buildId: WATERMARK_DATA.buildId
});

/**
 * Protection monitoring (only runs in production)
 */
export const startProtectionMonitoring = (): void => {
  // DISABLED: No monitoring to ensure smooth operation
  // Protection is provided through copyright headers and licensing only
  console.log('🛡️  VisiblePaths Inc. - Copyright protection active (passive mode)');
  return;
};

/**
 * Emergency protection response
 */
export const triggerProtectionResponse = (violationType: string): void => {
  // DISABLED: No violation responses to ensure smooth operation
  // Protection is informational only through copyright notices
  console.log('ℹ️  VisiblePaths Inc. VIN Scanner - Copyright (c) 2025');
  console.log('📧 Contact: paulynice@visiblepaths.com');
};

/**
 * Manual protection disable for development
 * Use this when you need to test production builds during development
 */
export const disableProtectionForDevelopment = (): void => {
  global.__PROTECTION_ACTIVE = false;
  console.log('🛠️  Protection manually disabled for development');
  console.log('📝 This is safe during development and testing');
};

// Protection system ready - passive mode only
// No automatic initialization to avoid interference
// Initialization handled by app startup only 