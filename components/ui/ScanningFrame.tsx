/**
 * @component ScanningFrame
 * @description Advanced reusable scanning frame component supporting multiple scanning types
 * @props ScanningFrameProps - Configuration for frame type, state, dimensions, and content
 * @returns JSX.Element - Responsive scanning frame with corner brackets and customizable content
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

// TypeScript interfaces
type ScanningType = 'vin' | 'qr' | 'barcode' | 'document' | 'custom';
type ScanningState = 'idle' | 'scanning' | 'success' | 'error' | 'detecting';

interface ScanningFrameProps {
  // Frame configuration
  type: ScanningType;
  state: ScanningState;
  isLandscape?: boolean;
  
  // Dimensions (optional - defaults based on type)
  aspectRatio?: number;
  maxHeight?: number;
  minHeight?: number;
  maxWidth?: number;
  customDimensions?: ViewStyle;
  
  // Content customization
  showCorners?: boolean;
  showGuide?: boolean;
  guideText?: string;
  exampleText?: string;
  customContent?: React.ReactNode;
  
  // Visual customization
  borderColor?: string;
  borderWidth?: number;
  cornerSize?: number;
  backgroundColor?: string;
  
  // Processing indicator
  showProcessingIndicator?: boolean;
  processingText?: string;
}

// Default configurations for different scanning types
const getDefaultConfig = (type: ScanningType, isLandscape: boolean = false) => {
  const configs = {
    vin: {
      aspectRatio: isLandscape ? 8.0 : 6.0,
      maxHeight: isLandscape ? 250 : 180,
      minHeight: isLandscape ? 180 : 120,
      maxWidth: isLandscape ? 600 : 320,
      guideText: '17 Characters',
      exampleText: '1HGBH41JXMN109186',
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    qr: {
      aspectRatio: 1.0,
      maxHeight: isLandscape ? 200 : 250,
      minHeight: isLandscape ? 150 : 200,
      maxWidth: isLandscape ? 200 : 250,
      guideText: 'QR Code',
      exampleText: 'Position QR code here',
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    barcode: {
      aspectRatio: isLandscape ? 6.0 : 4.0,
      maxHeight: isLandscape ? 150 : 120,
      minHeight: isLandscape ? 100 : 80,
      maxWidth: isLandscape ? 400 : 280,
      guideText: 'Barcode',
      exampleText: 'Position barcode here',
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    document: {
      aspectRatio: isLandscape ? 1.4 : 0.7,
      maxHeight: isLandscape ? 300 : 400,
      minHeight: isLandscape ? 200 : 300,
      maxWidth: isLandscape ? 400 : 280,
      guideText: 'Document',
      exampleText: 'Position document here',
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    custom: {
      aspectRatio: isLandscape ? 4.0 : 3.0,
      maxHeight: isLandscape ? 200 : 180,
      minHeight: isLandscape ? 150 : 120,
      maxWidth: isLandscape ? 400 : 320,
      guideText: 'Custom Scan',
      exampleText: 'Position item here',
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
  };
  
  return configs[type];
};

// Get colors based on scanning state
const getStateColors = (state: ScanningState) => {
  const colors = {
    idle: {
      border: 'rgba(255, 255, 255, 0.6)',
      background: 'rgba(0, 0, 0, 0.1)',
      text: 'white',
    },
    scanning: {
      border: '#FFC107',
      background: 'rgba(255, 193, 7, 0.1)',
      text: '#FFC107',
    },
    detecting: {
      border: '#2196F3',
      background: 'rgba(33, 150, 243, 0.1)',
      text: '#2196F3',
    },
    success: {
      border: '#4CAF50',
      background: 'rgba(76, 175, 80, 0.1)',
      text: '#4CAF50',
    },
    error: {
      border: '#F44336',
      background: 'rgba(244, 67, 54, 0.1)',
      text: '#F44336',
    },
  };
  
  return colors[state];
};

export const ScanningFrame: React.FC<ScanningFrameProps> = ({
  type,
  state,
  isLandscape = false,
  aspectRatio,
  maxHeight,
  minHeight,
  maxWidth,
  customDimensions,
  showCorners = false, // Changed to false by default
  showGuide = false, // Changed to false by default
  guideText,
  exampleText,
  customContent,
  borderColor,
  borderWidth = 3,
  cornerSize = 20,
  backgroundColor,
  showProcessingIndicator = true,
  processingText,
}) => {
  // Get default configuration
  const defaultConfig = getDefaultConfig(type, isLandscape);
  const stateColors = getStateColors(state);
  
  // Resolve final values
  const finalAspectRatio = aspectRatio ?? defaultConfig.aspectRatio;
  const finalMaxHeight = maxHeight ?? defaultConfig.maxHeight;
  const finalMinHeight = minHeight ?? defaultConfig.minHeight;
  const finalMaxWidth = maxWidth ?? defaultConfig.maxWidth;
  const finalBorderColor = borderColor ?? stateColors.border;
  const finalBackgroundColor = backgroundColor ?? stateColors.background;
  const finalGuideText = guideText ?? defaultConfig.guideText;
  const finalExampleText = exampleText ?? defaultConfig.exampleText;
  
  // Create frame style
  const frameStyle = {
    ...styles.frame,
    aspectRatio: finalAspectRatio,
    maxHeight: finalMaxHeight,
    minHeight: finalMinHeight,
    maxWidth: finalMaxWidth,
    borderColor: finalBorderColor,
    borderWidth,
    backgroundColor: finalBackgroundColor,
    ...customDimensions,
  };
  
  // Corner style
  const cornerStyle = {
    ...styles.corner,
    width: cornerSize,
    height: cornerSize,
    borderRadius: cornerSize / 2,
    backgroundColor: finalBorderColor,
  };

  return (
    <View style={styles.container}>
      <View style={frameStyle}>
        {/* Corner brackets */}
        {showCorners && (
          <>
            <View style={[cornerStyle, styles.topLeft]} />
            <View style={[cornerStyle, styles.topRight]} />
            <View style={[cornerStyle, styles.bottomLeft]} />
            <View style={[cornerStyle, styles.bottomRight]} />
          </>
        )}
        
        {/* Custom content or default guide */}
        {customContent ? (
          customContent
        ) : showGuide ? (
          <View style={styles.guideContainer}>
            <Text style={[styles.guideText, { color: stateColors.text }]}>
              {finalGuideText}
            </Text>
            {finalExampleText && (
              <Text style={[styles.exampleText, { color: stateColors.text }]}>
                {finalExampleText}
              </Text>
            )}
          </View>
        ) : null}
        
        {/* Processing indicator */}
        {(state === 'scanning' || state === 'detecting') && showProcessingIndicator && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={stateColors.text} />
            {processingText && (
              <Text style={[styles.processingText, { color: stateColors.text }]}>
                {processingText}
              </Text>
            )}
          </View>
        )}
        
        {/* Success/Error overlay */}
        {(state === 'success' || state === 'error') && (
          <View style={[styles.statusOverlay, { backgroundColor: stateColors.background }]}>
            <Text style={[styles.statusText, { color: stateColors.text }]}>
              {state === 'success' ? '✓ Detected' : '✗ Error'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  frame: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  corner: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  guideContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  guideText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  exampleText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  processingText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  statusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ScanningFrame; 