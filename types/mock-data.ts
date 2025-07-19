/**
 * @fileoverview Mock Data Generators
 * @description Realistic sample data generators for development and testing
 * @related types/core.ts, types/validation.ts
 */

import {
  VINScanResult,
  VehicleInfo,
  VehiclePricing,
  VehicleAnalysis,
  MarketAnalysis,
  LeveragePoint,
  VehicleInsight,
  ScanRecord,
  UserPreferences,
  ComparableVehicle,
  EngineInfo,
  TransmissionInfo,
  VehicleSpecifications,
  FuelEconomy,
  APIResponse,
  LoadingState,
  PaginatedResponse
} from './core';

// =============================================================================
// SAMPLE DATA CONSTANTS
// =============================================================================

const SAMPLE_VINS = [
  '1HGBH41JXMN109186', // Honda Accord Sport
  '4T1G11AK8LU123456', // Toyota Camry LE
  '1N4AL3AP8KC123789', // Nissan Altima SV
  '1FTFW1ET5DFC10312', // Ford F-150
  '1GCEC14X03Z456789', // Chevrolet Silverado
  'WBA3A5C50CF123456', // BMW 3 Series
  'WBAFR7C51BC123456', // BMW X3
  'JM1DKDB75G0123456', // Mazda CX-5
  'KNDJN2A22G7123456', // Hyundai Elantra
  '3GNAXHEV9KL123456'  // Chevrolet Equinox
];

const VEHICLE_MAKES = [
  'Honda', 'Toyota', 'Nissan', 'Ford', 'Chevrolet',
  'BMW', 'Mercedes-Benz', 'Audi', 'Mazda', 'Hyundai',
  'Kia', 'Volkswagen', 'Subaru', 'Lexus', 'Acura'
];

const VEHICLE_MODELS = {
  Honda: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey'],
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'],
  Nissan: ['Altima', 'Sentra', 'Rogue', 'Murano', 'Pathfinder'],
  Ford: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge'],
  Chevrolet: ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Camaro']
};

const TRIM_LEVELS = [
  'Base', 'S', 'SE', 'SEL', 'SL', 'Sport', 'EX', 'EX-L', 'Touring',
  'LE', 'XLE', 'Limited', 'Platinum', 'Hybrid', 'AWD'
];

const MARKET_INSIGHTS = [
  'Used car prices dropped 3% this month. Great time to negotiate!',
  'This model holds its value exceptionally well.',
  'High demand for this vehicle in your area.',
  'Similar vehicles have been sitting on lots longer than usual.',
  'Recent recall affects resale value - use as leverage.',
  'New model year release is driving down prices for older models.'
];

const LEVERAGE_POINTS_DATA = [
  {
    title: 'Market Pricing',
    description: 'Vehicle is priced 15% above market average',
    category: 'market' as const,
    evidence: ['Comparable listings show $2,400 lower average', '12 similar vehicles within 50 miles']
  },
  {
    title: 'Days on Market',
    description: 'Vehicle has been listed for 45 days, indicating low interest',
    category: 'timing' as const,
    evidence: ['Average listing time is 28 days', 'Price reduction likely needed soon']
  },
  {
    title: 'Seasonal Demand',
    description: 'Convertibles sell slower in winter months',
    category: 'timing' as const,
    evidence: ['20% price drop typical in Q4', 'Inventory building up for spring']
  },
  {
    title: 'Minor Issues',
    description: 'Small cosmetic damage reduces value',
    category: 'condition' as const,
    evidence: ['Door ding visible in photos', '$300-500 repair estimate']
  }
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function randomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomBool(probability: number = 0.5): boolean {
  return Math.random() < probability;
}

function randomDate(daysAgo: number = 30): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - (Math.random() * daysAgo * 24 * 60 * 60 * 1000));
  return pastDate;
}

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

/**
 * Generates a realistic VIN scan result
 */
export function generateMockVINScanResult(options: {
  vin?: string;
  source?: 'text' | 'barcode' | 'manual';
  confidence?: number;
} = {}): VINScanResult {
  return {
    vin: options.vin || randomElement(SAMPLE_VINS),
    confidence: options.confidence || randomFloat(0.75, 0.98),
    source: options.source || randomElement(['text', 'barcode', 'manual']),
    barcodeFormat: options.source === 'barcode' ? randomElement(['Code128', 'Code39', 'DataMatrix']) : undefined,
    timestamp: randomDate(7), // Within last 7 days
    imageUri: `file://scan_${Date.now()}.jpg`
  };
}

/**
 * Generates realistic vehicle information
 */
