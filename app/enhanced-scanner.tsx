/**
 * PROPRIETARY SOFTWARE - enhanced-scanner
 * Copyright (c) 2025 VisiblePaths Inc. All rights reserved.
 * 
 * This file contains proprietary code and business logic.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 * 
 * Digital Fingerprint: VIN-SCANNER-ENHANCED-SCANNER-2025
 * License: Proprietary - See LICENSE file for full terms
 */

/**
 * PROPRIETARY SOFTWARE - enhanced-scanner
 * Copyright (c) 2024 [Your Company Name]. All rights reserved.
 * 
 * This file contains proprietary code and business logic.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 * 
 * Digital Fingerprint: VIN-SCANNER-ENHANCED-SCANNER-2024
 * License: Proprietary - See LICENSE file for full terms
 */

/**
 * @component EnhancedVINScanner
 * @description Enhanced VIN scanner with optimizations and real-time guidance
 * @props None
 * @returns JSX.Element - Enhanced scanner interface with optional features
 */

import React, { useState, useRef } from 'react';
import { View, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useVINScannerEnhancements } from '../hooks/useVINScannerEnhancements';
import { ManualVINModal } from '../components/scanner/ManualVINModal';
import { ScanningTipsModal } from '../components/scanner/ScanningTipsModal';
import { CameraView, CameraViewRef } from '../components/scanner/CameraView';
import { CameraOverlay } from '../components/scanner/CameraOverlay';
import { EnhancementOverlay } from '../components/scanner/EnhancementOverlay';

// VIN scanner result interface
interface VINScanResult {
  vin: string;
  confidence: number;
  source: string;
}

export default function EnhancedVINScanner() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showManualVINModal, setShowManualVINModal] = useState(false);
  const [showEnhancementControls, setShowEnhancementControls] = useState(false);
  const [autoScan, setAutoScan] = useState(true);
  const cameraRef = useRef<CameraViewRef>(null);
  const router = useRouter();
  
  // Use enhanced scanner hook
  const {
    isScanning,
    error,
    enhancementFeatures,
    enhancementStats,
    currentGuidance,
    isEnhancing,
    toggleFeature,
    resetStats
  } = useVINScannerEnhancements();

  // VIN detection handler with enhanced results
  const handleVINDetected = (result: VINScanResult) => {
    const confidenceText = `${(result.confidence * 100).toFixed(1)}%`;
    const sourceText = result.source.toUpperCase();
    
    Alert.alert(
      '🔍 Enhanced VIN Detection!',
      `Found: ${result.vin}\nConfidence: ${confidenceText}\nSource: ${sourceText}${isEnhancing ? '\nEnhanced: YES' : ''}`,
      [
        { 
          text: 'Continue Scanning', 
          style: 'cancel',
          onPress: () => setAutoScan(true)
        },
        { 
          text: 'View Details', 
          onPress: () => router.push({
            pathname: '/results',
            params: { 
              vin: result.vin,
              confidence: result.confidence.toString(),
              source: result.source
            }
          })
        }
      ]
    );
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

  const toggleEnhancementControls = () => {
    setShowEnhancementControls(!showEnhancementControls);
  };

  // Switch to original scanner
  const switchToOriginalScanner = () => {
    Alert.alert(
      'Switch to Original Scanner',
      'This will take you to the original scanner without enhancements.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Switch', 
          onPress: () => router.push('/scanner')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with mode indicator */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Enhanced Scanner</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.enhancedBadge}>
                <Ionicons name="flash" size={12} color="white" />
                <Text style={styles.badgeText}>ENHANCED</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.switchButton}
            onPress={switchToOriginalScanner}
          >
            <Ionicons name="swap-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
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

      {/* Enhancement Overlay */}
      <EnhancementOverlay
        enhancementFeatures={enhancementFeatures}
        enhancementStats={enhancementStats}
        currentGuidance={currentGuidance}
        isEnhancing={isEnhancing}
        onToggleFeature={toggleFeature}
        onResetStats={resetStats}
        showControls={showEnhancementControls}
        onToggleControls={toggleEnhancementControls}
        position="bottom"
        compact={false}
      />

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
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 50,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  enhancedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
}); 