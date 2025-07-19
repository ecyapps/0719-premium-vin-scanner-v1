/**
 * PROPRIETARY SOFTWARE - VIN Scanner UI Component
 * Copyright (c) 2025 VisiblePaths Inc. All rights reserved.
 * 
 * This file contains proprietary user interface and interaction logic.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 * 
 * Digital Fingerprint: VIN-SCANNER-UI-COMPONENT-2025
 * License: Proprietary - See LICENSE file for full terms
 * 
 * @component VINScanner
 * @description Professional VIN scanner with clean UI and enhanced capabilities
 * @props None
 * @returns JSX.Element - Clean VIN scanner interface
 */

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useOrientation } from '@/hooks/useOrientation';
import { theme } from '@/theme/theme';
import { useVINScanner } from '../hooks/useVINScanner';
import { ManualVINModal } from '../components/scanner/ManualVINModal';
import { ScanningTipsModal } from '../components/scanner/ScanningTipsModal';
import { CameraView, CameraViewRef } from '../components/scanner/CameraView';
import { CameraOverlay } from '../components/scanner/CameraOverlay';



// VIN scanner result interface
interface VINScanResult {
  vin: string;
  confidence: number;
  source: string;
}

export default function VINScanner() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showManualVINModal, setShowManualVINModal] = useState(false);
  const [autoScan, setAutoScan] = useState(true); // Enable auto-scanning by default
  const [detectedVIN, setDetectedVIN] = useState<VINScanResult | null>(null); // For modern modal UI
  const cameraRef = useRef<CameraViewRef>(null);
  const router = useRouter();
  const { isScanning, error } = useVINScanner();
  const { isLandscape } = useOrientation();



  // VIN detection handler
  const handleVINDetected = (result: VINScanResult) => {
    console.log('🎯 SCANNER UI: handleVINDetected called with:', result);
    console.log('🎯 SCANNER UI: Showing modern modal for VIN:', result.vin);
    
    // Show modern modal UI
    setDetectedVIN(result);
  };

  // Camera control handlers
  const handleTorchToggle = () => {
    cameraRef.current?.controls.toggleTorch();
  };

  const handleCapture = () => {
    cameraRef.current?.controls.takePicture();
  };

  const showHelpDialog = () => {
    setShowHelpModal(true);
  };

  const closeHelpModal = () => {
    setShowHelpModal(false);
  };

  const startScanning = () => {
    setShowHelpModal(false);
  };

  const showManualVINEntry = () => {
    setShowManualVINModal(true);
  };

  const closeManualVINModal = () => {
    setShowManualVINModal(false);
  };

  const handleManualVINAnalyze = (vin: string) => {
    setShowManualVINModal(false);
    router.push({
      pathname: '/results',
      params: { 
        vin: vin,
        confidence: '1.0',
        source: 'manual'
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Camera View with Overlay */}
      <CameraView 
        ref={cameraRef}
        onVINDetected={handleVINDetected}
        autoScan={autoScan}
        onAutoScanToggle={setAutoScan}
        isScanning={isScanning}
        style={styles.camera}
      >
        <CameraOverlay
          isProcessing={cameraRef.current?.controls.isProcessing || false}
          isScanning={isScanning}
          hasError={!!error}
          autoScan={autoScan}
          torch={cameraRef.current?.controls.torch || false}
          onClose={() => router.back()}
          onHelp={showHelpDialog}
          onTorchToggle={handleTorchToggle}
          onAutoScanToggle={setAutoScan}
          onManualEntry={showManualVINEntry}
          onCapture={handleCapture}
        />
      </CameraView>

      {/* Help Modal */}
      <ScanningTipsModal 
        visible={showHelpModal}
        onClose={closeHelpModal}
        onStartScanning={startScanning}
        isLandscape={false}
      />

      {/* Manual VIN Entry Modal */}
      <ManualVINModal
        visible={showManualVINModal}
        onClose={closeManualVINModal}
        onAnalyze={handleManualVINAnalyze}
      />

      {/* Modern VIN Detection Modal */}
      {detectedVIN && (
        <View style={[styles.vinModalOverlay, { opacity: 1 }]}>
          <View style={[
            styles.vinModal,
            isLandscape ? styles.vinModalLandscape : styles.vinModalPortrait
          ]}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.vinCloseButton}
              onPress={() => {
                console.log('❌ SCANNER UI: User closed VIN modal');
                setDetectedVIN(null);
                setAutoScan(true);
              }}
            >
              <Text style={styles.vinCloseText}>✕</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.vinTitle}>VIN Detected</Text>

            {/* VIN Number - Hero Element */}
            <View style={styles.vinCodeContainer}>
              <Text style={styles.vinCodeLabel}>Vehicle Identification Number</Text>
              <View style={styles.vinCodeBox}>
                <Text 
                  style={[
                    styles.vinCode,
                    isLandscape ? styles.vinCodeLandscape : styles.vinCodePortrait
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.8}
                >
                  {detectedVIN.vin}
                </Text>
              </View>
            </View>



            {/* Action Button */}
            <View style={[
              styles.vinButtons,
              isLandscape ? styles.vinButtonsLandscape : styles.vinButtonsPortrait
            ]}>
              <TouchableOpacity 
                style={[styles.vinButton, styles.vinButtonPrimary]}
                onPress={() => {
                  console.log('➡️ SCANNER UI: User chose to continue');
                  setDetectedVIN(null);
                  router.push({
                    pathname: '/results',
                    params: { 
                      vin: detectedVIN.vin,
                      confidence: detectedVIN.confidence.toString(),
                      source: detectedVIN.source
                    }
                  });
                }}
              >
                <Text style={styles.vinButtonTextPrimary}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// Modern, responsive styles for young adults
const styles = {
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  
  // Modal Overlay & Container
  vinModalOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  
  // Base Modal
  vinModal: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    alignItems: 'center' as const,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  
  // Responsive Modal Sizing
  vinModalPortrait: {
    width: '92%' as const,
    maxWidth: 440,
    maxHeight: '80%' as const,
    padding: 28,
    paddingBottom: 32,
  },
  vinModalLandscape: {
    width: '65%' as const,
    maxWidth: 480,
    maxHeight: '90%' as const,
    paddingHorizontal: 32,
    paddingVertical: 24,
    paddingBottom: 32,
  },
  
  // Close Button
  vinCloseButton: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray[200],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 10,
  },
  vinCloseText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.gray[600],
  },
  

  
  // Title
  vinTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: theme.colors.black,
    marginBottom: 28,
    marginTop: 8,
    textAlign: 'center' as const,
    letterSpacing: 0.5,
  },
  
  // VIN Code Container (Hero Element)
  vinCodeContainer: {
    width: '100%' as const,
    marginBottom: 40,
  },
  vinCodeLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.colors.gray[500],
    textAlign: 'center' as const,
    marginBottom: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },
  vinCodeBox: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
    minHeight: 80,
    justifyContent: 'center' as const,
    width: '100%' as const,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vinCode: {
    fontWeight: '900' as const,
    color: theme.colors.black,
    textAlign: 'center' as const,
    letterSpacing: 1.8,
    fontFamily: 'monospace' as const,
    flexShrink: 1,
  },
  vinCodePortrait: {
    fontSize: 16, // Smaller for portrait to prevent cutoff
    lineHeight: 22,
  },
  vinCodeLandscape: {
    fontSize: 22, // Larger for landscape where there's more space
    lineHeight: 28,
  },

  
  // Button Container
  vinButtons: {
    width: '100%' as const,
    marginTop: 8,
  },
  vinButtonsPortrait: {
    flexDirection: 'column' as const,
    gap: 16,
    paddingBottom: 4,
  },
  vinButtonsLandscape: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 20,
    paddingBottom: 4,
  },
  
  // Button Styles
  vinButton: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 14,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 58,
  },
  vinButtonPrimary: {
    backgroundColor: theme.colors.black,
  },
  vinButtonSecondary: {
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // Button Text
  vinButtonTextPrimary: {
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: 'bold' as const,
    letterSpacing: 0.3,
  },
  vinButtonTextSecondary: {
    color: theme.colors.gray[700],
    fontSize: 17,
    fontWeight: 'bold' as const,
    letterSpacing: 0.3,
  },
};





