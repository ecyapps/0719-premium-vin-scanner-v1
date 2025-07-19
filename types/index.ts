/**
 * @fileoverview Types Index
 * @description Centralized exports for all type definitions, validation utilities, and mock data
 * @related All app components use these exports for type safety
 */

import type {
  VINScanResult,
  ScanningState,
  ScanningType,
  VINValidationResult,
  VehicleInfo,
  EngineInfo,
  TransmissionInfo,
  VehicleImage,
  VehicleSpecifications,
  FuelEconomy,
  VehiclePricing,
  PriceHistoryPoint,
  MarketConditions,
  VehicleAnalysis,
  MarketAnalysis,
  ComparableVehicle,
  RegionalPricing,
  LeveragePoint,
  VehicleInsight,
  InsightAction,
  UserPreferences,
  NotificationPreferences,
  RegionalSettings,
  PrivacySettings,
  UIPreferences,
  AccessibilityOptions,
  ScanRecord,
  ScanMetadata,
  DeviceInfo,
  LocationInfo,
  ScanPerformance,
  APIResponse,
  APIError,
  APIMetadata,
  RateLimitInfo,
  PaginationParams,
  PaginatedResponse,
  PaginationInfo,
  LoadingState
} from './core';

// =============================================================================
// CORE TYPE DEFINITIONS
// =============================================================================

export type {
  // VIN and Scanning Types
  VINScanResult,
  ScanningState,
  ScanningType,
  VINValidationResult,

  // Vehicle Information Types
  VehicleInfo,
  EngineInfo,
  TransmissionInfo,
  VehicleImage,
  VehicleSpecifications,
  FuelEconomy,

  // Pricing and Market Data Types
  VehiclePricing,
  PriceHistoryPoint,
  MarketConditions,

  // Analysis and Insights Types
  VehicleAnalysis,
  MarketAnalysis,
  ComparableVehicle,
  RegionalPricing,
  LeveragePoint,
  VehicleInsight,
  InsightAction,

  // User and Session Types
  UserPreferences,
  NotificationPreferences,
  RegionalSettings,
  PrivacySettings,
  UIPreferences,
  AccessibilityOptions,

  // Scan History and Persistence Types
  ScanRecord,
  ScanMetadata,
  DeviceInfo,
  LocationInfo,
  ScanPerformance,

  // API and Error Types
  APIResponse,
  APIError,
  APIMetadata,
  RateLimitInfo,

  // Utility Types
  PaginationParams,
  PaginatedResponse,
  PaginationInfo,
  LoadingState
};

// Re-export type guards and utilities
export {
  isVINScanResult,
  isVehicleInfo,
  isVehiclePricing
} from './core';

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

export {
  // VIN Validation
  validateVIN,
  correctVINCharacters,
  extractVINsFromText,

  // Data Validation Functions
  validateVINScanResult,
  validateVehicleInfo,
  validateVehiclePricing,
  validateUserPreferences,

  // Data Sanitization
  sanitizeVINScanResult,
  sanitizeVehicleInfo,
  sanitizeVehiclePricing,

  // Error Handling Utilities
  createAPIError,
  isAPIError,
  formatErrorForUser,

  // Data Transformation Utilities
  formatCurrency,
  formatDate,
  formatConfidence,
  calculateSavingsPercentage
} from './validation';

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

export {
  // Individual Generators
  generateMockVINScanResult,
  generateMockVehicleInfo,
  generateMockVehiclePricing,
  generateMockMarketAnalysis,
  generateMockLeveragePoints,
  generateMockVehicleInsights,
  generateMockVehicleAnalysis,
  generateMockUserPreferences,
  generateMockScanRecord,
  generateMockScanHistory,
  generateMockAPIResponse,
  generateMockLoadingState,
  generateMockPaginatedResponse,

  // Convenience Object
  mockData
} from './mock-data';

// =============================================================================
// CONVENIENCE RE-EXPORTS AND UTILITIES
// =============================================================================

/**
 * Commonly used type combinations for easier imports
 */
export type ScanResultWithAnalysis = {
  scanResult: VINScanResult;
  analysis?: VehicleAnalysis;
};

export type VehicleWithPricing = {
  vehicle: VehicleInfo;
  pricing: VehiclePricing;
};

export type AnalysisWithInsights = {
  analysis: VehicleAnalysis;
  leveragePoints: LeveragePoint[];
  insights: VehicleInsight[];
};

/**
 * Common API response types
 */
export type VINScanResponse = APIResponse<VINScanResult>;
export type VehicleAnalysisResponse = APIResponse<VehicleAnalysis>;
export type ScanHistoryResponse = PaginatedResponse<ScanRecord>;
export type UserPreferencesResponse = APIResponse<UserPreferences>;

/**
 * Common loading states
 */
export type VINScanLoadingState = LoadingState<VINScanResult>;
export type VehicleAnalysisLoadingState = LoadingState<VehicleAnalysis>;
export type ScanHistoryLoadingState = LoadingState<ScanRecord[]>;
export type UserPreferencesLoadingState = LoadingState<UserPreferences>;

/**
 * Hook return types for common data fetching patterns
 */
