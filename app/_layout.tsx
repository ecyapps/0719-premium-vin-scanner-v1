/**
 * PROPRIETARY SOFTWARE - VIN Scanner Application
 * Copyright (c) 2025 VisiblePaths Inc. All rights reserved.
 * 
 * This file is part of a proprietary software system protected by copyright law.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 * 
 * Digital Fingerprint: VIN-SCANNER-MAIN-LAYOUT-2025
 * License: Proprietary - See LICENSE file for full terms
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { initializeCodeProtection, getProtectionStatus, disableProtectionForDevelopment } from '@/utils/codeProtection';

export default function RootLayout() {
  useFrameworkReady();

  // DEVELOPER INSTRUCTIONS:
  // ======================
  // Protection is automatically disabled during development.
  // 
  // If you need to disable protection in production builds for testing:
  // 1. Uncomment the line below: disableProtectionForDevelopment();
  // 2. Or set environment variable: DISABLE_PROTECTION=true
  // 3. Protection will not interfere with your development work
  //
  // For final production releases, ensure protection is enabled.
  
  useEffect(() => {
    // Optional: Manually disable for development/testing
    // Uncomment the next line if you need to disable protection in production builds
    // disableProtectionForDevelopment();
    
    // Initialize copyright protection (passive mode - no interference)
    console.log('📱 VisiblePaths Inc. VIN Scanner - Starting...');
    const protectionActive = initializeCodeProtection();
    
    // Never fail app startup - protection is passive
    if (protectionActive) {
      const status = getProtectionStatus();
      console.log(`📱 Environment: ${status.environment}`);
      console.log(`⚖️  Copyright: VisiblePaths Inc. © 2025`);
    }
    
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
