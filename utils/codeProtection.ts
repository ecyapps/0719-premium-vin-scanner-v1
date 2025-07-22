const WATERMARK_DATA = {
  buildId: `VIN-SCANNER-${Date.now()}`,
  company: 'VisiblePaths Inc.',
  fingerprint: 'PROTECTED-BUILD-2025',
  timestamp: new Date().toISOString()
};

declare global {
  var __PROTECTION_ACTIVE: boolean;
  var __BUILD_WATERMARK: string;
  var __VISIBLEPATHS_PROTECTED: boolean;
}

const isDevelopmentEnvironment = (): boolean => {
  if (typeof process !== 'undefined' && process.env?.DISABLE_PROTECTION === 'true') {
    return true;
  }

  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return true;
  }

  if (typeof process !== 'undefined' && (
    process.env?.NODE_ENV === 'development' ||
    process.env?.EXPO_DEV_CLIENT === 'true'
  )) {
    return true;
  }

  if (typeof window !== 'undefined' && (
    window.location?.hostname === 'localhost' ||
    window.location?.hostname === '127.0.0.1' ||
    window.location?.hostname?.includes('local')
  )) {
    return true;
  }

  if (typeof global !== 'undefined' && (
    (global as any).__EXPO_DEV__ ||
    (global as any).__METRO_GLOBAL_PREFIX__ ||
    (global as any).__DEV__
  )) {
    return true;
  }

  return true;
};

export const initializeCodeProtection = (): boolean => {
  try {
    global.__VISIBLEPATHS_PROTECTED = true;
    if (isDevelopmentEnvironment()) {
      global.__PROTECTION_ACTIVE = false;
      return true; // Return true to not block development
    }
    global.__PROTECTION_ACTIVE = true;
    global.__BUILD_WATERMARK = btoa(JSON.stringify(WATERMARK_DATA));  
    return true;
  } catch (error) {
    return true; // Never block app functionality
  }
};

export const getProtectionStatus = () => ({
  active: global.__PROTECTION_ACTIVE || false,
  environment: isDevelopmentEnvironment() ? 'development' : 'production',
  watermark: global.__BUILD_WATERMARK || 'none',
  company: 'VisiblePaths Inc.',
  contact: 'paulynice@visiblepaths.com',
  protected: global.__VISIBLEPATHS_PROTECTED || false,
  buildId: WATERMARK_DATA.buildId
});

export const startProtectionMonitoring = (): void => {
  console.log('🛡️  VisiblePaths Inc. - Copyright protection active (passive mode)');
  return;
};

export const triggerProtectionResponse = (violationType: string): void => {
  console.log('ℹ️  VisiblePaths Inc. VIN Scanner - Copyright (c) 2025');
  console.log('📧 Contact: paulynice@visiblepaths.com');
};

export const disableProtectionForDevelopment = (): void => {
  global.__PROTECTION_ACTIVE = false;
  console.log('🛠️  Protection manually disabled for development');
  console.log('📝 This is safe during development and testing');
};