export type UseVINScannerReturn = {
  scanImage: (imageUri: string) => Promise<VINScanResult | null>;
  scanBarcodeFromCamera: (data: string) => Promise<VINScanResult | null>;
  isScanning: boolean;
  error: string | null;
  validateVIN: (vin: string) => boolean;
  extractVINFromText: (text: string) => string | null;
  correctVINCharacters: (text: string) => string;
};

export type UseVehicleAnalysisReturn = {
  analyzeVehicle: (vin: string) => Promise<VehicleAnalysis | null>;
  isAnalyzing: boolean;
  analysis: VehicleAnalysis | null;
  error: APIError | null;
  lastUpdated: Date | null;
};

export type UseScanHistoryReturn = {
  scans: ScanRecord[];
  isLoading: boolean;
  error: APIError | null;
  addScan: (scan: ScanRecord) => void;
  removeScan: (scanId: string) => void;
  updateScan: (scanId: string, updates: Partial<ScanRecord>) => void;
  clearHistory: () => void;
  favoriteStates: Record<string, boolean>;
  toggleFavorite: (scanId: string) => void;
};

export type UseUserPreferencesReturn = {
  preferences: UserPreferences;
  isLoading: boolean;
  error: APIError | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
};

/**
 * Component prop types for common patterns
 */
export type VehicleCardProps = {
  vehicle: VehicleInfo;
  pricing?: VehiclePricing;
  onPress?: () => void;
  showPricing?: boolean;
  compact?: boolean;
};

export type ScanResultCardProps = {
  scanResult: VINScanResult;
  analysis?: VehicleAnalysis;
  onViewDetails?: () => void;
  onAnalyze?: () => void;
  showActions?: boolean;
};

export type PricingCardProps = {
  pricing: VehiclePricing;
  showDetails?: boolean;
  onNegotiate?: () => void;
  currency?: string;
};

export type InsightCardProps = {
  insight: VehicleInsight;
  onAction?: (action: InsightAction) => void;
  compact?: boolean;
};

export type LeveragePointCardProps = {
  leveragePoint: LeveragePoint;
  onViewEvidence?: () => void;
  showEvidence?: boolean;
};

/**
 * Form data types
 */
export type ManualVINFormData = {
  vin: string;
  isValid: boolean;
  errors: string[];
};

export type UserPreferencesFormData = {
  autoScanEnabled: boolean;
  notifications: NotificationPreferences;
  region: RegionalSettings;
  privacy: PrivacySettings;
  ui: UIPreferences;
};

export type ScanFilterFormData = {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  vehicleFilters?: {
    make?: string;
    model?: string;
    yearRange?: {
      min: number;
      max: number;
    };
  };
  priceFilters?: {
    minSavings?: number;
    maxPrice?: number;
  };
  tags?: string[];
  favoriteOnly?: boolean;
};

/**
 * Navigation types
 */
export type ScannerStackParamList = {
  Scanner: undefined;
  Results: {
    vin: string;
    confidence: string;
    source: string;
  };
  ManualVIN: undefined;
  ScanningTips: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Negotiation: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Scanner: undefined;
  Results: {
    vin: string;
    confidence?: string;
    source?: string;
  };
  VehicleDetails: {
    vin: string;
  };
  Settings: undefined;
  Privacy: undefined;
  About: undefined;
};

// =============================================================================
// CONSTANTS AND ENUMS
// =============================================================================

/**
 * Application constants
 */
export const APP_CONSTANTS = {
  VIN_LENGTH: 17,
  MIN_CONFIDENCE_SCORE: 0.7,
  MAX_SCAN_ATTEMPTS: 3,
  DEFAULT_PAGINATION_LIMIT: 10,
  MAX_SCAN_HISTORY: 100,
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  API_TIMEOUT_MS: 30 * 1000, // 30 seconds
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE_MB: 5,
} as const;

/**
 * Scanning configuration
 */
export const SCANNING_CONFIG = {
  AUTO_SCAN_INTERVAL_MS: 2000,
  CAMERA_QUALITY: 1.0,
  TORCH_ENABLED: false,
  SAVE_TO_GALLERY: false,
  SKIP_PROCESSING: false,
  BARCODE_FORMATS: ['Code128', 'Code39', 'DataMatrix', 'PDF417'] as const,
  TEXT_RECOGNITION_LANGUAGE: 'en',
} as const;

/**
 * UI configuration
 */
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  LOADING_TIMEOUT: 10000,
  TOAST_DURATION: 3000,
  MODAL_BACKDROP_OPACITY: 0.5,
  SCANNING_FRAME_CORNER_SIZE: 20,
  SCANNING_FRAME_BORDER_WIDTH: 2,
} as const;

/**
 * Theme-related constants
 */
export const THEME_CONSTANTS = {
  BREAKPOINTS: {
    SMALL: 480,
    MEDIUM: 768,
    LARGE: 1024,
  },
  SPACING_SCALE: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64] as const,
  BORDER_RADIUS_SCALE: [0, 4, 8, 12, 16, 20, 24, 32] as const,
  FONT_SIZE_SCALE: [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48] as const,
} as const; 