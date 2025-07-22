import { featureFlags } from '@/hooks/useVINScanner';
import { COMMON_WMI_PREFIXES } from './scannerHelperFunctionFour';
import { validateVINContext } from './scannerHelperFunctionTwo';

export const enhanceImageForOCR = async (imageUri: string): Promise<string> => {
  return imageUri;
};

export const isLikelyUIElement = (text: string): boolean => {
  const uiPatterns = [
    /^(ok|cancel|done|back|next|submit|search)$/i,
    /^(button|click|tap|press|select)$/i,
    /^(menu|home|settings|help|about)$/i,
    /^(loading|please wait|processing)$/i,
    /^(error|warning|success|info)$/i,
    /^\d{1,2}:\d{2}(:\d{2})?\s*(am|pm)?$/i, // Time displays
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/i, // Date displays
    /^(wifi|bluetooth|gps|battery|signal)$/i,
  ];

  return uiPatterns.some((pattern) => pattern.test(text.trim()));
};

const VIN_VALID_CHARS = /^[ABCDEFGHJKLMNPRSTUVWXYZ0123456789]+$/;

export const isValidVINFormat = (vin: string): boolean => {
  // Basic length check
  if (vin.length !== 17) return false;

  if (!VIN_VALID_CHARS.test(vin)) return false;

  const wmi = vin.substring(0, 3);
  if (!COMMON_WMI_PREFIXES.has(wmi)) {
    console.log(`🔍 WMI validation failed: ${wmi} not in database`);
    return false;
  }

  const checkDigit = vin.charAt(8);
  if (checkDigit === 'I' || checkDigit === 'O' || checkDigit === 'Q') {
    return false;
  }

  console.log(`✅ WMI validation passed: ${wmi} is valid manufacturer`);
  return true;
};

export const shouldSkipTextProcessing = (text: string): boolean => {
  if (!featureFlags.isEnabled('contextAwareDetection')) {
    return false;
  }

  if (text.length < 10 || text.length > 50) return true;
  if (isLikelyUIElement(text)) return true;
  if (!/[A-Z0-9]/.test(text)) return true; // No alphanumeric content

  const skipPatterns = [
    /vehicle.*type/i,
    /manufacturing.*corp/i,
    /passenger.*car/i,
    /safety.*standard/i,
    /prevention.*standard/i,
    /gvwr.*lbs/i,
    /front.*rear/i,
    /kg.*lbs/i,
    /shown.*above/i,
    /date.*manufacture/i,
    /veicde.*vanutue/i,
    /mode.*er/i,
    /sety.*aw/i,
    /check.*nusber/i,
    /tools.*extensions/i,
    /normal.*text/i,
    /untitled/i,
    /pre.*31/i,
    /^[0-9]{1,3}$/, // Pure numbers (temperature, etc.)
    /^[a-z]{1,4}$/i, // Short common words
    /^\d{1,2}:\d{2}/, // Time stamps
    /^\d{1,2}\/\d{1,2}/, // Date stamps
  ];

  if (text.length === 17) {
    return !isValidVINFormat(text);
  }

  return skipPatterns.some((pattern) => pattern.test(text));
};

export const generateUserFeedback = (
  vin: string,
  confidence: number,
  contextValidation: ReturnType<typeof validateVINContext>
): {
  message: string;
  severity: 'success' | 'warning' | 'error';
  actions: { type: 'retry' | 'manual' | 'accept'; label: string }[];
  highlightPositions: number[];
} => {
  const highlightPositions = contextValidation.adjustments.map(
    (adj) => adj.position
  );

  if (confidence >= 85 && !contextValidation.needsUserReview) {
    return {
      message: `VIN scanned successfully (${Math.round(
        confidence
      )}% confidence)`,
      severity: 'success',
      actions: [{ type: 'accept', label: 'Accept' }],
      highlightPositions: [],
    };
  }

  if (confidence >= 70 && contextValidation.adjustments.length === 0) {
    return {
      message: `VIN detected with good confidence (${Math.round(confidence)}%)`,
      severity: 'success',
      actions: [{ type: 'accept', label: 'Accept' }],
      highlightPositions: [],
    };
  }

  if (contextValidation.needsUserReview) {
    const suggestions = contextValidation.adjustments
      .map(
        (adj) =>
          `Position ${adj.position}: ${adj.original} → ${adj.suggested} (${adj.reason})`
      )
      .join(', ');

    return {
      message: `Low confidence scan (${Math.round(
        confidence
      )}%). Suggestions: ${suggestions}`,
      severity: 'warning',
      actions: [
        { type: 'retry', label: 'Retry Scan' },
        { type: 'manual', label: 'Manual Entry' },
        { type: 'accept', label: 'Accept Anyway' },
      ],
      highlightPositions,
    };
  }

  return {
    message: `Low confidence scan (${Math.round(
      confidence
    )}%). Try better lighting or closer distance.`,
    severity: 'error',
    actions: [
      { type: 'retry', label: 'Retry Scan' },
      { type: 'manual', label: 'Manual Entry' },
    ],
    highlightPositions: [],
  };
};