export function generateMockVehicleInfo(vin?: string): VehicleInfo {
  const make = randomElement(VEHICLE_MAKES);
  const models = VEHICLE_MODELS[make as keyof typeof VEHICLE_MODELS] || ['Unknown'];
  const model = randomElement(models);
  const year = randomNumber(2015, 2024);

  return {
    vin: vin || randomElement(SAMPLE_VINS),
    year,
    make,
    model,
    trim: randomElement(TRIM_LEVELS),
    engine: generateMockEngineInfo(),
    transmission: generateMockTransmissionInfo(),
    bodyStyle: randomElement(['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Truck', 'Wagon']),
    driveType: randomElement(['FWD', 'RWD', 'AWD', '4WD']),
    fuelType: randomElement(['Gasoline', 'Hybrid', 'Electric', 'Diesel']),
    countryOfOrigin: randomElement(['United States', 'Japan', 'Germany', 'South Korea']),
    images: generateMockVehicleImages(),
    specifications: generateMockVehicleSpecifications()
  };
}

/**
 * Generates mock engine information
 */
function generateMockEngineInfo(): EngineInfo {
  const displacement = randomFloat(1.4, 6.2, 1);
  const cylinders = displacement < 2.0 ? 3 : displacement < 3.0 ? 4 : displacement < 4.0 ? 6 : 8;

  return {
    displacement,
    cylinders,
    configuration: cylinders === 3 ? 'I3' : cylinders === 4 ? 'I4' : cylinders === 6 ? 'V6' : 'V8',
    fuelInjection: randomElement(['Direct', 'Multi-point', 'Turbo Direct']),
    horsepower: randomNumber(150, 400),
    torque: randomNumber(180, 450)
  };
}

/**
 * Generates mock transmission information
 */
function generateMockTransmissionInfo(): TransmissionInfo {
  const transmissionTypes = ['automatic', 'manual', 'cvt', 'dual-clutch'] as const;
  const type = randomElement(transmissionTypes);
  const speeds = type === 'manual' ? randomNumber(5, 6) : 
                type === 'cvt' ? undefined : 
                randomNumber(6, 10);

  return {
    type,
    speeds,
    description: speeds ? `${speeds}-Speed ${type}` : `${type.toUpperCase()}`
  };
}

/**
 * Generates mock vehicle images
 */
function generateMockVehicleImages() {
  return [
    { url: 'https://example.com/exterior1.jpg', type: 'exterior' as const, description: 'Front exterior view', order: 1 },
    { url: 'https://example.com/exterior2.jpg', type: 'exterior' as const, description: 'Side exterior view', order: 2 },
    { url: 'https://example.com/interior1.jpg', type: 'interior' as const, description: 'Dashboard and front seats', order: 3 },
    { url: 'https://example.com/interior2.jpg', type: 'interior' as const, description: 'Rear passenger area', order: 4 }
  ];
}

/**
 * Generates mock vehicle specifications
 */
function generateMockVehicleSpecifications(): VehicleSpecifications {
  return {
    length: randomFloat(175, 220),
    width: randomFloat(68, 80),
    height: randomFloat(55, 75),
    wheelbase: randomFloat(105, 130),
    weight: randomNumber(3000, 5500),
    cargoCapacity: randomFloat(12, 85),
    seatingCapacity: randomNumber(2, 8),
    fuelEconomy: generateMockFuelEconomy()
  };
}

/**
 * Generates mock fuel economy data
 */
function generateMockFuelEconomy(): FuelEconomy {
  const city = randomNumber(18, 35);
  const highway = city + randomNumber(5, 15);
  const combined = Math.round((city + highway) / 2);

  return { city, highway, combined };
}

/**
 * Generates realistic vehicle pricing
 */
export function generateMockVehiclePricing(): VehiclePricing {
  const marketPrice = randomNumber(15000, 45000);
  const dealerPrice = marketPrice + randomNumber(500, 3000); // Dealer markup
  const targetPrice = dealerPrice - randomNumber(1000, 4000); // Negotiation target
  const potentialSavings = dealerPrice - targetPrice;

  return {
    dealerPrice,
    marketPrice,
    targetPrice,
    potentialSavings,
    confidence: randomFloat(0.8, 0.95),
    lastUpdated: randomDate(3),
    priceHistory: generateMockPriceHistory(marketPrice),
    marketConditions: {
      trend: randomElement(['rising', 'falling', 'stable']),
      demand: randomElement(['high', 'medium', 'low']),
      inventory: randomElement(['high', 'medium', 'low']),
      seasonalFactors: ['winter demand decrease', 'model year-end clearance'],
      insights: [randomElement(MARKET_INSIGHTS)]
    }
  };
}

