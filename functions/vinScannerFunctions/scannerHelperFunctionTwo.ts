import {
  VINScanFrame,
  VINScanHistory,
} from '@/types/scannerFilesValidationTypes';
import { VIN_STRUCTURE } from './scannerHelperFunctionOne';

export const validateVINContext = (
  vin: string,
  confidence: number
): {
  vin: string;
  adjustments: {
    position: number;
    original: string;
    suggested: string;
    reason: string;
  }[];
  confidenceAdjustment: number;
  needsUserReview: boolean;
} => {
  const adjustments: {
    position: number;
    original: string;
    suggested: string;
    reason: string;
  }[] = [];
  let confidenceAdjustment = 0;

  if (vin.length !== 17) {
    return { vin, adjustments, confidenceAdjustment, needsUserReview: true };
  }

  const wmi = vin.substring(0, 3);
  const wmiPatterns: { [key: string]: string[] } = VIN_STRUCTURE.wmiPatterns;
  const manufacturer = Object.keys(wmiPatterns).find((brand) =>
    wmiPatterns[brand].includes(wmi)
  );

  const pos6 = vin[5];
  if (pos6 === '1' && confidence < 70) {
    if (manufacturer === 'Ford' && wmi === '1FM') {
      adjustments.push({
        position: 6,
        original: '1',
        suggested: '0',
        reason: 'Ford model pattern suggests 0 for this WMI',
      });
      confidenceAdjustment -= 10;
    }
  }

  const pos8 = vin[7];
  if (pos8 === '1' && confidence < 70) {
    if (manufacturer === 'Ford' && wmi === '1FM') {
      adjustments.push({
        position: 8,
        original: '1',
        suggested: '0',
        reason: 'Plant code pattern analysis suggests 0',
      });
      confidenceAdjustment -= 10;
    }
  }

  const needsUserReview = confidence < 65 && adjustments.length > 0;

  console.log(
    `🔍 Context validation: ${adjustments.length} suggestions, confidence adjustment: ${confidenceAdjustment}`
  );

  return { vin, adjustments, confidenceAdjustment, needsUserReview };
};

export const analyzeCharacterInconsistencies = (
  frames: VINScanFrame[]
): {
  problematicPositions: number[];
  suggestions: { [position: number]: { char: string; confidence: number } };
} => {
  if (frames.length < 2) return { problematicPositions: [], suggestions: {} };

  const charCounts: { [position: number]: { [char: string]: number } } = {};

  frames.forEach((frame) => {
    for (let i = 0; i < frame.vin.length && i < 17; i++) {
      if (!charCounts[i]) charCounts[i] = {};
      const char = frame.vin[i];
      charCounts[i][char] = (charCounts[i][char] || 0) + 1;
    }
  });

  const problematicPositions: number[] = [];
  const suggestions: {
    [position: number]: { char: string; confidence: number };
  } = {};

  Object.keys(charCounts).forEach((pos) => {
    const position = parseInt(pos);
    const chars = charCounts[position];
    const charKeys = Object.keys(chars);

    if (charKeys.length > 1) {
      const mostCommon = charKeys.reduce((a, b) =>
        chars[a] > chars[b] ? a : b
      );
      const confidence = chars[mostCommon] / frames.length;

      if (
        (charKeys.includes('0') && charKeys.includes('1')) ||
        confidence < 0.8
      ) {
        problematicPositions.push(position);
        suggestions[position] = { char: mostCommon, confidence };
        console.log(
          `🔍 PHASE 3.1.2: Position ${position} inconsistency: ${charKeys.join(
            '/'
          )} - suggest '${mostCommon}' (${Math.round(confidence * 100)}%)`
        );
      }
    }
  });

  return { problematicPositions, suggestions };
};

