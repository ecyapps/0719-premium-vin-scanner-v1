import { featureFlags } from '@/hooks/useVINScanner';
import { VINScanResult } from '@/types/scannerFilesValidationTypes';
import { useCallback } from 'react';

export const enableAllPhase1Features = useCallback(() => {
  featureFlags.enablePhase(1);
  console.log('🚀 All Phase 1 features enabled');
}, []);

export const enableAllPhase2Features = useCallback(() => {
  featureFlags.enablePhase(2);
  console.log(
    '🚀 All Phase 2 features enabled: parallel processing, smart confidence, screen optimization'
  );
}, []);

export const getPhase1Status = useCallback(() => {
  return {
    roiProcessing: featureFlags.isEnabled('roiProcessing'),
    progressiveQuality: featureFlags.isEnabled('progressiveQuality'),
    adaptiveIntervals: featureFlags.isEnabled('adaptiveIntervals'),
  };
}, []);

export const enablePhase1Feature = useCallback(
  (feature: 'roiProcessing' | 'progressiveQuality' | 'adaptiveIntervals') => {
    featureFlags.enableFeature(feature);
    if (featureFlags.isEnabled('debugLogging')) {
      console.log(`🎛️ Phase 1 feature enabled: ${feature}`);
    }
  },
  []
);

export const disablePhase1Feature = useCallback(
  (feature: 'roiProcessing' | 'progressiveQuality' | 'adaptiveIntervals') => {
    featureFlags.disableFeature(feature);
    if (featureFlags.isEnabled('debugLogging')) {
      console.log(`🎛️ Phase 1 feature disabled: ${feature}`);
    }
  },
  []
);

export const trackPerformanceAgainstTargets = useCallback(
  (result: VINScanResult | null, scanTime: number) => {
    const targets = {
      accuracy: { current: result ? 100 : 0, target: 85, unit: '%' },
      scanTime: { current: scanTime, target: 1500, unit: 'ms' },
      confidence: {
        current: result?.confidence ? result.confidence * 100 : 0,
        target: 90,
        unit: '%',
      },
    };

    const performance = {
      accuracy:
        targets.accuracy.current >= targets.accuracy.target ? 'PASS' : 'FAIL',
      scanTime:
        targets.scanTime.current <= targets.scanTime.target ? 'PASS' : 'FAIL',
      confidence:
        targets.confidence.current >= targets.confidence.target
          ? 'PASS'
          : 'FAIL',
    };

    console.log(`📊 PERFORMANCE BENCHMARK:`);
    console.log(
      `  Accuracy: ${targets.accuracy.current}${targets.accuracy.unit} (target: ${targets.accuracy.target}${targets.accuracy.unit}) - ${performance.accuracy}`
    );
    console.log(
      `  Scan Time: ${targets.scanTime.current}${targets.scanTime.unit} (target: ${targets.scanTime.target}${targets.scanTime.unit}) - ${performance.scanTime}`
    );
    console.log(
      `  Confidence: ${targets.confidence.current.toFixed(1)}${
        targets.confidence.unit
      } (target: ${targets.confidence.target}${targets.confidence.unit}) - ${
        performance.confidence
      }`
    );

    return {
      targets,
      performance,
      overallPass:
        performance.accuracy === 'PASS' &&
        performance.scanTime === 'PASS' &&
        performance.confidence === 'PASS',
    };
  },
  []
);

export const getProgressiveQuality = useCallback((attempt: number) => {
  if (!featureFlags.isEnabled('progressiveQuality')) {
    return 1.0; // Full quality if feature disabled
  }

  const qualityLevels = [0.5, 0.8, 1.0]; // Conservative progression
  const quality = qualityLevels[Math.min(attempt, qualityLevels.length - 1)];

  if (featureFlags.isEnabled('debugLogging')) {
  }

  return quality;
}, []);
