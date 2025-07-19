/**
 * @component ScanningTipsModal
 * @description Help modal with scanning tips, visual examples, and best practices
 * @props ScanningTipsModalProps - Modal visibility, close handler, and responsive design
 * @returns JSX.Element - Modal with scanning tips and visual examples
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedModal } from '../ui/AnimatedModal';

interface ScanningTipsModalProps {
  visible: boolean;
  onClose: () => void;
  onStartScanning: () => void;
  isLandscape: boolean;
}

export const ScanningTipsModal: React.FC<ScanningTipsModalProps> = ({ 
  visible, 
  onClose, 
  onStartScanning,
  isLandscape 
}) => {
  const responsiveModalStyles = {
    modalContent: {
      ...styles.modalContent,
      ...(isLandscape && {
        maxWidth: 700,
        maxHeight: 300, // Much shorter for landscape
      }),
    },
  };

  const handleStartScanning = () => {
    onStartScanning();
  };

  return (
    <AnimatedModal visible={visible} onClose={onClose}>
      <View style={responsiveModalStyles.modalContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Best Scanning Practices</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Do&apos;s and Don&apos;ts */}
          <View style={[styles.examplesContainer, isLandscape && styles.examplesContainerLandscape]}>
            <View style={styles.exampleColumn}>
              <View style={styles.exampleHeader}>
                <View style={styles.doIcon}>
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
                <Text style={styles.doText}>Do</Text>
              </View>
              
              <View style={styles.exampleContainer}>
                <View style={styles.vinExampleGood}>
                  <View style={styles.vinPlate}>
                    <Text style={styles.vinNumber}>1HGBH41JXMN109186</Text>
                  </View>
                </View>
                <Text style={styles.exampleLabel}>Good: Clear & centered</Text>
              </View>
            </View>

            <View style={styles.exampleColumn}>
              <View style={styles.exampleHeader}>
                <View style={styles.dontIcon}>
                  <Ionicons name="close" size={16} color="white" />
                </View>
                <Text style={styles.dontText}>Don&apos;t</Text>
              </View>
              
              <View style={styles.exampleContainer}>
                <View style={styles.vinExampleBad}>
                  <View style={[styles.vinPlate, styles.vinPlateAngled]}>
                    <Text style={[styles.vinNumber, styles.vinNumberBlurry]}>1HGBH41JXMN109186</Text>
                  </View>
                </View>
                <Text style={styles.exampleLabel}>Bad: Blurry or angled</Text>
              </View>
            </View>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Scanning Tips:</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Hold device steady and ensure good lighting</Text>
              <Text style={styles.tipItem}>• Position VIN fully within the scanning frame</Text>
              <Text style={styles.tipItem}>• Clean the VIN area of dirt, dust, or debris</Text>
              <Text style={styles.tipItem}>• Use flashlight feature for better visibility</Text>
              <Text style={styles.tipItem}>• If scanning fails, try manual entry</Text>
            </View>
          </View>

          {/* Enhanced Tips for Difficult Conditions */}
          <View style={styles.enhancedTipsContainer}>
            <Text style={styles.enhancedTipsTitle}>💡 For Glare & Surface Issues:</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Angle device to reduce reflections and glare</Text>
              <Text style={styles.tipItem}>• Try scanning from different positions</Text>
              <Text style={styles.tipItem}>• Use your body to block direct sunlight</Text>
              <Text style={styles.tipItem}>• Clean VIN surface with dry cloth if dirty</Text>
              <Text style={styles.tipItem}>• For metal surfaces: angle to minimize reflection</Text>
              <Text style={styles.tipItem}>• Toggle flashlight ON/OFF to find best lighting</Text>
              <Text style={styles.tipItem}>• If auto-scan struggles, use manual capture button</Text>
            </View>
          </View>

          {/* Start Scanning Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartScanning}
          >
            <Text style={styles.startButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </AnimatedModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  examplesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  examplesContainerLandscape: {
    marginBottom: 16, // Reduced spacing for landscape
  },
  exampleColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  dontIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  doText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dontText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  exampleContainer: {
    alignItems: 'center',
  },
  vinExampleGood: {
    width: 100,
    height: 60,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  vinExampleBad: {
    width: 100,
    height: 60,
    backgroundColor: '#F44336',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  vinPlate: {
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  vinPlateAngled: {
    transform: [{ rotate: '12deg' }],
  },
  vinNumber: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  vinNumberBlurry: {
    opacity: 0.4,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  enhancedTipsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  enhancedTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScanningTipsModal; 