/**
 * Generates mock price history
 */
function generateMockPriceHistory(basePrice: number) {
  const history = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const variation = randomFloat(0.95, 1.05);
    history.push({
      date,
      price: Math.round(basePrice * variation),
      source: randomElement(['KBB', 'Edmunds', 'AutoTrader', 'Cars.com'])
    });
  }
  return history.reverse();
}

/**
 * Generates realistic market analysis
 */
export function generateMockMarketAnalysis(): MarketAnalysis {
  return {
    comparables: Array.from({ length: randomNumber(3, 8) }, () => generateMockComparableVehicle()),
    marketPosition: randomElement(['overpriced', 'fair', 'underpriced']),
    pricePercentile: randomNumber(25, 90),
    daysOnMarket: randomNumber(14, 60),
    regionalVariations: [
      { region: 'Local Area', averagePrice: 28500, priceDifference: 0, sampleSize: 15 },
      { region: 'State Average', averagePrice: 29200, priceDifference: 700, sampleSize: 156 },
      { region: 'National Average', averagePrice: 27800, priceDifference: -700, sampleSize: 2341 }
    ]
  };
}

/**
 * Generates a comparable vehicle
 */
function generateMockComparableVehicle(): ComparableVehicle {
  const vehicle = generateMockVehicleInfo();
  return {
    vehicle: {
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim
    },
    price: randomNumber(20000, 40000),
    distance: randomNumber(5, 150),
    daysListed: randomNumber(7, 45),
    mileage: randomNumber(25000, 120000),
    condition: randomElement(['excellent', 'good', 'fair', 'poor'])
  };
}

/**
 * Generates mock leverage points
 */
export function generateMockLeveragePoints(): LeveragePoint[] {
  return Array.from({ length: randomNumber(2, 4) }, (_, index) => {
    const data = randomElement(LEVERAGE_POINTS_DATA);
    return {
      id: `leverage_${index + 1}`,
      title: data.title,
      description: data.description,
      impact: randomElement(['high', 'medium', 'low']),
      category: data.category,
      evidence: data.evidence
    };
  });
}

/**
 * Generates mock vehicle insights
 */
export function generateMockVehicleInsights(): VehicleInsight[] {
  const insights = [
    {
      type: 'tip' as const,
      title: 'Negotiation Strategy',
      message: 'Use the high mileage as leverage for a lower price.',
      priority: 'high' as const,
      icon: 'lightbulb'
    },
    {
      type: 'warning' as const,
      title: 'Market Alert',
      message: 'This model has a known transmission issue in this year.',
      priority: 'high' as const,
      icon: 'alert-triangle'
    },
    {
      type: 'opportunity' as const,
      title: 'Timing Advantage',
      message: 'End of model year - dealers motivated to sell.',
      priority: 'medium' as const,
      icon: 'trending-down'
    },
    {
      type: 'fact' as const,
      title: 'Resale Value',
      message: 'This vehicle typically retains 65% of its value after 3 years.',
      priority: 'low' as const,
      icon: 'bar-chart'
    }
  ];

  return Array.from({ length: randomNumber(2, 4) }, (_, index) => {
    const insight = randomElement(insights);
    return {
      id: `insight_${index + 1}`,
      ...insight,
      actions: [
        {
          id: `action_${index + 1}`,
          label: 'Learn More',
          type: 'external' as const,
          data: { url: 'https://example.com' }
        }
      ]
    };
  });
}

/**
 * Generates complete vehicle analysis
 */
export function generateMockVehicleAnalysis(vin?: string): VehicleAnalysis {
  return {
    vehicle: generateMockVehicleInfo(vin),
    pricing: generateMockVehiclePricing(),
    marketAnalysis: generateMockMarketAnalysis(),
    leveragePoints: generateMockLeveragePoints(),
    insights: generateMockVehicleInsights(),
    confidence: randomFloat(0.85, 0.98),
    analyzedAt: randomDate(1)
  };
}

/**
 * Generates mock user preferences
 */
export function generateMockUserPreferences(): UserPreferences {
  return {
    autoScanEnabled: randomBool(0.8),
    notifications: {
      priceDropAlerts: randomBool(0.9),
      marketUpdates: randomBool(0.7),
      featureUpdates: randomBool(0.6),
      negotiationReminders: randomBool(0.8)
    },
    region: {
      country: 'United States',
      state: randomElement(['CA', 'NY', 'TX', 'FL', 'IL']),
      city: randomElement(['Los Angeles', 'New York', 'Houston', 'Miami', 'Chicago']),
      postalCode: randomNumber(10000, 99999).toString(),
      currency: 'USD',
      distanceUnit: 'miles'
    },
    privacy: {
      analytics: randomBool(0.7),
      location: randomBool(0.6),
      crashReporting: randomBool(0.8),
      dataSharing: randomBool(0.4)
    },
    ui: {
      theme: randomElement(['light', 'dark', 'auto']),
      language: 'en-US',
      accessibility: {
        highContrast: randomBool(0.1),
        largeText: randomBool(0.2),
        reducedMotion: randomBool(0.1),
        screenReader: randomBool(0.05)
      }
    }
  };
}

