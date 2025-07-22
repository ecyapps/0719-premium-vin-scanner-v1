import {
  FeatureFlags,
  PerformanceMetrics,
} from '@/types/scannerFilesValidationTypes';
import { DEFAULT_FEATURE_FLAGS } from './scannerHelperFunctionOne';

export class FeatureFlagController {
  private flags: FeatureFlags;
  private metrics: PerformanceMetrics[] = [];

  constructor(initialFlags: FeatureFlags = DEFAULT_FEATURE_FLAGS) {
    this.flags = { ...initialFlags };
  }

  enableFeature(feature: keyof FeatureFlags): void {
    this.flags[feature] = true;
    if (this.flags.debugLogging) {
      console.log(`🎛️ Feature enabled: ${feature}`);
    }
  }

  disableFeature(feature: keyof FeatureFlags): void {
    this.flags[feature] = false;
    if (this.flags.debugLogging) {
      console.log(`🎛️ Feature disabled: ${feature}`);
    }
  }

  isEnabled(feature: keyof FeatureFlags): boolean {
    return this.flags[feature];
  }

  getFlags(): FeatureFlags {
    return { ...this.flags };
  }

  resetToDefaults(): void {
    this.flags = { ...DEFAULT_FEATURE_FLAGS };
    if (this.flags.debugLogging) {
      console.log('🔄 Reset to default feature flags');
    }
  }

  enablePhase(phase: 1 | 2 | 3): void {
    switch (phase) {
      case 1:
        this.flags.roiProcessing = true;
        this.flags.progressiveQuality = false; // Keep disabled for performance
        this.flags.adaptiveIntervals = false; // Keep disabled for performance
        break;
      case 2:
        this.flags.enhancedConfidence = true;
        this.flags.checkDigitValidation = true;
        this.flags.manufacturerValidation = true;
        break;
      case 3:
        this.flags.imagePreprocessing = false; // Keep lightweight for performance
        this.flags.contextAwareDetection = true;
        this.flags.multiFrameAnalysis = true;
        break;
    }
    if (this.flags.debugLogging) {
      console.log(`🎛️ Phase ${phase} enabled with performance optimization`);
    }
  }

  recordMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);
    if (this.flags.debugLogging) {
      console.log(`📊 Metrics recorded: ${JSON.stringify(metrics)}`);
    }
  }

  getPerformanceSummary(): any {
    if (this.metrics.length === 0) return null;

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      averageScanTime: avg(this.metrics.map((m) => m.scanTime)),
      averageConfidence: avg(this.metrics.map((m) => m.confidence)),
      averageAccuracy: avg(this.metrics.map((m) => m.accuracy)),
      totalFalsePositives: this.metrics.reduce(
        (sum, m) => sum + m.falsePositives,
        0
      ),
      totalFalseNegatives: this.metrics.reduce(
        (sum, m) => sum + m.falseNegatives,
        0
      ),
      sampleSize: this.metrics.length,
    };
  }
}
