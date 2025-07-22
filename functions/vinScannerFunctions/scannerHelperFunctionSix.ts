import { useCallback } from 'react';
import { correctVINCharacters } from './scannerHelperFunctionOne';
import { generateUserFeedback } from './scannerHelperFunctionThree';
import { validateVINContext } from './scannerHelperFunctionTwo';
import { calculateConfidence } from './scannerHelperFunctionSeven';

export const validateVIN = useCallback((vin: string): boolean => {
  if (!vin || vin.length !== 17) return false;

  if (/[IOQ]/.test(vin)) return false;

  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return false;

  const countryCode = vin[0];
  const checkDigit = vin[8];
  const modelYear = vin[9];

  if (!/^[A-HJ-NPR-Z0-9]$/.test(countryCode)) return false;

  if (!/^[0-9X]$/.test(checkDigit)) return false;

  if (/^[IOQ]$/.test(modelYear)) return false;

  const validManufacturerStarts = [
    '1G',
    '1C',
    '1F',
    '1H',
    '2G',
    '3G',
    '4F',
    '5F', // North American
    'WA',
    'WB',
    'WV', // German
    'JH',
    'JN',
    'JT', // Japanese
    'KM',
    'KN', // Korean
    'VF',
    'VS', // European
    'SB',
    'SA', // British
    'YS',
    'YV', // Swedish
    'ZF',
    'ZA', // Italian
  ];

  const hasKnownManufacturer = validManufacturerStarts.some(
    (code) =>
      vin.substring(0, 2) === code || vin.substring(0, 2).startsWith(code[0])
  );

  if (hasKnownManufacturer) {
    console.log(`🎯 ENHANCED: Valid manufacturer code: ${vin.substring(0, 2)}`);
  }

  return true; // Pass basic validation, let confidence scoring handle quality
}, []);

export const isLikelyNonVINText = (text: string): boolean => {
  const lowercaseText = text.toLowerCase();

  const hasVINPattern = /[A-HJ-NPR-Z0-9]{17}/.test(text.toUpperCase());
  const hasVINContext =
    /VIN[\s#:]|VEHICLE[\s:]*IDENTIFICATION|CHASSIS[\s:]*NUMBER|SERIAL[\s:]*NUMBER/i.test(
      text
    );

  if (hasVINPattern || hasVINContext) {
    console.log(
      `🎯 VIN pattern or context detected - allowing text through filter`
    );
    return false;
  }

  const nonVinKeywords = [
    'chat',
    'message',
    'terminal',
    'npm',
    'run',
    'dev',
    'test',
    'component',
    'function',
    'return',
    'code',
    'file',
    'line',
    'error',
    'warning',
    'build',
    'install',
    'package',
    'json',
    'script',
    'agent',
    'assistant',
    'claude',
    'user',
    'query',
    'response',
    'http',
    'https',
    'www',
    'com',
    'org',
    'net',
    'navigation',
    'radio',
    'bluetooth',
    'android',
    'apple',
    'software',
    'update',
    'version',
    'settings',
    'menu',
    'instant',
    'reports',
    'autotrader',
    'carfax',
    'edmunds',
    'website',
    'online',
    'internet',
    'web',
    'click',
    'button',
  ];

  const hasNonVinKeywords = nonVinKeywords.some((keyword) =>
    lowercaseText.includes(keyword)
  );

  const hasProgrammingContent =
    /(\{|\}|\[|\]|\(|\)|console\.|log|function|class|import|export|const|let|var)/i.test(
      text
    );

  const hasUIContent =
    /navigation|button|modal|screen|tab|scroll|click|tap|touch|swipe|gesture/i.test(
      lowercaseText
    );

  const hasMultipleSentences = (text.match(/\./g) || []).length > 2; // Increased from 1 to 2
  const hasLongText =
    text.length > 200 && !text.match(/^[A-HJ-NPR-Z0-9\s]{17,50}$/); // Increased from 100 to 200

  return (
    hasNonVinKeywords ||
    hasProgrammingContent ||
    hasUIContent ||
    hasMultipleSentences ||
    hasLongText
  );
};

