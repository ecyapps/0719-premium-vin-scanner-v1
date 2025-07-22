import { featureFlags } from '@/hooks/useVINScanner';
import { MemoryMetrics } from '@/types/scannerFilesValidationTypes';
import { Platform } from 'react-native';

export let TextRecognition: any;
export let BarcodeScanning: any;
export let isMLKitPreWarmed = false;
export let memoryHistory: MemoryMetrics[] = [];
export const MEMORY_WARNING_THRESHOLD = 100 * 1024 * 1024;
export const MEMORY_CRITICAL_THRESHOLD = 150 * 1024 * 1024;
export let memoryMonitorInterval: ReturnType<typeof setInterval> | null = null;

export const initializeMLKit = () => {
  if (Platform.OS !== 'web') {
    try {
      import('@react-native-ml-kit/text-recognition')
        .then((module) => {
          TextRecognition = module.default;
          console.log('✅ ML Kit Text Recognition initialized');
        })
        .catch((error) => {
          console.warn('⚠️ ML Kit Text Recognition not available:', error);
        });

      import('@react-native-ml-kit/barcode-scanning')
        .then((module) => {
          BarcodeScanning = module.default;
          console.log('✅ ML Kit Barcode Scanning initialized');
        })
        .catch((error) => {
          console.warn('⚠️ ML Kit Barcode Scanning not available:', error);
        });
    } catch (error) {
      console.warn('⚠️ ML Kit initialization failed:', error);
    }
  }
};

export const preWarmMLKit = async (): Promise<void> => {
  if (isMLKitPreWarmed) return;

  try {
    const preWarmPromises = [];

    if (featureFlags.isEnabled('textRecognition')) {
      preWarmPromises.push(
        import('@react-native-ml-kit/text-recognition').then((module) => {
          console.log('🔥 PRE-WARMING: Text recognition ready');
          return module;
        })
      );
    }

    if (featureFlags.isEnabled('barcodeScanning')) {
      preWarmPromises.push(
        import('@react-native-ml-kit/barcode-scanning').then((module) => {
          console.log('🔥 PRE-WARMING: Barcode scanning ready');
          return module;
        })
      );
    }

    await Promise.all(preWarmPromises);

    isMLKitPreWarmed = true;
  } catch (error) {
    console.warn('⚠️ PRE-WARMING: Failed to pre-warm ML Kit:', error);
  }
};

export const monitorMemory = (): void => {
  if (!__DEV__) return;

  const memoryUsage = process.memoryUsage
    ? process.memoryUsage()
    : {
        heapUsed: 0,
        heapTotal: 0,
        external: 0,
        rss: 0,
      };

  const metrics: MemoryMetrics = {
    ...memoryUsage,
    timestamp: Date.now(),
  };

  memoryHistory.push(metrics);
  if (memoryHistory.length > 10) {
    memoryHistory.shift();
  }

  if (metrics.heapUsed > MEMORY_CRITICAL_THRESHOLD) {
    console.warn(
      '🚨 MEMORY CRITICAL: Heap usage exceeded 150MB - forcing cleanup'
    );
    if (global.gc) {
      global.gc();
    }
  } else if (metrics.heapUsed > MEMORY_WARNING_THRESHOLD) {
    console.log('⚠️ MEMORY WARNING: Heap usage exceeded 100MB');
  }

  if (memoryHistory.length >= 5 && memoryHistory.length % 5 === 0) {
    const trend = memoryHistory.slice(-5);
    const avgUsage =
      trend.reduce((sum, m) => sum + m.heapUsed, 0) / trend.length;
    console.log(
      `📊 MEMORY TREND: Average heap usage: ${(avgUsage / 1024 / 1024).toFixed(
        1
      )}MB`
    );
  }
};

export const startMemoryMonitoring = (): void => {
  if (memoryMonitorInterval) return;

  memoryMonitorInterval = setInterval(() => {
    monitorMemory();
  }, 10000);
};

export const stopMemoryMonitoring = (): void => {
  if (memoryMonitorInterval) {
    clearInterval(memoryMonitorInterval);
    memoryMonitorInterval = null;
  }
};
