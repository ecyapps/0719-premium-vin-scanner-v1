/**
 * PROPRIETARY SOFTWARE - CameraOverlay
 * Copyright (c) 2025 VisiblePaths Inc. All rights reserved.
 * 
 * This file contains proprietary code and business logic.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 * 
 * Digital Fingerprint: VIN-SCANNER-CAMERAOVERLAY-2025
 * License: Proprietary - See LICENSE file for full terms
 */

/**
 * PROPRIETARY SOFTWARE - CameraOverlay
 * Copyright (c) 2024 [Your Company Name]. All rights reserved.
 * 
 * This file contains proprietary code and business logic.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 * 
 * Digital Fingerprint: VIN-SCANNER-CAMERAOVERLAY-2024
 * License: Proprietary - See LICENSE file for full terms
 */

/**
 * @component CameraOverlay
 * @description UI overlay for camera view with controls and scanning frame
 * @props CameraOverlayProps - Configuration for overlay elements and callbacks
 * @returns JSX.Element - Overlay UI components positioned over camera view
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrientation } from '../../hooks/useOrientation';
import { ScanningFrame } from '../ui/ScanningFrame';

// TypeScript interfaces
interface CameraOverlayProps {
  // Status and state
  isProcessing: boolean;
  isScanning: boolean;
  hasError: boolean;
  autoScan: boolean;
  torch: boolean;
  
  // Callbacks
  onClose: () => void;
  onHelp: () => void;
  onTorchToggle: () => void;
  onAutoScanToggle: (enabled: boolean) => void;
  onManualEntry: () => void;
  onCapture: () => void;
  
  // Optional customization
  showAutoScanToggle?: boolean;
  showManualEntry?: boolean;
  customInstructions?: string;
}

export const CameraOverlay: React.FC<CameraOverlayProps> = ({
  isProcessing,
  isScanning,
  hasError,
  autoScan,
  torch,
  onClose,
  onHelp,
  onTorchToggle,
  onAutoScanToggle,
  onManualEntry,
  onCapture,
  showAutoScanToggle = false, // Changed to false by default
  showManualEntry = true,
  customInstructions,
}) => {
  const { isLandscape } = useOrientation();
  
  // Enhanced state management to prevent persistent yellow border
  const [isUIInteracting, setIsUIInteracting] = useState(false);
  const uiTimeoutRef = useRef<number | null>(null);
  
  // More restrictive processing state - only show during actual camera scanning
  const shouldShowProcessingState = isProcessing && isScanning && !isUIInteracting;
  
  // Enhanced UI action handler with better timeout management
  const handleUIAction = (action: () => void) => {
    setIsUIInteracting(true);
    action();
    
    // Clear any existing timeout
    if (uiTimeoutRef.current) {
      clearTimeout(uiTimeoutRef.current);
    }
    
    // Set new timeout with longer delay to prevent flickering
    uiTimeoutRef.current = setTimeout(() => {
      setIsUIInteracting(false);
    }, 500) as unknown as number;
  };

  return (
    <View style={styles.overlay}>
      {/* Top section with status and controls - MOVED HIGHER */}
      <View style={styles.topSection}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <View style={[styles.statusDot, 
            shouldShowProcessingState ? styles.statusDotScanning : 
            hasError ? styles.statusDotError : styles.statusDotReady
          ]} />
          <Text style={styles.titleText}>Scanner</Text>
          <TouchableOpacity 
            style={styles.helpButtonInline}
            onPress={() => handleUIAction(onHelp)}
          >
            <Ionicons name="help-circle-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.torchButton}
          onPress={onTorchToggle}
        >
          <Ionicons 
            name={torch ? "flashlight" : "flashlight-outline"} 
            size={24} 
            color={torch ? "#FFC107" : "white"} 
          />
        </TouchableOpacity>
      </View>

      {/* Fixed positioned scanning frame */}
      <View style={styles.scanningFrameContainer}>
        <ScanningFrame
          type="vin"
          state={shouldShowProcessingState ? 'scanning' : hasError ? 'error' : 'idle'}
          isLandscape={isLandscape}
          processingText={shouldShowProcessingState ? 'Analyzing VIN...' : undefined}
        />
      </View>



      {/* Auto-scan toggle */}
      {showAutoScanToggle && (
        <View style={isLandscape ? styles.autoScanContainerLandscape : styles.autoScanContainer}>
          <TouchableOpacity
            style={[styles.autoScanToggle, autoScan && styles.autoScanToggleActive]}
            onPress={() => onAutoScanToggle(!autoScan)}
          >
            <Ionicons 
              name={autoScan ? "scan" : "scan-outline"} 
              size={20} 
              color={autoScan ? "#22C55E" : "white"} 
            />
            <Text style={[styles.autoScanText, autoScan && styles.autoScanTextActive]}>
              {autoScan ? 'Auto-Scan ON' : 'Auto-Scan OFF'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom section with controls - ADJUSTED for better spacing */}
      <View style={styles.bottomSection}>
        {isLandscape ? (
          // Landscape layout: Compact controls
          <View style={styles.landscapeControlsContainer}>
            <TouchableOpacity
              style={[styles.captureButton, (shouldShowProcessingState || isScanning) && styles.captureButtonDisabled]}
              onPress={onCapture}
              disabled={shouldShowProcessingState || isScanning}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            {showManualEntry && (
              <TouchableOpacity
                style={styles.manualEntryButton}
                onPress={() => handleUIAction(onManualEntry)}
              >
                <Text style={styles.manualEntryButtonText}>T</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // Portrait layout: Stacked controls
          <View style={styles.portraitControlsContainer}>
            <TouchableOpacity
              style={[styles.captureButton, (shouldShowProcessingState || isScanning) && styles.captureButtonDisabled]}
              onPress={onCapture}
              disabled={shouldShowProcessingState || isScanning}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            {showManualEntry && (
              <TouchableOpacity
                style={styles.manualEntryButton}
                onPress={() => handleUIAction(onManualEntry)}
              >
                <Text style={styles.manualEntryButtonText}>T</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

// Styles with improved positioning
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flex: 1,
  },
  topSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 45, // REDUCED from 60 - moves icons higher
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5, // REDUCED from 10 - moves button higher
  },
  torchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5, // REDUCED from 10 - moves button higher
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5, // REDUCED from 10 - moves title higher
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusDotReady: {
    backgroundColor: '#4CAF50',
  },
  statusDotScanning: {
    backgroundColor: '#FFC107',
  },
  statusDotError: {
    backgroundColor: '#F44336',
  },
  titleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  helpButtonInline: {
    padding: 4,
    marginLeft: 2,
  },
  scanningFrameContainer: {
    position: 'absolute',
    top: '25%', // Keep scanning frame position
    left: '10%',
    right: '10%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },


  autoScanContainer: {
    position: 'absolute',
    top: '50%', // Portrait mode - moved up from 55% for better spacing
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  autoScanContainerLandscape: {
    position: 'absolute',
    top: '60%', // Landscape mode - moved up from 65% for better spacing
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 50,
    paddingTop: 160, // Increased from 120 to 160 to move buttons down more
  },
  inputMethodsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'white',
  },
  manualEntryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  manualEntryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  rightSpacer: {
    width: 45,
  },
  leftSpacer: {
    width: 45,
  },
  landscapeControlsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 25,
  },
  autoScanToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  autoScanToggleActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  autoScanText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  autoScanTextActive: {
    color: '#4CAF50',
  },
  portraitControlsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
});

export default CameraOverlay; 