import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useOrientation } from '@/hooks/useOrientation';
import { theme } from '@/theme/theme';
import { useVINScanner } from '../hooks/useVINScanner';
import { ManualVINModal } from '../components/scanner/ManualVINModal';
import { ScanningTipsModal } from '../components/scanner/ScanningTipsModal';
// import { CameraView, CameraViewRef } from '../components/scanner/CameraView';
import { CameraOverlay } from '../components/scanner/CameraOverlay';
import { styles } from './index.styles';
import { CameraView, CameraViewRef } from '../components/scanner/CameraView/index';

interface VINScanResult {
  vin: string;
  confidence: number;
  source: string;
}

export default function VINScanner() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showManualVINModal, setShowManualVINModal] = useState(false);
  const [autoScan, setAutoScan] = useState(true);
  const [detectedVIN, setDetectedVIN] = useState<VINScanResult | null>(null);
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
        source: 'manual',
      },
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
          <View
            style={[
              styles.vinModal,
              isLandscape ? styles.vinModalLandscape : styles.vinModalPortrait,
            ]}
          >
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
              <Text style={styles.vinCodeLabel}>
                Vehicle Identification Number
              </Text>
              <View style={styles.vinCodeBox}>
                <Text
                  style={[
                    styles.vinCode,
                    isLandscape
                      ? styles.vinCodeLandscape
                      : styles.vinCodePortrait,
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
            <View
              style={[
                styles.vinButtons,
                isLandscape
                  ? styles.vinButtonsLandscape
                  : styles.vinButtonsPortrait,
              ]}
            >
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
                      source: detectedVIN.source,
                    },
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