export const findVINWithContext = (
  text: string
): { vin: string; confidence: number } | null => {
  const lines = text.split(/[\r\n]+/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const cleanLine = line.replace(/\s+/g, '').toUpperCase();

    if (cleanLine.length < 17 || cleanLine.length > 25) continue;

    const contextMarkers = [
      /VIN[\s:]*/i,
      /VEHICLE[\s:]*IDENTIFICATION[\s:]*NUMBER[\s:]*/i,
      /CHASSIS[\s:]*NUMBER[\s:]*/i,
      /SERIAL[\s:]*NUMBER[\s:]*/i,
    ];

    let hasContext = false;
    let contextStrength = 0;

    for (const marker of contextMarkers) {
      if (marker.test(line)) {
        hasContext = true;
        contextStrength = line.includes('VIN') ? 1.0 : 0.8;
        break;
      }
    }

    if (!hasContext && i > 0) {
      const prevLine = lines[i - 1];
      for (const marker of contextMarkers) {
        if (marker.test(prevLine)) {
          hasContext = true;
          contextStrength = 0.7;
          break;
        }
      }
    }

    if (!hasContext && i < lines.length - 1) {
      const nextLine = lines[i + 1];
      for (const marker of contextMarkers) {
        if (marker.test(nextLine)) {
          hasContext = true;
          contextStrength = 0.6;
          break;
        }
      }
    }

    if (hasContext) {
      const vinMatch = cleanLine.match(/[A-HJ-NPR-Z0-9IO]{17}/);
      if (vinMatch) {
        const candidate = vinMatch[0];

        console.log(`🎯 Context VIN candidate: "${candidate}"`);

        if (
          candidate.includes('1FMCU') ||
          candidate.includes('FMCU0F70KUA') ||
          candidate.includes('FMCU1F70KUA')
        ) {
          console.log('🚨 DEBUGGING: Context processing Ford VIN candidate');
          console.log(
            '🚨 Candidate characters:',
            candidate
              .split('')
              .map((c, i) => `${i}:${c}`)
              .join(' ')
          );
        }

        const corrected = correctVINCharacters(candidate);
        if (corrected.length === 17 && validateVIN(corrected)) {
          const baseConfidence = calculateConfidence(
            candidate,
            corrected,
            text
          );
          const contextBonus = contextStrength * 0.2;
          const finalConfidence = Math.min(baseConfidence + contextBonus, 0.98);

          if (candidate.includes('1FMCU') && corrected.includes('1FMCU')) {
            console.log('🚨 DEBUGGING: Ford VIN context result');
            console.log('🚨 Original candidate:', candidate);
            console.log('🚨 Corrected result:', corrected);
            if (candidate !== corrected) {
              console.log('🚨 Changes made during correction:');
              for (let i = 0; i < 17; i++) {
                if (candidate[i] !== corrected[i]) {
                  console.log(
                    `🚨   Position ${i}: "${candidate[i]}" → "${corrected[i]}"`
                  );
                }
              }
            }
          }

          return { vin: corrected, confidence: finalConfidence };
        }
      }
    }
  }

  return null;
};

