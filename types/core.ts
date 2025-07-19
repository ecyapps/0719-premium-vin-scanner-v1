/**
 * @fileoverview Core Type Definitions
 * @description Fundamental data structures and interfaces for the Premium VIN Scanner app
 * @related All components and services use these type definitions
 */

// =============================================================================
// VIN AND SCANNING TYPES
// =============================================================================

/**
 * VIN scanning result from ML Kit or manual entry
 */
export interface VINScanResult {
  /** The detected VIN number (17 characters) */
  vin: string;
  /** Confidence score between 0 and 1 */
  confidence: number;
  /** Source of the VIN detection */
  source: 'text' | 'barcode' | 'manual';
  /** Barcode format if detected via barcode */
  barcodeFormat?: string;
  /** Timestamp when the scan was performed */
  timestamp?: Date;
  /** Raw image URI used for scanning */
  imageUri?: string;
}

/**
 * Scanning states for UI feedback
 */
export type ScanningState = 
  | 'idle'
  | 'scanning'
  | 'detecting'
  | 'processing'
  | 'success'
  | 'error';

/**
 * Scanning types for different use cases
 */
export type ScanningType = 
  | 'vin'
  | 'qr'
  | 'barcode'
  | 'document'
  | 'custom';

/**
 * VIN validation result
 */
export interface VINValidationResult {
  /** Whether the VIN is valid */
  isValid: boolean;
  /** Validation error message if invalid */
  error?: string;
  /** Formatted VIN (cleaned and corrected) */
  formattedVIN?: string;
}

// =============================================================================
// VEHICLE INFORMATION TYPES
// =============================================================================

/**
 * Complete vehicle information decoded from VIN
 */
export interface VehicleInfo {
  /** Vehicle Identification Number */
  vin: string;
  /** Vehicle year */
  year: number;
  /** Vehicle make (e.g., Honda, Toyota) */
  make: string;
  /** Vehicle model (e.g., Accord, Camry) */
  model: string;
  /** Vehicle trim level (e.g., Sport, LE) */
  trim?: string;
  /** Engine information */
  engine?: EngineInfo;
  /** Transmission type */
  transmission?: TransmissionInfo;
  /** Body style (e.g., Sedan, SUV) */
  bodyStyle?: string;
  /** Drive type (e.g., FWD, AWD) */
  driveType?: string;
  /** Fuel type (e.g., Gasoline, Hybrid) */
  fuelType?: string;
  /** Manufacturing country */
  countryOfOrigin?: string;
  /** Vehicle images */
  images?: VehicleImage[];
  /** Vehicle specifications */
  specifications?: VehicleSpecifications;
}

/**
 * Engine specifications
 */
export interface EngineInfo {
  /** Engine displacement in liters */
  displacement?: number;
  /** Number of cylinders */
  cylinders?: number;
  /** Engine configuration (e.g., V6, I4) */
  configuration?: string;
  /** Fuel injection type */
  fuelInjection?: string;
  /** Horsepower */
  horsepower?: number;
  /** Torque in lb-ft */
  torque?: number;
}

/**
 * Transmission specifications
 */
export interface TransmissionInfo {
  /** Transmission type */
  type: 'manual' | 'automatic' | 'cvt' | 'dual-clutch';
  /** Number of speeds */
  speeds?: number;
  /** Detailed description */
  description?: string;
}

/**
 * Vehicle image information
 */
export interface VehicleImage {
  /** Image URL */
  url: string;
  /** Image type (exterior, interior, engine) */
  type: 'exterior' | 'interior' | 'engine' | 'other';
  /** Image description */
  description?: string;
  /** Image order for display */
  order?: number;
}

/**
 * Vehicle specifications
 */