/**
 * Generates a mock scan record
 */
export function generateMockScanRecord(): ScanRecord {
  const scanResult = generateMockVINScanResult();
  return {
    id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: scanResult.timestamp!,
    scanResult,
    analysis: randomBool(0.8) ? generateMockVehicleAnalysis(scanResult.vin) : undefined,
    notes: randomBool(0.3) ? 'Interested in this vehicle for family use' : undefined,
    metadata: {
      appVersion: '1.0.0',
      device: {
        os: randomElement(['iOS', 'Android', 'Web']),
        osVersion: randomElement(['17.0', '14.0', 'Chrome 120']),
        model: randomElement(['iPhone 15', 'Samsung Galaxy S23', 'Desktop'])
      },
      performance: {
        detectionTime: randomNumber(500, 3000),
        analysisTime: randomNumber(2000, 8000),
        attempts: randomNumber(1, 3),
        finalConfidence: scanResult.confidence
      }
    },
    isFavorited: randomBool(0.2),
    tags: randomBool(0.4) ? [randomElement(['family-car', 'backup-option', 'top-choice', 'needs-inspection'])] : undefined
  };
}

/**
 * Generates multiple mock scan records for history
 */
export function generateMockScanHistory(count: number = 5): ScanRecord[] {
  return Array.from({ length: count }, () => generateMockScanRecord())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by newest first
}

/**
 * Generates mock API response wrapper
 */
export function generateMockAPIResponse<T>(data: T, hasError: boolean = false): APIResponse<T> {
  const now = new Date();
  const requestTime = new Date(now.getTime() - randomNumber(100, 2000));
  
  if (hasError) {
    return {
      error: {
        code: randomElement(['VALIDATION_ERROR', 'NOT_FOUND', 'RATE_LIMITED', 'SERVER_ERROR']),
        message: randomElement([
          'Invalid VIN format',
          'Vehicle not found in database',
          'Rate limit exceeded',
          'Internal server error'
        ]),
        timestamp: now,
        requestId: `req_${Math.random().toString(36).substr(2, 9)}`
      },
      metadata: {
        requestTime,
        responseTime: now,
        processingTime: now.getTime() - requestTime.getTime(),
        version: '1.0.0'
      }
    };
  }

  return {
    data,
    metadata: {
      requestTime,
      responseTime: now,
      processingTime: now.getTime() - requestTime.getTime(),
      version: '1.0.0',
      rateLimit: {
        remaining: randomNumber(50, 100),
        windowSeconds: 3600,
        resetTime: new Date(now.getTime() + 3600000)
      }
    }
  };
}

/**
 * Generates mock loading state
 */
export function generateMockLoadingState<T>(
  data?: T,
  state: 'loading' | 'success' | 'error' = 'success'
): LoadingState<T> {
  const base = {
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    lastUpdated: state !== 'loading' ? randomDate(1) : undefined
  };

  if (state === 'error') {
    return {
      ...base,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to load data',
        timestamp: new Date()
      }
    };
  }

  if (state === 'success' && data) {
    return {
      ...base,
      data
    };
  }

  return base;
}

/**
 * Generates mock paginated response
 */
export function generateMockPaginatedResponse<T>(
  items: T[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: paginatedItems,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    }
  };
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

/**
 * Generates a complete set of mock data for the app
 */
export const mockData = {
  vinScanResult: () => generateMockVINScanResult(),
  vehicleInfo: () => generateMockVehicleInfo(),
  vehiclePricing: () => generateMockVehiclePricing(),
  vehicleAnalysis: () => generateMockVehicleAnalysis(),
  scanRecord: () => generateMockScanRecord(),
  scanHistory: (count?: number) => generateMockScanHistory(count),
  userPreferences: () => generateMockUserPreferences(),
  apiResponse: <T>(data: T, hasError?: boolean) => generateMockAPIResponse(data, hasError),
  loadingState: <T>(data?: T, state?: 'loading' | 'success' | 'error') => generateMockLoadingState(data, state),
  paginatedResponse: <T>(items: T[], page?: number, limit?: number) => generateMockPaginatedResponse(items, page, limit)
}; 