export const analyzeVINConsensus = (
  history: VINScanHistory
): {
  consensusVIN: string | null;
  confidence: number;
  stability: number;
  characterAnalysis?: { problematicPositions: number[]; suggestions: any };
} => {
  const startTime = Date.now();

  if (history.frames.length < 2) {
    return { consensusVIN: null, confidence: 0, stability: 0 };
  }

  const framesToAnalyze = history.frames.slice(-5);

  const characterConfidenceMap = new Map<string, Map<number, number[]>>();

  framesToAnalyze.forEach((frame, frameIndex) => {
    const vin = frame.vin;
    if (!characterConfidenceMap.has(vin)) {
      characterConfidenceMap.set(vin, new Map());
    }
    const vinMap = characterConfidenceMap.get(vin)!;
    for (let pos = 0; pos < 17; pos++) {
      if (!vinMap.has(pos)) {
        vinMap.set(pos, []);
      }
      const frameAge = framesToAnalyze.length - frameIndex;
      const decayFactor = Math.pow(0.9, frameAge - 1);
      const weightedConfidence = frame.confidence * decayFactor;

      vinMap.get(pos)!.push(weightedConfidence);
    }
  });

  const groups = new Map<string, VINScanFrame[]>();

  framesToAnalyze.forEach((frame, index) => {
    const key = frame.vin;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(frame);
  });

  let bestGroup: VINScanFrame[] = [];
  let bestScore = 0;
  let bestCharacterConfidence = 0;
  const now = Date.now();

  groups.forEach((group, vin) => {
    const avgConfidence =
      group.reduce((sum, frame) => sum + frame.confidence, 0) / group.length;
    const frequency = group.length / framesToAnalyze.length;
    const recency =
      group.reduce(
        (sum, frame) => sum + (1 - (now - frame.timestamp) / 30000),
        0
      ) / group.length; // 30s decay

    const characterMap = characterConfidenceMap.get(vin);
    let fusedConfidence = 0;

    if (characterMap) {
      let totalCharacterConfidence = 0;
      let characterCount = 0;

      for (let pos = 0; pos < 17; pos++) {
        const positionConfidences = characterMap.get(pos) || [];
        if (positionConfidences.length > 0) {
          const avgPositionConfidence =
            positionConfidences.reduce((sum, conf) => sum + conf, 0) /
            positionConfidences.length;

          const CRITICAL_POSITIONS = [5, 7]; // 0-indexed positions (6th and 8th characters)
          const positionBoost = CRITICAL_POSITIONS.includes(pos) ? 1.15 : 1.0; // 15% boost for critical positions

          totalCharacterConfidence += avgPositionConfidence * positionBoost;
          characterCount++;
        }
      }

      fusedConfidence =
        characterCount > 0
          ? totalCharacterConfidence / characterCount
          : avgConfidence;
    } else {
      fusedConfidence = avgConfidence;
    }

    const score =
      fusedConfidence * 0.5 + frequency * 0.3 + Math.max(0, recency) * 0.2;

    if (score > bestScore) {
      bestScore = score;
      bestGroup = group;
      bestCharacterConfidence = fusedConfidence;
    }
  });

  if (bestGroup.length === 0) {
    return { consensusVIN: null, confidence: 0, stability: 0 };
  }

  const consensusVIN = bestGroup[0].vin;
  const confidence = bestCharacterConfidence; // Use fusion-enhanced confidence
  const stability = bestGroup.length / framesToAnalyze.length;

  let characterAnalysis;
  if (stability < 0.8 || groups.size > 2) {
    characterAnalysis = analyzeCharacterInconsistencies(framesToAnalyze);
  }

  const processingTime = Date.now() - startTime;
  console.log(
    `🔄 TEMPORAL FUSION: Character-level fusion completed in ${processingTime}ms`
  );
  console.log(
    `🎯 Consensus VIN: ${consensusVIN} (${Math.round(
      confidence * 100
    )}% fused confidence, ${Math.round(stability * 100)}% stability)`
  );

  return { consensusVIN, confidence, stability, characterAnalysis };
};

export const calculateStabilityScore = (
  frames: VINScanFrame[]
): {
  overallStability: number;
  recentStability: number;
  trendDirection: 'improving' | 'declining' | 'stable';
} => {
  if (frames.length < 2)
    return {
      overallStability: 0,
      recentStability: 0,
      trendDirection: 'stable',
    };

  const uniqueVINs = new Set(frames.map((f) => f.vin));
  const mostCommonVIN = [...uniqueVINs].reduce((a, b) =>
    frames.filter((f) => f.vin === a).length >
    frames.filter((f) => f.vin === b).length
      ? a
      : b
  );
  const overallStability =
    frames.filter((f) => f.vin === mostCommonVIN).length / frames.length;

  const recentFrames = frames.slice(-3);
  const recentUniqueVINs = new Set(recentFrames.map((f) => f.vin));
  const recentStability =
    recentUniqueVINs.size === 1 ? 1.0 : 1.0 / recentUniqueVINs.size;

  let trendDirection: 'improving' | 'declining' | 'stable' = 'stable';
  if (frames.length >= 4) {
    const firstHalf = frames.slice(0, Math.floor(frames.length / 2));
    const secondHalf = frames.slice(Math.floor(frames.length / 2));

    const firstStability =
      new Set(firstHalf.map((f) => f.vin)).size === 1
        ? 1.0
        : 1.0 / new Set(firstHalf.map((f) => f.vin)).size;
    const secondStability =
      new Set(secondHalf.map((f) => f.vin)).size === 1
        ? 1.0
        : 1.0 / new Set(secondHalf.map((f) => f.vin)).size;

    if (secondStability > firstStability + 0.1) trendDirection = 'improving';
    else if (secondStability < firstStability - 0.1)
      trendDirection = 'declining';
  }

  return { overallStability, recentStability, trendDirection };
};
