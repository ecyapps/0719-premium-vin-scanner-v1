import { useCallback } from 'react';
import { correctVINCharacters } from './scannerHelperFunctionOne';
import { validateVIN } from './scannerHelperFunctionSix';
import { calculateConfidence } from './scannerHelperFunctionSeven';
import { VINScanResult } from '@/types/scannerFilesValidationTypes';
import { featureFlags } from '@/hooks/useVINScanner';

export const getROIBounds = useCallback(() => {
  return {
    primary: {
      x: 0.2, // 20% from left
      y: 0.3, // 30% from top
      width: 0.6, // 60% of screen width
      height: 0.4, // 40% of screen height
    },

    // VIN-specific regions from the plan
    windshield: {
      x: 0.1,
      y: 0.15,
      width: 0.8,
      height: 0.1,
    },
    doorjamb: {
      x: 0.05,
      y: 0.7,
      width: 0.4,
      height: 0.08,
    },

    // Additional common VIN locations
    dashboard: {
      x: 0.15,
      y: 0.25,
      width: 0.7,
      height: 0.15,
    },

    // Engine bay (less common but possible)
    engineBay: {
      x: 0.2,
      y: 0.4,
      width: 0.6,
      height: 0.2,
    },
  };
}, []);

export const getOptimalROIForVIN = useCallback(() => {
  const regions = getROIBounds();

  return [
    regions.primary, // Always try primary region first
    regions.windshield, // High probability for VIN location
    regions.doorjamb, // Common VIN location
    regions.dashboard, // Alternative VIN location
  ];
}, [getROIBounds]);

// 🎯 TESTING PROTOCOL from plan: 500+ VIN test cases
export const createTestSuite = useCallback(() => {
  const testVINs = [
    // Known working VINs
    '1HGCM82633A004352',
    '1FTFW1ET5DFC10312',
    '1GCEC14X03Z123456',
    '1FMCU0F70KUA12345',

    // Character recognition test cases (from plan)
    '1HGCM82633A0O4352', // O instead of 0
    '1FTFW1ET5DFC1O312', // O instead of 0
    '1GCEC14X03Z1Z3456', // Z instead of 2
    '1FMCU0F70KUA1Z345', // Z instead of 2

    // J→1 confusion cases
    '1HGCM82633A00J352', // J instead of 1
    'JHGCM82633A004352', // J instead of 1 at start
    '1FTFWJET5DFC10312', // J instead of 1

    // C→1 confusion cases
    'CHGCM82633A004352', // C instead of 1
    '1HGCM82633A00C352', // C instead of 1
    '1FTFWCET5DFC10312', // C instead of 1

    // B→8 confusion cases
    '1HGCM82633A004352', // Original
    '1HGCM8B633A004352', // B instead of 8
    '1FTFWBET5DFC10312', // B instead of 8

    // Mixed character errors
    '1HGCM8Z633A0O435Z', // Multiple errors
    'JHGCM8B633A0O4C5Z', // Multiple errors
    '1FTFWBET5DFC1O31Z', // Multiple errors
  ];

  const runVINTest = async (testVIN: string, expectedVIN: string) => {
    console.log(`🧪 Testing VIN: "${testVIN}" → Expected: "${expectedVIN}"`);

    // Test simple character correction
    const corrected = correctVINCharacters(testVIN);
    const hasCorrectVIN = corrected === expectedVIN;

    console.log(`🧪 Correction result: ${corrected}`);
    console.log(`🧪 Test ${hasCorrectVIN ? 'PASSED' : 'FAILED'}: ${testVIN}`);

    return hasCorrectVIN;
  };

  return {
    testVINs,
    runVINTest,
    runFullTestSuite: async () => {
      console.log('🧪 Starting VIN Test Suite (Character Recognition)');
      let passed = 0;
      let total = 0;

      for (const testVIN of testVINs) {
        total++;
        // For demo, assume the first 4 VINs are correct as-is
        const expectedVIN =
          total <= 4
            ? testVIN
            : testVIN
                .replace(/[JC]/g, '1')
                .replace(/O/g, '0')
                .replace(/Z/g, '2')
                .replace(/B/g, '8');

        const result = await runVINTest(testVIN, expectedVIN);
        if (result) passed++;
      }

      const accuracy = (passed / total) * 100;
      console.log(
        `🧪 Test Suite Complete: ${passed}/${total} passed (${accuracy.toFixed(
          1
        )}%)`
      );

      return { passed, total, accuracy };
    },
  };
}, [correctVINCharacters]);

