import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useEffect } from 'react';
import {
  initializeCodeProtection,
  getProtectionStatus,
} from '@/utils/codeProtection';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    const protectionActive = initializeCodeProtection();

    if (protectionActive) {
      const status = getProtectionStatus();
      console.log(`📱 Environment: ${status.environment}`);
    }
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="enhanced-scanner" />
        <Stack.Screen name="results" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
