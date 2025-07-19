/**
 * @fileoverview Data Validation Utilities
 * @description Validation functions and utilities for type-safe data handling
 * @related types/core.ts
 */

import { 
  VINScanResult, 
  VehicleInfo, 
  VehiclePricing, 
  VehicleAnalysis, 
  UserPreferences,
  ScanRecord,
  APIError,
  VINValidationResult
} from './core';

// =============================================================================
// VIN VALIDATION
// =============================================================================

/**
 * VIN validation regex - 17 characters, no I, O, or Q
 */
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * VIN check digit calculation weights
 */
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * VIN character to numeric value mapping
 */
const VIN_VALUES: Record<string, number> = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
  'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
};

/**
 * Validates a VIN number with comprehensive checks
 */
export function validateVIN(vin: string): VINValidationResult {
  const cleanVIN = vin.trim().toUpperCase();

  // Basic format check
  if (!cleanVIN) {
    return {
      isValid: false,
      error: 'VIN cannot be empty'
    };
  }

  if (cleanVIN.length !== 17) {
    return {
      isValid: false,
      error: `VIN must be exactly 17 characters (provided: ${cleanVIN.length})`
    };
  }

  if (!VIN_REGEX.test(cleanVIN)) {
    return {
      isValid: false,
      error: 'VIN contains invalid characters (I, O, Q not allowed)'
    };
  }

  // Check digit validation (9th position)
  const checkDigit = cleanVIN[8];
  const calculatedCheckDigit = calculateVINCheckDigit(cleanVIN);
  
  if (checkDigit !== 'X' && checkDigit !== calculatedCheckDigit) {
    return {
      isValid: false,
      error: 'Invalid VIN check digit'
    };
  }

  return {
    isValid: true,
    formattedVIN: cleanVIN
  };
}

/**
 * Calculates the check digit for a VIN
 */
function calculateVINCheckDigit(vin: string): string {
  let sum = 0;
  
  for (let i = 0; i < 17; i++) {
    if (i === 8) continue; // Skip check digit position
    
    const char = vin[i];
    const value = VIN_VALUES[char] || 0;
    sum += value * VIN_WEIGHTS[i];
  }
  
  const remainder = sum % 11;
  return remainder === 10 ? 'X' : remainder.toString();
}

/**
 * Cleans and corrects common VIN OCR errors
 */
export function correctVINCharacters(text: string): string {
  return text
    .toUpperCase()
    .replace(/[IO]/g, '1')  // Replace I and O with 1
    .replace(/Q/g, '0')     // Replace Q with 0
    .replace(/[^A-HJ-NPR-Z0-9]/g, ''); // Remove invalid characters
}

/**
 * Extracts potential VINs from text
 */
export function extractVINsFromText(text: string): string[] {
  if (!text) return [];
  
  const vins: string[] = [];
  const lines = text.split(/[\r\n]+/);
  
  for (const line of lines) {
    const cleanLine = line.replace(/\s+/g, '').toUpperCase();
    
    // Look for exactly 17 character sequences
    const exactMatches = cleanLine.match(/[A-HJ-NPR-Z0-9IO]{17}/g);
    if (exactMatches) {
      for (const match of exactMatches) {
        const corrected = correctVINCharacters(match);
        if (corrected.length === 17 && validateVIN(corrected).isValid) {
          vins.push(corrected);
        }
      }
    }
    
    // Try sliding window approach
    if (cleanLine.length > 17) {
      for (let i = 0; i <= cleanLine.length - 17; i++) {
        const candidate = cleanLine.substring(i, i + 17);
        const corrected = correctVINCharacters(candidate);
        if (corrected.length === 17 && validateVIN(corrected).isValid) {
          vins.push(corrected);
        }
      }
    }
  }
  
  return [...new Set(vins)]; // Remove duplicates
}

// =============================================================================
// DATA VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates VIN scan result data
 */
