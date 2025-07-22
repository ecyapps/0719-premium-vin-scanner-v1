import { FeatureFlags } from '@/types/scannerFilesValidationTypes';

export const correctVINCharacters = (text: string): string => {
  const original = text.toUpperCase();

  const corrected = original
    .replace(/[IO]/g, '0') // Replace I and O with 0 (VIN doesn't use I or O)
    .replace(/Q/g, '0') // Replace Q with 0 (VIN doesn't use Q)
    .replace(/[^A-HJ-NPR-Z0-9]/g, '');

  return corrected;
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  roiProcessing: false, // DISABLED: ExpoImageManipulator causing errors
  progressiveQuality: false, // Disabled - can slow down scanning
  adaptiveIntervals: false, // Disabled - can cause delays

  enhancedConfidence: true, // PHASE 2: Smart confidence thresholds
  checkDigitValidation: true, // PHASE 2: Mathematical VIN validation
  manufacturerValidation: true, // PHASE 2: WMI code validation

  imagePreprocessing: false, // DISABLED: ExpoImageManipulator causing errors
  contextAwareDetection: true, // PHASE 3: Smart text filtering (fast)
  multiFrameAnalysis: true, // PHASE 3: Multi-frame consensus (async)
  textRecognition: true, // Text recognition module enabled
  barcodeScanning: true, // Barcode scanning module enabled

  debugLogging: true, // Always on for testing
  performanceMetrics: true, // Always on for monitoring
  safetyChecks: true, // Always on for protection
};

export const SCREEN_DETECTION_PATTERNS = {
  digitalPatterns: [
    /\d{2}\/\d{2}\/\d{4}/, // Date formats
    /\d{1,2}:\d{2}:\d{2}/, // Time formats
    /[A-Z]{2,}\s*\d+/, // License plate formats
    /VIN[:\s]*([A-HJ-NPR-Z0-9]{17})/i, // VIN label formats
  ],

  screenQuality: {
    minContrast: 0.4, // Screens have better contrast
    maxGlare: 0.3, // Less glare on screens
    textDensity: 0.15, // More text per area
  },
};

export const detectScreenScan = (
  imageUri: string,
  textContent: string
): boolean => {
  const hasDigitalPattern = SCREEN_DETECTION_PATTERNS.digitalPatterns.some(
    (pattern) => pattern.test(textContent)
  );

  const textDensity =
    textContent.length / (textContent.match(/\s/g) || []).length;
  const hasHighTextDensity =
    textDensity > SCREEN_DETECTION_PATTERNS.screenQuality.textDensity;

  if (hasDigitalPattern || hasHighTextDensity) {
    console.log(
      '📱 PHASE 2: Screen scan detected - applying screen optimizations'
    );
    return true;
  }

  return false;
};

export const VIN_STRUCTURE = {
  getModelYear: (code: string): number | null => {
    const yearCodes: { [key: string]: number[] } = {
      A: [1980, 2010],
      B: [1981, 2011],
      C: [1982, 2012],
      D: [1983, 2013],
      E: [1984, 2014],
      F: [1985, 2015],
      G: [1986, 2016],
      H: [1987, 2017],
      J: [1988, 2018],
      K: [1989, 2019],
      L: [1990, 2020],
      M: [1991, 2021],
      N: [1992, 2022],
      P: [1993, 2023],
      R: [1994, 2024],
      S: [1995, 2025],
      T: [1996, 2026],
      V: [1997, 2027],
      W: [1998, 2028],
      X: [1999, 2029],
      Y: [2000, 2030],
      '1': [2001],
      '2': [2002],
      '3': [2003],
      '4': [2004],
      '5': [2005],
      '6': [2006],
      '7': [2007],
      '8': [2008],
      '9': [2009],
    };

    const years = yearCodes[code];
    if (!years) return null;

    return years[years.length - 1];
  },
  plantCode: /^[A-HJ-NPR-Z0-9]$/,
  wmiPatterns: {
    Ford: [
      '1FA',
      '1FB',
      '1FC',
      '1FD',
      '1FE',
      '1FF',
      '1FG',
      '1FH',
      '1FJ',
      '1FK',
      '1FL',
      '1FM',
    ],
    BMW: ['WBA', 'WBS', 'WBX', '4US', '5UX', '5YM'],
    Honda: ['1HG', '2HG', '3HG', 'JHM', 'JHL'],
    Toyota: [
      '4T1',
      '4T3',
      '5TD',
      'JTD',
      'JTE',
      'JTG',
      'JTH',
      'JTJ',
      'JTK',
      'JTL',
      'JTM',
      'JTN',
    ],
  },
};

export const optimizeImageForMLKit = async (
  imageUri: string
): Promise<string> => {
  return imageUri;
};