export const extractVINCandidates = (text: string): string[] => {
  if (!text) return [];

  console.log(`🔍 ENHANCED: Extracting VIN candidates from: "${text}"`);

  const candidates: string[] = [];

  const labeledPatterns = [
    /VIN\s*[#:]?\s*([A-Z0-9]{17})/gi, // Include I, O, Q for OCR tolerance
    /VEHICLE\s*ID\s*[#:]?\s*([A-Z0-9]{17})/gi, // Include I, O, Q for OCR tolerance
    /CHASSIS\s*[#:]?\s*([A-Z0-9]{17})/gi, // Include I, O, Q for OCR tolerance
    /SERIAL\s*[#:]?\s*([A-Z0-9]{17})/gi, // Include I, O, Q for OCR tolerance
    // Handle spaced VINs (e.g., "1 C 4 R J F B G 5 M C 7 0 8 1 6 7") - OCR-tolerant
    /VIN\s*[#:]?\s*([A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9]\s+[A-Z0-9])/gi,
  ];

  labeledPatterns.forEach((pattern) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach((match) => {
      let candidate = match[1];
      if (candidate) {
        // Remove spaces from spaced VINs
        candidate = candidate.replace(/\s+/g, '').toUpperCase();
        if (candidate.length === 17) {
          candidates.push(candidate);
          console.log(`📍 FIXED: Found labeled VIN: "${candidate}"`);
        }
      }
    });
  });

  const vinRegex = /[A-Z0-9]{17}/g; // Include I, O, Q for OCR tolerance
  const matches = text.match(vinRegex) || [];
  matches.forEach((match) => {
    candidates.push(match.toUpperCase());
    console.log(`📍 FIXED: Found standalone VIN: "${match}"`);
  });

  const lines = text.split(/[\r\n]+/);
  lines.forEach((line) => {
    const cleanLine = line.replace(/[^A-Z0-9]/g, ''); // Include I, O, Q for OCR tolerance

    if (cleanLine.length >= 15 && cleanLine.length <= 20) {
      const vinPatterns = [
        /^1[A-Z0-9]/, // Common US manufacturer codes (OCR-tolerant)
        /^[A-Z][A-Z0-9]/, // General manufacturer codes (OCR-tolerant)
        /^[0-9][A-Z]/, // Other patterns (OCR-tolerant)
      ];

      if (vinPatterns.some((pattern) => pattern.test(cleanLine))) {
        const extracted = cleanLine.substring(0, 17);
        if (extracted.length === 17) {
          candidates.push(extracted);
          console.log(`📍 FIXED: Found pattern-based VIN: "${extracted}"`);
        }
      }
    }
  });

  const allAlphanumeric = text.replace(/[^A-Z0-9]/g, ''); // Include I, O, Q for OCR tolerance
  if (allAlphanumeric.length >= 17) {
    const possibleVins = [];
    for (let i = 0; i <= allAlphanumeric.length - 17; i++) {
      const candidate = allAlphanumeric.substring(i, i + 17);
      if (/^[1-9][A-Z0-9]/.test(candidate)) {
        possibleVins.push(candidate);
      }
    }

    possibleVins.slice(0, 3).forEach((candidate) => {
      candidates.push(candidate);
      console.log(`📍 FIXED: Found fragmented VIN: "${candidate}"`);
    });
  }

  const uniqueCandidates = [...new Set(candidates)];

  return uniqueCandidates;
};

export const extractVINFromText = (
  text: string
): { vin: string; confidence: number } | null => {
  if (!text) return null;

  console.log(`🔍 Raw text from ML Kit: "${text}"`);

  const candidates = extractVINCandidates(text);

  if (candidates.length === 0) {
    return null;
  }

  let bestResult: { vin: string; confidence: number } | null = null;

  for (const candidate of candidates) {
    console.log(`🔍 ENHANCED: Processing candidate: "${candidate}"`);

    const corrected = correctVINCharacters(candidate);

    if (corrected.length === 17 && validateVIN(corrected)) {
      const confidence = calculateConfidence(candidate, corrected, text);
      console.log(
        `🎯 FIXED: Candidate VIN: ${corrected} (${Math.round(
          confidence * 100
        )}%)`
      );

      if (confidence >= 0.5) {
        if (!bestResult || confidence > bestResult.confidence) {
          bestResult = { vin: corrected, confidence };
        }
      }
    }
  }

  if (!bestResult) {
    console.log(`🔄 ENHANCED: Falling back to context-aware detection`);
    const contextResult = findVINWithContext(text);
    if (contextResult && contextResult.confidence > 0.6) {
      console.log(
        `✅ ENHANCED: High-confidence context VIN: ${
          contextResult.vin
        } (${Math.round(contextResult.confidence * 100)}%)`
      );
      return contextResult;
    }
  }

  return bestResult;
};

export const extractVINWithProfessionalValidation = (
  text: string
): {
  vin: string;
  confidence: number;
  feedback: ReturnType<typeof generateUserFeedback>;
  contextValidation: ReturnType<typeof validateVINContext>;
} | null => {
  const basicResult = extractVINFromText(text);
  if (!basicResult) return null;

  const contextValidation = validateVINContext(
    basicResult.vin,
    basicResult.confidence
  );
  const adjustedConfidence = Math.max(
    0,
    Math.min(
      1,
      basicResult.confidence + contextValidation.confidenceAdjustment / 100
    )
  );

  const feedback = generateUserFeedback(
    basicResult.vin,
    adjustedConfidence,
    contextValidation
  );

  if (contextValidation.adjustments.length > 0) {
    console.log(
      `💡 Suggestions: ${contextValidation.adjustments
        .map((adj) => `${adj.position}: ${adj.original}→${adj.suggested}`)
        .join(', ')}`
    );
  }

  return {
    vin: basicResult.vin,
    confidence: adjustedConfidence,
    feedback,
    contextValidation,
  };
};