export function validateVINScanResult(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('VIN scan result must be an object');
    return { isValid: false, errors };
  }

  // Validate VIN
  if (!data.vin || typeof data.vin !== 'string') {
    errors.push('VIN is required and must be a string');
  } else {
    const vinValidation = validateVIN(data.vin);
    if (!vinValidation.isValid) {
      errors.push(`Invalid VIN: ${vinValidation.error}`);
    }
  }

  // Validate confidence
  if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1) {
    errors.push('Confidence must be a number between 0 and 1');
  }

  // Validate source
  if (!['text', 'barcode', 'manual'].includes(data.source)) {
    errors.push('Source must be "text", "barcode", or "manual"');
  }

  // Validate optional timestamp
  if (data.timestamp && !(data.timestamp instanceof Date)) {
    errors.push('Timestamp must be a Date object');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates vehicle information data
 */
export function validateVehicleInfo(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Vehicle info must be an object');
    return { isValid: false, errors };
  }

  // Required fields
  if (!data.vin || typeof data.vin !== 'string') {
    errors.push('VIN is required');
  }

  if (!data.year || typeof data.year !== 'number' || data.year < 1900 || data.year > new Date().getFullYear() + 2) {
    errors.push('Year must be a valid number');
  }

  if (!data.make || typeof data.make !== 'string') {
    errors.push('Make is required');
  }

  if (!data.model || typeof data.model !== 'string') {
    errors.push('Model is required');
  }

  // Optional fields type checking
  if (data.trim && typeof data.trim !== 'string') {
    errors.push('Trim must be a string');
  }

  if (data.bodyStyle && typeof data.bodyStyle !== 'string') {
    errors.push('Body style must be a string');
  }

  if (data.driveType && typeof data.driveType !== 'string') {
    errors.push('Drive type must be a string');
  }

  if (data.fuelType && typeof data.fuelType !== 'string') {
    errors.push('Fuel type must be a string');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates pricing data
 */
export function validateVehiclePricing(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Pricing data must be an object');
    return { isValid: false, errors };
  }

  // Required numeric fields
  const requiredFields = ['dealerPrice', 'marketPrice', 'targetPrice', 'potentialSavings'];
  for (const field of requiredFields) {
    if (typeof data[field] !== 'number' || data[field] < 0) {
      errors.push(`${field} must be a positive number`);
    }
  }

  // Validate lastUpdated
  if (!(data.lastUpdated instanceof Date)) {
    errors.push('lastUpdated must be a Date object');
  }

  // Validate confidence if present
  if (data.confidence !== undefined && (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1)) {
    errors.push('Confidence must be a number between 0 and 1');
  }

  // Business logic validations
  if (data.potentialSavings !== (data.dealerPrice - data.targetPrice)) {
    errors.push('Potential savings must equal dealer price minus target price');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates user preferences data
 */
export function validateUserPreferences(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('User preferences must be an object');
    return { isValid: false, errors };
  }

  // Validate autoScanEnabled
  if (typeof data.autoScanEnabled !== 'boolean') {
    errors.push('autoScanEnabled must be a boolean');
  }

  // Validate notifications object
  if (!data.notifications || typeof data.notifications !== 'object') {
    errors.push('notifications must be an object');
  } else {
    const notificationFields = ['priceDropAlerts', 'marketUpdates', 'featureUpdates', 'negotiationReminders'];
    for (const field of notificationFields) {
      if (typeof data.notifications[field] !== 'boolean') {
        errors.push(`notifications.${field} must be a boolean`);
      }
    }
  }

  // Validate region object
  if (!data.region || typeof data.region !== 'object') {
    errors.push('region must be an object');
  } else {
    if (!data.region.country || typeof data.region.country !== 'string') {
      errors.push('region.country is required and must be a string');
    }
    
    if (!['USD', 'CAD', 'EUR', 'GBP'].includes(data.region.currency)) {
      errors.push('region.currency must be USD, CAD, EUR, or GBP');
    }
    
    if (!['miles', 'kilometers'].includes(data.region.distanceUnit)) {
      errors.push('region.distanceUnit must be miles or kilometers');
    }
  }

  return { isValid: errors.length === 0, errors };
}

// =============================================================================
// DATA SANITIZATION
// =============================================================================

/**
 * Sanitizes and normalizes VIN scan result data
 */
export function sanitizeVINScanResult(data: any): VINScanResult | null {
  try {
    const validation = validateVINScanResult(data);
    if (!validation.isValid) {
      console.warn('Invalid VIN scan result:', validation.errors);
      return null;
    }

    return {
      vin: data.vin.toUpperCase(),
      confidence: Math.min(Math.max(data.confidence, 0), 1), // Clamp between 0 and 1
      source: data.source,
      barcodeFormat: data.barcodeFormat,
      timestamp: data.timestamp || new Date(),
      imageUri: data.imageUri
    };
  } catch (error) {
    console.error('Error sanitizing VIN scan result:', error);
    return null;
  }
}

/**
 * Sanitizes vehicle information data
 */
export function sanitizeVehicleInfo(data: any): VehicleInfo | null {
  try {
    const validation = validateVehicleInfo(data);
    if (!validation.isValid) {
      console.warn('Invalid vehicle info:', validation.errors);
      return null;
    }

    return {
      vin: data.vin.toUpperCase(),
      year: Math.floor(data.year),
      make: data.make.trim(),
      model: data.model.trim(),
      trim: data.trim?.trim(),
      engine: data.engine,
      transmission: data.transmission,
      bodyStyle: data.bodyStyle?.trim(),
      driveType: data.driveType?.trim(),
      fuelType: data.fuelType?.trim(),
      countryOfOrigin: data.countryOfOrigin?.trim(),
      images: data.images || [],
      specifications: data.specifications
    };
  } catch (error) {
    console.error('Error sanitizing vehicle info:', error);
    return null;
  }
}

/**
 * Sanitizes pricing data
 */
export function sanitizeVehiclePricing(data: any): VehiclePricing | null {
  try {
    const validation = validateVehiclePricing(data);
    if (!validation.isValid) {
      console.warn('Invalid pricing data:', validation.errors);
      return null;
    }

    const dealerPrice = Math.round(data.dealerPrice * 100) / 100; // Round to 2 decimal places
    const marketPrice = Math.round(data.marketPrice * 100) / 100;
    const targetPrice = Math.round(data.targetPrice * 100) / 100;
    const potentialSavings = Math.round((dealerPrice - targetPrice) * 100) / 100;

    return {
      dealerPrice,
      marketPrice,
      targetPrice,
      potentialSavings,
      priceHistory: data.priceHistory || [],
      marketConditions: data.marketConditions,
      confidence: data.confidence ? Math.min(Math.max(data.confidence, 0), 1) : undefined,
      lastUpdated: data.lastUpdated
    };
  } catch (error) {
    console.error('Error sanitizing pricing data:', error);
    return null;
  }
}

// =============================================================================
// ERROR HANDLING UTILITIES
// =============================================================================

/**
 * Creates a standardized API error
 */
export function createAPIError(
  code: string,
  message: string,
  details?: string,
  requestId?: string
): APIError {
  return {
    code,
    message,
    details,
    timestamp: new Date(),
    requestId
  };
}

/**
 * Checks if an error is an API error
 */
export function isAPIError(error: any): error is APIError {
  return (
    error &&
    typeof error.code === 'string' &&
    typeof error.message === 'string' &&
    error.timestamp instanceof Date
  );
}

/**
 * Formats an error for user display
 */
export function formatErrorForUser(error: APIError | Error | string): string {
  if (typeof error === 'string') {
    return error;
  }

  if (isAPIError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

// =============================================================================
// DATA TRANSFORMATION UTILITIES
// =============================================================================

/**
 * Formats currency values for display
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Formats dates for display
 */
export function formatDate(date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  // Show relative time for recent dates
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minutes ago`;
  }

  if (diffHours < 24) {
    return `${Math.floor(diffHours)} hours ago`;
  }

  if (diffDays < 7) {
    return `${Math.floor(diffDays)} days ago`;
  }

  // Show absolute date for older dates
  const options: Intl.DateTimeFormatOptions = 
    format === 'short' ? { month: 'short', day: 'numeric' } :
    format === 'medium' ? { month: 'short', day: 'numeric', year: 'numeric' } :
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleDateString('en-US', options);
}

/**
 * Formats confidence scores for display
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Calculates savings percentage
 */
export function calculateSavingsPercentage(dealerPrice: number, targetPrice: number): number {
  if (dealerPrice <= 0) return 0;
  return Math.round(((dealerPrice - targetPrice) / dealerPrice) * 100);
} 