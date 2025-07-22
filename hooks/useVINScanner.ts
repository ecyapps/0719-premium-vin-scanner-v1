import { useState, useCallback, useEffect } from 'react';
import { getProtectionStatus } from '@/utils/codeProtection';
import {
  correctVINCharacters,
  detectScreenScan,
  optimizeImageForMLKit,
} from '@/functions/vinScannerFunctions/scannerHelperFunctionOne';
import {
  BarcodeScanning,
  TextRecognition,
  initializeMLKit,
  preWarmMLKit,
  startMemoryMonitoring,
  stopMemoryMonitoring,
} from '@/functions/vinScannerFunctions/scannerHelperFunctionFive';
import {
  ParallelScanResult,
  VINScanFrame,
  VINScanHistory,
  VINScanResult,
} from '@/types/scannerFilesValidationTypes';
import {
  analyzeCharacterInconsistencies,
  analyzeVINConsensus,
  calculateStabilityScore,
  validateVINContext,
} from '@/functions/vinScannerFunctions/scannerHelperFunctionTwo';
import {
  generateUserFeedback,
  shouldSkipTextProcessing,
  enhanceImageForOCR,
} from '@/functions/vinScannerFunctions/scannerHelperFunctionThree';
import {
  isLikelyNonVINText,
  findVINWithContext,
  extractVINFromText,
  extractVINWithProfessionalValidation,
  validateVIN,
} from '@/functions/vinScannerFunctions/scannerHelperFunctionSix';
import { FeatureFlagController } from '@/functions/vinScannerFunctions/featureFlagControllerClass';
import {
  analyzeImageQuality,
  calculateConfidence,
  processImageWithEnhancements,
  resolveConsensusVIN,
} from '@/functions/vinScannerFunctions/scannerHelperFunctionSeven';
import {
  getROIBounds,
  getOptimalROIForVIN,
  createTestSuite,
  getConfidenceContext,
  validateVINLength,
  scanBarcodeFromCamera,
  getPhase2Status,
} from '@/functions/vinScannerFunctions/scannerHelperFunctionEight';
import {
  enableAllPhase1Features,
  enableAllPhase2Features,
  getPhase1Status,
  disablePhase1Feature,
  enablePhase1Feature,
  getProgressiveQuality,
  trackPerformanceAgainstTargets,
} from '@/functions/vinScannerFunctions/scannerHelperFunctionNine';

export const featureFlags = new FeatureFlagController();

initializeMLKit();

preWarmMLKit();