// Add confidence context for user display
export const getConfidenceContext = useCallback(
  (confidence: number, source: 'barcode' | 'text') => {
    if (source === 'barcode') {
      return {
        level: 'excellent',
        message: 'Barcode scan - highly reliable',
        color: 'green',
      };
    } else {
      if (confidence >= 0.85) {
        return {
          level: 'good',
          message: 'Text recognition - very reliable',
          color: 'green',
        };
      } else if (confidence >= 0.7) {
        return {
          level: 'fair',
          message: 'Text recognition - generally reliable',
          color: 'yellow',
        };
      } else {
        return {
          level: 'low',
          message: 'Text recognition - please verify',
          color: 'orange',
        };
      }
    }
  },
  []
);

export const validateVINLength = useCallback(
  (
    vin: string
  ): {
    isValid: boolean;
    message: string;
    shouldTriggerHaptic: boolean;
  } => {
    const cleanVIN = vin.replace(/[^A-HJ-NPR-Z0-9]/g, '');
    const length = cleanVIN.length;

    if (length === 0) {
      return {
        isValid: false,
        message: 'Enter VIN number',
        shouldTriggerHaptic: false,
      };
    }

    if (length < 17) {
      return {
        isValid: false,
        message: `VIN must be 17 characters (${length}/17)`,
        shouldTriggerHaptic: false,
      };
    }

    if (length > 17) {
      return {
        isValid: false,
        message: `VIN too long (${length}/17)`,
        shouldTriggerHaptic: true, // Trigger haptic for invalid input
      };
    }

    if (length === 17) {
      return {
        isValid: true,
        message: 'VIN length valid ✓',
        shouldTriggerHaptic: true, // Trigger haptic for valid input
      };
    }

    return {
      isValid: false,
      message: 'Invalid VIN format',
      shouldTriggerHaptic: false,
    };
  },
  []
);

export const getPhase2Status = useCallback(() => {
  return {
    enhancedConfidence: featureFlags.isEnabled('enhancedConfidence'),
    checkDigitValidation: featureFlags.isEnabled('checkDigitValidation'),
    manufacturerValidation: featureFlags.isEnabled('manufacturerValidation'),
    parallelProcessing: featureFlags.isEnabled('enhancedConfidence'), // Parallel processing is controlled by enhancedConfidence
  };
}, []);

// Enhanced barcode scanning from camera data
export const scanBarcodeFromCamera = useCallback(
  async (data: string): Promise<VINScanResult | null> => {
    try {
      console.log('🔍 Processing barcode from camera...');

      // Validate the barcode data
      const cleanData = data.trim().toUpperCase();

      if (cleanData.length === 17 && validateVIN(cleanData)) {
        console.log(`✅ Valid camera barcode VIN: ${cleanData}`);
        return {
          vin: cleanData,
          confidence: 0.98,
          source: 'barcode' as const,
          barcodeFormat: 'camera',
        };
      }

      // Try simple character correction if direct validation fails
      const corrected = correctVINCharacters(cleanData);
      if (corrected.length === 17 && validateVIN(corrected)) {
        const confidence = calculateConfidence(cleanData, corrected, data);
        if (confidence > 0.8) {
          console.log(
            `✅ Corrected camera barcode VIN: ${cleanData} → ${corrected} (${Math.round(
              confidence * 100
            )}%)`
          );
          return {
            vin: corrected,
            confidence,
            source: 'barcode' as const,
            barcodeFormat: 'camera',
          };
        }
      }

      console.log(`❌ Invalid camera barcode data: ${cleanData}`);
      return null;
    } catch (error) {
      console.error('❌ Camera barcode scan error:', error);
      return null;
    }
  },
  [validateVIN, correctVINCharacters, calculateConfidence]
);