export interface VehicleSpecifications {
  /** Overall length in inches */
  length?: number;
  /** Overall width in inches */
  width?: number;
  /** Overall height in inches */
  height?: number;
  /** Wheelbase in inches */
  wheelbase?: number;
  /** Curb weight in pounds */
  weight?: number;
  /** Cargo capacity in cubic feet */
  cargoCapacity?: number;
  /** Seating capacity */
  seatingCapacity?: number;
  /** EPA fuel economy */
  fuelEconomy?: FuelEconomy;
}

/**
 * EPA fuel economy ratings
 */
export interface FuelEconomy {
  /** City MPG */
  city?: number;
  /** Highway MPG */
  highway?: number;
  /** Combined MPG */
  combined?: number;
}

// =============================================================================
// PRICING AND MARKET DATA TYPES
// =============================================================================

/**
 * Comprehensive pricing information for a vehicle
 */
export interface VehiclePricing {
  /** Current dealer asking price */
  dealerPrice: number;
  /** Market average price */
  marketPrice: number;
  /** Recommended target price for negotiation */
  targetPrice: number;
  /** Potential savings (dealerPrice - targetPrice) */
  potentialSavings: number;
  /** Price history over time */
  priceHistory?: PriceHistoryPoint[];
  /** Market conditions affecting price */
  marketConditions?: MarketConditions;
  /** Pricing confidence score */
  confidence?: number;
  /** Last updated timestamp */
  lastUpdated: Date;
}

/**
 * Historical price data point
 */
export interface PriceHistoryPoint {
  /** Date of the price point */
  date: Date;
  /** Price at that date */
  price: number;
  /** Data source */
  source: string;
}

/**
 * Market conditions affecting vehicle pricing
 */
export interface MarketConditions {
  /** Overall market trend */
  trend: 'rising' | 'falling' | 'stable';
  /** Demand level for this vehicle */
  demand: 'high' | 'medium' | 'low';
  /** Inventory level */
  inventory: 'high' | 'medium' | 'low';
  /** Seasonal factors */
  seasonalFactors?: string[];
  /** Market insights */
  insights?: string[];
}

// =============================================================================
// ANALYSIS AND INSIGHTS TYPES
// =============================================================================

/**
 * Complete vehicle analysis results
 */
export interface VehicleAnalysis {
  /** Vehicle information */
  vehicle: VehicleInfo;
  /** Pricing analysis */
  pricing: VehiclePricing;
  /** Market analysis */
  marketAnalysis: MarketAnalysis;
  /** Negotiation leverage points */
  leveragePoints: LeveragePoint[];
  /** Key insights and recommendations */
  insights: VehicleInsight[];
  /** Analysis confidence score */
  confidence: number;
  /** Analysis timestamp */
  analyzedAt: Date;
}

/**
 * Market analysis data
 */
export interface MarketAnalysis {
  /** Comparable vehicles */
  comparables: ComparableVehicle[];
  /** Market position (overpriced, fair, underpriced) */
  marketPosition: 'overpriced' | 'fair' | 'underpriced';
  /** Price percentile (0-100) */
  pricePercentile: number;
  /** Days on market average */
  daysOnMarket?: number;
  /** Regional price variations */
  regionalVariations?: RegionalPricing[];
}

/**
 * Comparable vehicle for market analysis
 */