export const useVINScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageURICache, setImageURICache] = useState<Set<string>>(new Set());
  const [adaptiveConfig, setAdaptiveConfig] = useState({
    currentInterval: 3000, // Start at 3 seconds
    failureCount: 0,
    lastScanTime: 0,
  });
  const [scanHistory, setScanHistory] = useState<VINScanHistory>({
    frames: [],
    consensus: null,
    confidenceScore: 0,
    stabilityScore: 0,
    lastUpdated: Date.now(),
    totalFrames: 0,
    maxFrames: 3, // Reduced from 5 to 3 for better memory management
  });
  const [baselineMetrics, setBaselineMetrics] = useState<{
    scanTime: number;
    confidence: number;
    successRate: number;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    const protectionStatus = getProtectionStatus();
    if (protectionStatus.environment === 'development') {
      console.log('🛠️ VIN SCANNER: Development mode');
    } else {
      console.log('📱 VIN SCANNER: VisiblePaths Inc. © 2025');
    }
  }, []);

  useEffect(() => {
    startMemoryMonitoring();
    return () => stopMemoryMonitoring();
  }, []);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setImageURICache((prev) => {
        if (prev.size > 5) {
          console.log(
            `🗑️ OPTIMIZATION: Cleaning up ${prev.size} cached image URIs`
          );
          return new Set(); // Clear all cached URIs
        }
        return prev;
      });
    }, 30000); // Cleanup every 30 seconds (reduced from 60)

    return () => clearInterval(cleanupInterval);
  }, []);

  const cleanupImageURI = useCallback(async (imageUri: string) => {
    try {
      setImageURICache((prev) => {
        const newSet = new Set(prev);
        newSet.delete(imageUri);
        return newSet;
      });
    } catch (error) {
      console.warn('⚠️ Memory cleanup error:', error);
    }
  }, []);

  const cleanupImageURIs = useCallback(
    async (imageUris: string[]) => {
      if (imageUris.length === 0) return;

      const startTime = Date.now();

      try {
        await Promise.allSettled(imageUris.map((uri) => cleanupImageURI(uri)));

        const cleanupTime = Date.now() - startTime;
        console.log(
          `🗑️ ENHANCED: Cleaned ${imageUris.length} URIs in ${cleanupTime}ms`
        );
      } catch (error) {
        console.warn('⚠️ Enhanced batch memory cleanup error:', error);
      }
    },
    [cleanupImageURI]
  );

  const addFrameToHistory = useCallback(
    (result: VINScanResult, rawOCRText?: string) => {
      const frame: VINScanFrame = {
        vin: result.vin,
        confidence: result.confidence,
        timestamp: Date.now(),
        imageQuality: result.imageQuality || 0.8,
        source: result.source,
        processingTime: result.processingTime || 0,
        attemptNumber: scanHistory.totalFrames + 1,
        rawOCRText: rawOCRText ? rawOCRText.substring(0, 500) : undefined, // Limit raw text size to prevent memory bloat
        correctionApplied: false, // TODO: Track this in step 3.1.2
        screenScanDetected: false, // TODO: Track this in step 3.1.2
        frameId: `frame_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      };

      setScanHistory((prev) => {
        const cutoffTime = Date.now() - 20000;
        const filteredFrames = prev.frames.filter(
          (f) => f.timestamp > cutoffTime
        );

        return {
          ...prev,
          frames: [...filteredFrames.slice(-(prev.maxFrames - 1)), frame], // Keep last maxFrames-1, add new one
          totalFrames: prev.totalFrames + 1,
          lastUpdated: Date.now(),
        };
      });
    },
    [scanHistory.totalFrames, scanHistory.frames.length, scanHistory.maxFrames]
  );

  const getFrameStats = useCallback(() => {
    const stats = {
      totalFrames: scanHistory.totalFrames,
      currentFrames: scanHistory.frames.length,
      maxFrames: scanHistory.maxFrames,
      averageConfidence:
        scanHistory.frames.length > 0
          ? scanHistory.frames.reduce(
              (sum, frame) => sum + frame.confidence,
              0
            ) / scanHistory.frames.length
          : 0,
      averageProcessingTime:
        scanHistory.frames.length > 0
          ? scanHistory.frames.reduce(
              (sum, frame) => sum + frame.processingTime,
              0
            ) / scanHistory.frames.length
          : 0,
      sourceBreakdown: {
        text: scanHistory.frames.filter((f) => f.source === 'text').length,
        barcode: scanHistory.frames.filter((f) => f.source === 'barcode')
          .length,
      },
      recentFrames: scanHistory.frames.slice(-3).map((f) => ({
        frameId: f.frameId,
        vin: f.vin,
        confidence: Math.round(f.confidence * 100),
        source: f.source,
        timestamp: f.timestamp,
      })),
    };

    console.log('📊 PHASE 3.1.1: Frame Statistics:', stats);
    return stats;
  }, [scanHistory]);

  const hasEnoughFramesForConsensus = useCallback(() => {
    const minFrames = 2; // Need at least 2 frames for consensus
    return scanHistory.frames.length >= minFrames;
  }, [scanHistory.frames.length]);

  const getUniqueVINsInHistory = useCallback(() => {
    const uniqueVINs = new Set(scanHistory.frames.map((frame) => frame.vin));
    return Array.from(uniqueVINs);
  }, [scanHistory.frames]);

  const getTemporalFusionResult = useCallback((): VINScanResult | null => {
    if (!hasEnoughFramesForConsensus()) {
      return null;
    }

    const consensus = analyzeVINConsensus(scanHistory);

    if (!consensus.consensusVIN) {
      return null;
    }

    const fusionResult: VINScanResult = {
      vin: consensus.consensusVIN,
      confidence: consensus.confidence,
      source: 'text' as const, // Most frames are likely text-based
    };

    return fusionResult;
  }, [scanHistory, hasEnoughFramesForConsensus]);

  const validateMultiFrameConsensus = useCallback(
    (minFrames: number = 3): string | null => {
      if (scanHistory.frames.length < minFrames) {
        console.log(
          `📊 Not enough frames for consensus: ${scanHistory.frames.length}/${minFrames}`
        );
        return null;
      }

      const recentFrames = scanHistory.frames.slice(-5); // Last 5 frames
      const validVINs = recentFrames
        .filter((frame) => frame.vin.length === 17)
        .map((frame) => frame.vin);

      if (validVINs.length < minFrames) {
        console.log(
          `📊 Not enough valid VINs: ${validVINs.length}/${minFrames}`
        );
        return null;
      }

      const consensusVIN = resolveConsensusVIN(validVINs);

      if (consensusVIN) {
        const consensusFrames = recentFrames.filter(
          (frame) => frame.vin === consensusVIN
        );
        const avgConfidence =
          consensusFrames.reduce((sum, frame) => sum + frame.confidence, 0) /
          consensusFrames.length;

        setScanHistory((prev) => ({
          ...prev,
          consensus: consensusVIN,
          confidenceScore: avgConfidence,
          stabilityScore: consensusFrames.length / recentFrames.length,
        }));

        return consensusVIN;
      }

      return null;
    },
    [scanHistory.frames, resolveConsensusVIN]
  );

  const recordBaselineMetrics = useCallback(
    (scanTime: number, confidence: number, success: boolean) => {
      const metrics = {
        scanTime,
        confidence,
        successRate: success ? 1.0 : 0.0,
        timestamp: Date.now(),
      };

      setBaselineMetrics(metrics);
      featureFlags.recordMetrics({
        scanTime,
        confidence,
        accuracy: success ? 1.0 : 0.0,
        falsePositives: 0, // Will be tracked separately
        falseNegatives: success ? 0 : 1,
        timestamp: Date.now(),
      });

      if (featureFlags.isEnabled('debugLogging')) {
        console.log(`📊 Baseline metrics: ${JSON.stringify(metrics)}`);
      }
    },
    []
  );

  const getAdaptiveInterval = useCallback(() => {
    if (!featureFlags.isEnabled('adaptiveIntervals')) {
      return 2000; // Reduced from 4s to 2s for better responsiveness
    }

    const baseIntervals = [1500, 2500, 4000, 6000]; // Faster progression
    let intervalIndex = Math.min(
      Math.floor(adaptiveConfig.failureCount / 2),
      baseIntervals.length - 1
    );

    const successBonus = adaptiveConfig.failureCount === 0 ? 0.8 : 1.0;
    const adaptiveInterval = Math.floor(
      baseIntervals[intervalIndex] * successBonus
    );

    if (featureFlags.isEnabled('debugLogging')) {
    }

    return adaptiveInterval;
  }, [adaptiveConfig.failureCount]);

  const updateAdaptiveInterval = useCallback(
    (success: boolean) => {
      if (!featureFlags.isEnabled('adaptiveIntervals')) {
        return;
      }

      setAdaptiveConfig((prev) => ({
        ...prev,
        failureCount: success ? 0 : prev.failureCount + 1, // Reset on success, increment on failure
        lastScanTime: Date.now(),
      }));

      if (featureFlags.isEnabled('debugLogging')) {
        console.log(
          `⏱️ Adaptive interval updated: success=${success}, failures=${adaptiveConfig.failureCount}`
        );
      }
    },
    [adaptiveConfig.failureCount]
  );

  const canScanNow = useCallback(() => {
    if (!featureFlags.isEnabled('adaptiveIntervals')) {
      return true;
    }

    const now = Date.now();
    const timeSinceLastScan = now - adaptiveConfig.lastScanTime;
    const requiredInterval = getAdaptiveInterval();

    return timeSinceLastScan >= requiredInterval;
  }, [adaptiveConfig.lastScanTime, getAdaptiveInterval]);

  const scanVINInParallel = useCallback(
    async (imageUri: string): Promise<ParallelScanResult> => {
      const startTime = Date.now();

      try {
        const [barcodeResult, textResult] = await Promise.all([
          scanVINWithBarcode(imageUri).catch((err: Error) => {
            console.error('🔍 DEBUG: Barcode scan error caught:', err);
            return null;
          }),
          scanVINWithText(imageUri).catch((err: Error) => {
            console.error('🔍 DEBUG: Text scan error caught:', err);
            return null;
          }),
        ]);

        const processingTime = Date.now() - startTime;

        if (barcodeResult) {
        }
        if (textResult) {
        }

        // Determine best result
        let bestResult: VINScanResult | null = null;
        let confidenceReason = 'No valid results';

        if (barcodeResult && textResult) {
          // Both found results - pick higher confidence
          if (barcodeResult.confidence >= textResult.confidence) {
            bestResult = barcodeResult;
            confidenceReason = `Barcode preferred (${Math.round(
              barcodeResult.confidence * 100
            )}% vs ${Math.round(textResult.confidence * 100)}%)`;
          } else {
            bestResult = textResult;
            confidenceReason = `Text preferred (${Math.round(
              textResult.confidence * 100
            )}% vs ${Math.round(barcodeResult.confidence * 100)}%)`;
          }
        } else if (barcodeResult) {
          bestResult = barcodeResult;
          confidenceReason = `Barcode only (${Math.round(
            barcodeResult.confidence * 100
          )}%)`;
        } else if (textResult) {
          bestResult = textResult;
          confidenceReason = `Text only (${Math.round(
            textResult.confidence * 100
          )}%)`;
        }

        console.log(
          `🎯 PHASE 2: Best result: ${
            bestResult?.vin || 'none'
          } - ${confidenceReason}`
        );

        // DEBUGGING: Log the final parallel result
        const finalResult = {
          barcode: barcodeResult,
          text: textResult,
          processingTime,
          bestResult,
          confidenceReason,
        };

        console.log(
          `🔍 DEBUG: Final parallel result:`,
          JSON.stringify(finalResult)
        );
        console.log(
          `🔍 DEBUG: About to return finalResult from scanVINInParallel`
        );

        return finalResult;
      } catch (error) {
        console.error(
          '🔍 DEBUG: Unexpected error in scanVINInParallel:',
          error
        );

        // Return a safe fallback result
        const fallbackResult = {
          barcode: null,
          text: null,
          processingTime: Date.now() - startTime,
          bestResult: null,
          confidenceReason: `Error: ${error}`,
        };

        console.log(
          `🔍 DEBUG: Returning fallback result due to error:`,
          JSON.stringify(fallbackResult)
        );
        return fallbackResult;
      }
    },
    []
  );

  // Enhanced main scanning function with Adaptive Attempt Strategy from plan
  const scanImage = useCallback(
    async (imageUri: string): Promise<VINScanResult | null> => {
      if (isScanning) return null;

      // Phase 1.3: Check adaptive interval
      if (!canScanNow()) {
        if (featureFlags.isEnabled('debugLogging')) {
          console.log('⏳ Skipping scan due to adaptive interval');
        }
        return null;
      }

      // 🛡️ SIMPLE HANG PREVENTION: Only timeout after 30 seconds to prevent infinite hangs
      const HANG_PREVENTION_TIMEOUT = 30000; // 30 seconds - allows normal 10-15s scans
      let hangPreventionTimer: any = null;
      let scanAborted = false;

      try {
        setIsScanning(true);
        setError(null);

        const overallStartTime = Date.now();
        let attempt = 0;
        let result: VINScanResult | null = null;

        // Set up hang prevention timeout
        hangPreventionTimer = setTimeout(() => {
          scanAborted = true;
          console.warn(
            '🛡️ HANG PREVENTION: Scan exceeded 30 seconds - preventing infinite hang'
          );
        }, HANG_PREVENTION_TIMEOUT);

        // 🎯 ENHANCED: Smart quality-based attempt control with adaptive thresholds
        const initialQuality = await analyzeImageQuality(imageUri);
        const qualityScore = initialQuality.contrast;
        const brightnessScore = initialQuality.brightness;

        // 🚀 ENHANCED: Multi-factor quality assessment
        const overallQuality = qualityScore * 0.7 + brightnessScore * 0.3;
        const hasIssues = initialQuality.isBlurry || initialQuality.hasGlare;

        // Smart attempt calculation based on multiple factors
        let maxAttempts = 1; // PERFORMANCE: Default to 1 attempt for speed
        if (overallQuality >= 0.8 && !hasIssues) {
          maxAttempts = 1; // High quality: 1 attempt (fast)
        } else if (overallQuality >= 0.6) {
          maxAttempts = 1; // Good quality: 1 attempt (optimized for speed)
        } else if (overallQuality >= 0.3) {
          maxAttempts = 2; // Poor quality: 2 attempts (reduced from 3)
        } else {
          // FIXED: Lower threshold from 0.4 to 0.3 and make it less strict
          console.log(
            '⚠️ ENHANCED: Very poor quality detected - giving it one attempt anyway'
          );
          console.log(
            '💡 ENHANCED: Try better lighting, less glare, or reduce camera shake'
          );
          maxAttempts = 1; // Still give it a chance instead of skipping completely
        }

        console.log(
          `🎯 ENHANCED: Quality ${overallQuality.toFixed(
            2
          )} (contrast: ${qualityScore.toFixed(
            2
          )}, brightness: ${brightnessScore.toFixed(
            2
          )}, issues: ${hasIssues}) → ${maxAttempts} attempts`
        );

        // ⚡ PERFORMANCE OPTIMIZED: Sequential processing with barcode-first strategy
        while (attempt < maxAttempts && !result && !scanAborted) {
          const quality = getProgressiveQuality(attempt);

          if (featureFlags.isEnabled('debugLogging')) {
            console.log(
              `🚀 Starting optimized VIN scan attempt ${
                attempt + 1
              }/${maxAttempts} (quality: ${quality})`
            );
          }

          const attemptStartTime = Date.now();

          // 🚀 CHECKPOINT 1: Parallel processing for maximum speed
          console.log('⚡ Running parallel barcode + text recognition...');
          console.log(
            '🔍 DEBUG: About to call scanVINInParallel from scanImage'
          );

          const parallelResult = await scanVINInParallel(imageUri);

          console.log(
            `🔍 DEBUG: Parallel result received in scanImage:`,
            JSON.stringify(parallelResult)
          );
          console.log(
            '🔍 DEBUG: Checking if parallelResult.bestResult exists...'
          );

          if (parallelResult.bestResult) {
            console.log(
              `🔍 DEBUG: Found bestResult in parallelResult:`,
              JSON.stringify(parallelResult.bestResult)
            );

            // 🎯 VIN LENGTH VALIDATION from plan: Immediate validation
            if (parallelResult.bestResult.vin.length !== 17) {
              console.log(
                `⚠️ PLAN VALIDATION: VIN invalid length (${parallelResult.bestResult.vin.length}), rejecting`
              );
              attempt++;
              continue;
            }

            result = parallelResult.bestResult;
            console.log(
              `✅ VIN found via ${parallelResult.bestResult.source}: ${
                result.vin
              } (${Math.round(result.confidence * 100)}%)`
            );
            console.log(
              `🔍 DEBUG: Result assigned in scanImage:`,
              JSON.stringify(result)
            );
            console.log(
              `⚡ CHECKPOINT 1: Parallel processing saved ${Math.max(
                0,
                1000 - parallelResult.processingTime
              )}ms`
            );

            // 🚀 ENHANCED: Smart early success detection for high-confidence results
            if (result.confidence >= 0.9 && result.source === 'barcode') {
              console.log(
                `⚡ ENHANCED: High-confidence barcode (${Math.round(
                  result.confidence * 100
                )}%) - skipping additional processing`
              );
              break; // Exit immediately for high-confidence barcodes
            }

            // PERFORMANCE: Lower threshold for early exit to speed up scanning
            if (result.confidence >= 0.8) {
              console.log(
                `⚡ PERFORMANCE: Good confidence result (${Math.round(
                  result.confidence * 100
                )}%) - early exit`
              );
              break; // Exit early for any good results
            }

            if (result.confidence >= 0.75 && overallQuality >= 0.6) {
              console.log(
                `⚡ ENHANCED: Decent confidence with acceptable quality - early success`
              );
              break; // Exit early for decent results with good quality
            }

            const textResult = parallelResult.text || parallelResult.bestResult;

            if (featureFlags.isEnabled('enhancedConfidence')) {
              const enhancedConfidence = Math.min(
                result.confidence * 1.05,
                0.98
              ); // Simple 5% boost

              console.log(
                `🎯 PERFORMANCE: Simplified confidence: ${Math.round(
                  enhancedConfidence * 100
                )}% - accepting result`
              );

              result = {
                ...result,
                confidence: enhancedConfidence,
              };

              console.log(
                `⚡ PERFORMANCE: Accepting result immediately to save time`
              );
            }

            break;
          }

          const attemptTime = Date.now() - attemptStartTime;
          if (featureFlags.isEnabled('debugLogging')) {
            console.log(
              `⏱️ Attempt ${attempt + 1} completed in ${attemptTime}ms`
            );
          }

          attempt++;

          if (attempt >= maxAttempts && qualityScore < 0.7) {
            console.log(
              `⚠️ ADAPTIVE STRATEGY: Stopping after ${attempt} attempts due to poor quality (${qualityScore.toFixed(
                2
              )})`
            );
            console.log(
              '💡 PLAN RECOMMENDATION: Try better lighting, closer distance, or manual entry'
            );
            break;
          }
        }

        if (!result && attempt < maxAttempts) {
          console.log(`🔄 ENHANCED: Applying intelligent retry logic...`);

          const shouldTryRegionFocus =
            overallQuality >= 0.5 && !initialQuality.isBlurry;
          if (shouldTryRegionFocus) {
            console.log(
              `🎯 ENHANCED: Quality sufficient for region-focused retry`
            );
            // Future enhancement: Could implement ROI-focused scanning here
          }

          // Adaptive backoff based on previous attempts
          const retryDelay = Math.min(100 * Math.pow(2, attempt), 1000); // 100ms, 200ms, 400ms, 800ms, 1000ms max
          console.log(
            `⏳ ENHANCED: Adaptive backoff: ${retryDelay}ms delay before retry`
          );

          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }

        // Clear hang prevention timer
        if (hangPreventionTimer) {
          clearTimeout(hangPreventionTimer);
          hangPreventionTimer = null;
        }

        const totalTime = Date.now() - overallStartTime;
        const success = result !== null;

        // 🚀 ENHANCED: Smart result post-processing
        if (result) {
          // Apply final confidence boosters based on overall scan quality
          if (result.confidence < 0.8 && overallQuality >= 0.8) {
            const qualityBonus = (overallQuality - 0.8) * 0.2; // Up to 4% bonus
            result.confidence = Math.min(
              result.confidence + qualityBonus,
              0.98
            );
            console.log(
              `🎯 ENHANCED: Applied quality bonus: +${Math.round(
                qualityBonus * 100
              )}% (final: ${Math.round(result.confidence * 100)}%)`
            );
          }

          // Smart manufacturer validation bonus
          const manufacturerCode = result.vin.substring(0, 2);
          const isKnownManufacturer = [
            '1G',
            '1C',
            '1F',
            '1H',
            '2G',
            '3G',
            '4F',
            '5F',
          ].includes(manufacturerCode);
          if (isKnownManufacturer && result.confidence < 0.9) {
            result.confidence = Math.min(result.confidence + 0.05, 0.98);
            console.log(
              `🎯 ENHANCED: Known manufacturer bonus for ${manufacturerCode}: +5%`
            );
          }
        }

        // 🎯 PERFORMANCE METRICS from plan: Track against targets
        const performanceTargets = {
          accuracy: { current: success ? 100 : 0, target: 85 },
          scanTime: { current: totalTime, target: 1500 },
          confidence: { current: result?.confidence || 0, target: 0.9 },
        };

        console.log(
          `📊 PLAN METRICS: Accuracy ${performanceTargets.accuracy.current}% (target: ${performanceTargets.accuracy.target}%)`
        );
        console.log(
          `📊 PLAN METRICS: Scan time ${performanceTargets.scanTime.current}ms (target: ${performanceTargets.scanTime.target}ms)`
        );
        console.log(
          `📊 PLAN METRICS: Confidence ${Math.round(
            performanceTargets.confidence.current * 100
          )}% (target: ${Math.round(
            performanceTargets.confidence.target * 100
          )}%)`
        );

        // 🎯 PERFORMANCE BENCHMARKING from plan: Comprehensive tracking
        const benchmarkResults = trackPerformanceAgainstTargets(
          result,
          totalTime
        );

        if (benchmarkResults.overallPass) {
          console.log(`🎯 PLAN SUCCESS: All performance targets met!`);
        } else {
          console.log(
            `⚠️ PLAN TARGETS: Some targets not met - see benchmark above`
          );
        }

        updateAdaptiveInterval(success);

        recordBaselineMetrics(totalTime, result?.confidence || 0, success);

        if (featureFlags.isEnabled('debugLogging')) {
          console.log(
            `📊 Total scan time: ${totalTime}ms, Success: ${success}`
          );
          if (featureFlags.isEnabled('performanceMetrics')) {
            console.log(
              `📈 Performance summary:`,
              featureFlags.getPerformanceSummary()
            );
          }
        }

        // DEBUGGING: Log the final result being returned
        console.log(
          `🔍 DEBUG: scanImage returning result:`,
          result ? JSON.stringify(result) : 'null'
        );
        console.log(`🔍 DEBUG: scanImage success: ${success}`);

        return result;
      } catch (error) {
        console.error('❌ Scan error:', error);
        setError(
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
        return null;
      } finally {
        setIsScanning(false);
        if (hangPreventionTimer) {
          clearTimeout(hangPreventionTimer);
        }
      }
    },
    [
      isScanning,
      canScanNow,
      featureFlags,
      scanVINInParallel,
      analyzeImageQuality,
      getProgressiveQuality,
      detectScreenScan,
      shouldSkipTextProcessing,
      addFrameToHistory,
      updateAdaptiveInterval,
      recordBaselineMetrics,
      trackPerformanceAgainstTargets,
    ]
  );

  const scanVINWithBarcode = async (
    imageUri: string
  ): Promise<VINScanResult | null> => {
    if (!BarcodeScanning) return null;

    const processedImages: string[] = [];

    try {
      const startTime = Date.now();

      const optimizedImage = await optimizeImageForMLKit(imageUri);
      processedImages.push(optimizedImage);

      const barcodeResults = await BarcodeScanning.scan(optimizedImage);
      const processingTime = Date.now() - startTime;

      if (barcodeResults && barcodeResults.length > 0) {
        for (const barcode of barcodeResults) {
          const barcodeData = barcode.value?.trim().toUpperCase();
          console.log(
            `🔍 Barcode found: "${barcodeData}" (${processingTime}ms)`
          );

          if (
            barcodeData &&
            barcodeData.length === 17 &&
            validateVIN(barcodeData)
          ) {
            console.log(`✅ Valid barcode VIN: ${barcodeData}`);
            console.log(
              `⚡ OPTIMIZATION: Barcode scan completed in ${processingTime}ms with optimized processing`
            );

            // Clean up processed images immediately
            cleanupImageURIs(processedImages);

            return {
              vin: barcodeData,
              confidence: 0.98,
              source: 'barcode' as const,
              barcodeFormat: barcode.format,
              processingTime,
            };
          }

          const corrected = correctVINCharacters(barcodeData || '');
          if (corrected.length === 17 && validateVIN(corrected)) {
            const confidence = calculateConfidence(
              barcodeData || '',
              corrected,
              barcodeData || ''
            );
            if (confidence > 0.7) {
              console.log(
                `✅ Corrected barcode VIN: ${barcodeData} → ${corrected} (${Math.round(
                  confidence * 100
                )}%)`
              );

              cleanupImageURIs(processedImages);

              return {
                vin: corrected,
                confidence,
                source: 'barcode' as const,
                barcodeFormat: barcode.format,
                processingTime,
              };
            }
          }
        }
      }

      cleanupImageURIs(processedImages);
      return null;
    } catch (error) {
      cleanupImageURIs(processedImages);
      return null;
    }
  };

  const scanVINWithText = async (
    imageUri: string
  ): Promise<VINScanResult | null> => {
    if (!TextRecognition) return null;

    const processedImages: string[] = [];

    try {
      const startTime = Date.now();

      const initialQuality = await analyzeImageQuality(imageUri);

      let finalImage = imageUri;
      processedImages.push(finalImage);

      if (initialQuality.needsEnhancement && initialQuality.contrast < 0.5) {
        const enhancedImage = await processImageWithEnhancements(imageUri);
        processedImages.push(enhancedImage);
        finalImage = enhancedImage;
      } else {
      }

      if (initialQuality.isBlurry || initialQuality.contrast < 0.2) {
        cleanupImageURIs(processedImages);
        return null;
      }

      const textResults = await TextRecognition.recognize(finalImage);
      const processingTime = Date.now() - startTime;

      if (textResults && textResults.text) {
        console.log(
          `📄 ENHANCED: Raw text length: ${textResults.text.length} characters`
        );

        const vinResult = extractVINFromText(textResults.text);
        if (vinResult) {
          let adjustedConfidence = vinResult.confidence;

          if (initialQuality.hasGlare) adjustedConfidence *= 0.9;
          if (initialQuality.isBlurry) adjustedConfidence *= 0.8;
          if (initialQuality.contrast < 0.5) adjustedConfidence *= 0.85;

          if (
            initialQuality.needsEnhancement &&
            initialQuality.recommendedEnhancement !== 'none'
          ) {
            adjustedConfidence *= 1.1; // Bonus for successfully enhanced image
            console.log(
              `🎨 ENHANCED: Applied enhancement bonus for ${initialQuality.recommendedEnhancement}`
            );
          }

          if (initialQuality.brightness < 0.3 && adjustedConfidence > 0.7) {
            adjustedConfidence *= 1.15; // Extra bonus for dark background success
            console.log(`🌙 ENHANCED: Applied dark background success bonus`);
          }

          adjustedConfidence = Math.min(adjustedConfidence, 0.98); // Cap at 98%

          cleanupImageURIs(processedImages);

          const finalResult = {
            vin: vinResult.vin,
            confidence: adjustedConfidence,
            source: 'text' as const,
            processingTime,
            imageQuality: initialQuality.contrast,
          };

          return finalResult;
        }
      }

      cleanupImageURIs(processedImages);
      console.log(`🔍 DEBUG: scanVINWithText returning null - no VIN found`);
      return null;
    } catch (error) {
      cleanupImageURIs(processedImages);
      return null;
    }
  };

  return {
    scanImage,
    scanBarcodeFromCamera,
    isScanning,
    error,
    enablePhase1Feature,
    disablePhase1Feature,
    enableAllPhase1Features,
    getPhase1Status,
    enableAllPhase2Features,
    getPhase2Status,
    scanVINInParallel,
    calculateStabilityScore: () => calculateStabilityScore(scanHistory.frames),
    analyzeCharacterInconsistencies: () =>
      analyzeCharacterInconsistencies(scanHistory.frames),
    enhanceImageForOCR,
    shouldSkipTextProcessing,
    getPhase3Status: () => ({
      imagePreprocessing: featureFlags.isEnabled('imagePreprocessing'),
      contextAwareDetection: featureFlags.isEnabled('contextAwareDetection'),
      multiFrameAnalysis: featureFlags.isEnabled('multiFrameAnalysis'),
      frameCount: scanHistory.frames.length,
      maxFrames: scanHistory.maxFrames,
    }),

    baselineMetrics,
    getPerformanceStats: () => featureFlags.getPerformanceSummary(),

    validateVIN,
    correctVINCharacters,

    analyzeImageQuality,
    isLikelyNonVINText,
    findVINWithContext,
    extractVINFromText,

    debugFordVINIssue: (simulatedOCRText: string): void => {
      console.log('🚨 Input text:', simulatedOCRText);

      const corrected = correctVINCharacters(simulatedOCRText);
      console.log('🚨 After character correction:', corrected);

      const advanced = correctVINCharacters(simulatedOCRText);

      const result = extractVINFromText(simulatedOCRText);
      console.log('🚨 Final extraction result:', result);

      if (
        simulatedOCRText.includes('1FMCU0F70KUA12345') &&
        result?.vin === '1FMCU1F70KUA12345'
      ) {
        console.error('🚨 CONFIRMED: 0→1 conversion detected!');
      }
    },

    validateVINContext,
    generateUserFeedback,

    addToScanHistory: (
      vin: string,
      confidence: number,
      imageQuality: number,
      source: 'text' | 'barcode' = 'text',
      processingTime: number = 0,
      rawOCRText?: string
    ) => {
      setScanHistory((prev) => ({
        ...prev,
        frames: [
          ...prev.frames.slice(-4),
          {
            vin,
            confidence,
            timestamp: Date.now(),
            imageQuality,
            source,
            processingTime,
            attemptNumber: prev.totalFrames + 1,
            rawOCRText,
            correctionApplied: false, // TODO: Track this in step 3.1.2
            screenScanDetected: false, // TODO: Track this in step 3.1.2
            frameId: `frame_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
          },
        ],
        totalFrames: prev.totalFrames + 1,
        lastUpdated: Date.now(),
      }));
    },
    addFrameToHistory,
    getFrameStats,
    hasEnoughFramesForConsensus,
    getUniqueVINsInHistory,
    analyzeConsensus: () => analyzeVINConsensus(scanHistory),
    clearScanHistory: () =>
      setScanHistory({
        frames: [],
        consensus: null,
        confidenceScore: 0,
        stabilityScore: 0,
        lastUpdated: Date.now(),
        totalFrames: 0,
        maxFrames: 5,
      }),

    getROIBounds,
    scanHistory: scanHistory,
    getTemporalFusionResult,
    optimizeImageForMLKit,
    cleanupImageURI,
    cleanupImageURIs,
    imageURICache,
    getOptimalROIForVIN,
    validateMultiFrameConsensus,
    resolveConsensusVIN,
    extractVINWithProfessionalValidation,
    validateVINLength,
    createTestSuite,
    trackPerformanceAgainstTargets,
    getConfidenceContext,
  };
};
