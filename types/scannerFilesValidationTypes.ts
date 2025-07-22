export interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  timestamp: number;
}

export interface VINScanResult {
  vin: string;
  confidence: number;
  source: 'text' | 'barcode';
  barcodeFormat?: string;
  processingTime?: number;
  imageQuality?: number;
}

export interface ScanConfig {
  quality: number;
  adaptiveInterval: number;
  retryCount: number;
  lastScanTime: number;
}

export interface PerformanceMetrics {
  scanTime: number;
  confidence: number;
  accuracy: number;
  falsePositives: number;
  falseNegatives: number;
  timestamp: number;
}

export interface VINScanFrame {
  vin: string;
  confidence: number;
  timestamp: number;
  imageQuality: number;
  source: 'text' | 'barcode';
  processingTime: number;
  attemptNumber: number;
  rawOCRText?: string; // Store original OCR text for debugging
  correctionApplied: boolean; // Track if character correction was applied
  screenScanDetected: boolean; // Track screen scan detection
  frameId: string; // Unique frame identifier
}

export interface VINScanHistory {
  frames: VINScanFrame[]; // Last 5 frames with detailed metadata
  consensus: string | null; // Current consensus VIN
  confidenceScore: number; // Consensus confidence (0-1)
  stabilityScore: number; // Frame-to-frame stability (0-1)
  lastUpdated: number; // Timestamp of last update
  totalFrames: number; // Total frames processed
  maxFrames: number; // Maximum frames to keep (default: 5)
}

export interface ParallelScanResult {
  barcode: VINScanResult | null;
  text: VINScanResult | null;
  processingTime: number;
  bestResult: VINScanResult | null;
  confidenceReason: string;
}

export interface FeatureFlags {
  roiProcessing: boolean;
  progressiveQuality: boolean;
  adaptiveIntervals: boolean;

  enhancedConfidence: boolean;
  checkDigitValidation: boolean;
  manufacturerValidation: boolean;

  imagePreprocessing: boolean;
  contextAwareDetection: boolean;
  multiFrameAnalysis: boolean;
  textRecognition: boolean;
  barcodeScanning: boolean;

  // Safety & Testing
  debugLogging: boolean; // Detailed console logging
  performanceMetrics: boolean; // Speed and accuracy tracking
  safetyChecks: boolean; // Extra validation before changes
}