export interface ComparableVehicle {
  /** Vehicle information */
  vehicle: Partial<VehicleInfo>;
  /** Current price */
  price: number;
  /** Distance from user in miles */
  distance?: number;
  /** Days listed */
  daysListed?: number;
  /** Mileage */
  mileage?: number;
  /** Condition rating */
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * Regional pricing information
 */
export interface RegionalPricing {
  /** Region name */
  region: string;
  /** Average price in region */
  averagePrice: number;
  /** Price difference from national average */
  priceDifference: number;
  /** Sample size */
  sampleSize: number;
}

/**
 * Negotiation leverage point
 */
export interface LeveragePoint {
  /** Leverage point ID */
  id: string;
  /** Title of the leverage point */
  title: string;
  /** Detailed description */
  description: string;
  /** Impact level on negotiation */
  impact: 'high' | 'medium' | 'low';
  /** Category of leverage */
  category: 'market' | 'vehicle' | 'timing' | 'condition';
  /** Supporting data/evidence */
  evidence?: string[];
}

/**
 * Vehicle insight or recommendation
 */
export interface VehicleInsight {
  /** Insight ID */
  id: string;
  /** Insight type */
  type: 'tip' | 'warning' | 'opportunity' | 'fact';
  /** Insight title */
  title: string;
  /** Detailed message */
  message: string;
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  /** Associated icon name */
  icon?: string;
  /** Action items */
  actions?: InsightAction[];
}

/**
 * Actionable item from an insight
 */
export interface InsightAction {
  /** Action ID */
  id: string;
  /** Action label */
  label: string;
  /** Action type */
  type: 'navigate' | 'share' | 'save' | 'external';
  /** Action data */
  data?: Record<string, any>;
}

// =============================================================================
// USER AND SESSION TYPES
// =============================================================================

/**
 * User preferences and settings
 */
export interface UserPreferences {
  /** Auto-scan enabled */
  autoScanEnabled: boolean;
  /** Notification preferences */
  notifications: NotificationPreferences;
  /** Regional settings */
  region: RegionalSettings;
  /** Privacy settings */
  privacy: PrivacySettings;
  /** UI preferences */
  ui: UIPreferences;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  /** Price drop alerts */
  priceDropAlerts: boolean;
  /** Market trend updates */
  marketUpdates: boolean;
  /** New feature announcements */
  featureUpdates: boolean;
  /** Negotiation reminders */
  negotiationReminders: boolean;
}

/**
 * Regional settings
 */
export interface RegionalSettings {
  /** User's country */
  country: string;
  /** User's state/province */
  state?: string;
  /** User's city */
  city?: string;
  /** ZIP/postal code */
  postalCode?: string;
  /** Currency preference */
  currency: 'USD' | 'CAD' | 'EUR' | 'GBP';
  /** Distance units */
  distanceUnit: 'miles' | 'kilometers';
}

/**
 * Privacy settings
 */
export interface PrivacySettings {
  /** Allow analytics tracking */
  analytics: boolean;
  /** Allow location tracking */
  location: boolean;
  /** Allow crash reporting */
  crashReporting: boolean;
  /** Data sharing with partners */
  dataSharing: boolean;
}

/**
 * UI preferences
 */
export interface UIPreferences {
  /** Theme preference */
  theme: 'light' | 'dark' | 'auto';
  /** Language preference */
  language: string;
  /** Accessibility options */
  accessibility: AccessibilityOptions;
}

/**
 * Accessibility options
 */
export interface AccessibilityOptions {
  /** High contrast mode */
  highContrast: boolean;
  /** Large text mode */
  largeText: boolean;
  /** Reduced motion */
  reducedMotion: boolean;
  /** Screen reader support */
  screenReader: boolean;
}

// =============================================================================
// SCAN HISTORY AND PERSISTENCE TYPES
// =============================================================================

/**
 * Historical scan record
 */
export interface ScanRecord {
  /** Unique scan ID */
  id: string;
  /** Scan timestamp */
  timestamp: Date;
  /** Scan result */
  scanResult: VINScanResult;
  /** Vehicle analysis (if completed) */
  analysis?: VehicleAnalysis;
  /** User notes */
  notes?: string;
  /** Scan metadata */
  metadata: ScanMetadata;
  /** Whether scan is favorited */
  isFavorited: boolean;
  /** Tags for organization */
  tags?: string[];
}

/**
 * Scan metadata for tracking and analytics
 */
export interface ScanMetadata {
  /** App version when scan was performed */
  appVersion: string;
  /** Device information */
  device: DeviceInfo;
  /** Location information (if permitted) */
  location?: LocationInfo;
  /** Scan performance metrics */
  performance?: ScanPerformance;
}

/**
 * Device information
 */
export interface DeviceInfo {
  /** Operating system */
  os: 'iOS' | 'Android' | 'Web';
  /** OS version */
  osVersion: string;
  /** Device model */
  model?: string;
  /** Screen resolution */
  screenResolution?: string;
}

/**
 * Location information
 */
export interface LocationInfo {
  /** Latitude */
  latitude: number;
  /** Longitude */
  longitude: number;
  /** Location accuracy in meters */
  accuracy?: number;
  /** City name */
  city?: string;
  /** State/province */
  state?: string;
  /** Country */
  country?: string;
}

/**
 * Scan performance metrics
 */
export interface ScanPerformance {
  /** Time taken for VIN detection (ms) */
  detectionTime: number;
  /** Time taken for analysis (ms) */
  analysisTime?: number;
  /** Number of scan attempts */
  attempts: number;
  /** Final confidence score */
  finalConfidence: number;
}

// =============================================================================
// API AND ERROR TYPES
// =============================================================================

/**
 * API response wrapper
 */
export interface APIResponse<T> {
  /** Response data */
  data?: T;
  /** Error information */
  error?: APIError;
  /** Response metadata */
  metadata?: APIMetadata;
}

/**
 * API error information
 */
export interface APIError {
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Detailed error description */
  details?: string;
  /** Error timestamp */
  timestamp: Date;
  /** Request ID for tracking */
  requestId?: string;
}

/**
 * API response metadata
 */
export interface APIMetadata {
  /** Request timestamp */
  requestTime: Date;
  /** Response timestamp */
  responseTime: Date;
  /** Processing time in milliseconds */
  processingTime: number;
  /** API version */
  version: string;
  /** Rate limiting information */
  rateLimit?: RateLimitInfo;
}

/**
 * Rate limiting information
 */
export interface RateLimitInfo {
  /** Requests remaining */
  remaining: number;
  /** Rate limit window in seconds */
  windowSeconds: number;
  /** Reset timestamp */
  resetTime: Date;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Generic pagination parameters
 */
export interface PaginationParams {
  /** Current page number (1-based) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Sort field */
  sortBy?: string;
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  /** Pagination information */
  pagination: PaginationInfo;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  /** Current page */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  itemsPerPage: number;
  /** Whether there's a next page */
  hasNext: boolean;
  /** Whether there's a previous page */
  hasPrevious: boolean;
}

/**
 * Loading state with error handling
 */
export interface LoadingState<T = any> {
  /** Whether currently loading */
  isLoading: boolean;
  /** Whether has completed successfully */
  isSuccess: boolean;
  /** Whether has error */
  isError: boolean;
  /** Error information */
  error?: APIError;
  /** Loaded data */
  data?: T;
  /** Last updated timestamp */
  lastUpdated?: Date;
}

// =============================================================================
// TYPE GUARDS AND UTILITIES
// =============================================================================

/**
 * Type guard to check if an object is a valid VIN scan result
 */
export function isVINScanResult(obj: any): obj is VINScanResult {
  return (
    obj &&
    typeof obj.vin === 'string' &&
    obj.vin.length === 17 &&
    typeof obj.confidence === 'number' &&
    obj.confidence >= 0 &&
    obj.confidence <= 1 &&
    ['text', 'barcode', 'manual'].includes(obj.source)
  );
}

/**
 * Type guard to check if an object is valid vehicle info
 */
export function isVehicleInfo(obj: any): obj is VehicleInfo {
  return (
    obj &&
    typeof obj.vin === 'string' &&
    typeof obj.year === 'number' &&
    typeof obj.make === 'string' &&
    typeof obj.model === 'string'
  );
}

/**
 * Type guard to check if an object is valid pricing data
 */
export function isVehiclePricing(obj: any): obj is VehiclePricing {
  return (
    obj &&
    typeof obj.dealerPrice === 'number' &&
    typeof obj.marketPrice === 'number' &&
    typeof obj.targetPrice === 'number' &&
    typeof obj.potentialSavings === 'number' &&
    obj.lastUpdated instanceof Date
  );
} 