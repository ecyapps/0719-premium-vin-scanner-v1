/**
 * @component ScanningFrameDemo
 * @description Demonstration component showcasing ScanningFrame versatility
 * @props None - Self-contained demo
 * @returns JSX.Element - Demo layout with different scanning frame configurations
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScanningFrame } from './ScanningFrame';

export const ScanningFrameDemo: React.FC = () => {
  const [currentState, setCurrentState] = useState<'idle' | 'scanning' | 'success' | 'error' | 'detecting'>('idle');
  const [isLandscape, setIsLandscape] = useState(false);

  // Cycle through states for demo
  useEffect(() => {
    const states: ('idle' | 'scanning' | 'success' | 'error' | 'detecting')[] = 
      ['idle', 'scanning', 'detecting', 'success', 'error'];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % states.length;
      setCurrentState(states[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ScanningFrame Component Demo</Text>
      
      {/* Orientation Toggle */}
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => setIsLandscape(!isLandscape)}
      >
        <Text style={styles.toggleText}>
          Mode: {isLandscape ? 'Landscape' : 'Portrait'}
        </Text>
      </TouchableOpacity>

      {/* State Indicator */}
      <Text style={styles.stateText}>Current State: {currentState}</Text>

      {/* VIN Scanning */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VIN Scanner</Text>
        <ScanningFrame
          type="vin"
          state={currentState}
          isLandscape={isLandscape}
          processingText="Analyzing VIN..."
        />
      </View>

      {/* QR Code Scanning */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QR Code Scanner</Text>
        <ScanningFrame
          type="qr"
          state={currentState}
          isLandscape={isLandscape}
          processingText="Reading QR code..."
        />
      </View>

      {/* Barcode Scanning */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Barcode Scanner</Text>
        <ScanningFrame
          type="barcode"
          state={currentState}
          isLandscape={isLandscape}
          processingText="Scanning barcode..."
        />
      </View>

      {/* Document Scanning */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Document Scanner</Text>
        <ScanningFrame
          type="document"
          state={currentState}
          isLandscape={isLandscape}
          processingText="Processing document..."
        />
      </View>

      {/* Custom Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Scanner</Text>
        <ScanningFrame
          type="custom"
          state={currentState}
          isLandscape={isLandscape}
          guideText="Custom Scan Area"
          exampleText="Flexible configuration"
          borderColor="#00BCD4"
          cornerSize={15}
          processingText="Custom processing..."
        />
      </View>

      {/* Custom Content Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Content</Text>
        <ScanningFrame
          type="custom"
          state={currentState}
          isLandscape={isLandscape}
          showGuide={false}
          customContent={
            <View style={styles.customContent}>
              <Text style={styles.customText}>🎯</Text>
              <Text style={styles.customLabel}>Target Area</Text>
            </View>
          }
          processingText="Processing target..."
        />
      </View>

      {/* No Corners Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>No Corners</Text>
        <ScanningFrame
          type="vin"
          state={currentState}
          isLandscape={isLandscape}
          showCorners={false}
          borderColor="rgba(255, 0, 255, 0.8)"
          borderWidth={2}
          processingText="Minimal design..."
        />
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stateText: {
    color: '#FFC107',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  customContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  customText: {
    fontSize: 32,
    marginBottom: 8,
  },
  customLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    height: 50,
  },
});

export default ScanningFrameDemo; 