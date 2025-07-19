/**
 * @component ManualVINModal
 * @description Manual VIN entry modal with validation and user-friendly interface
 * @props ManualVINModalProps - Modal visibility, close handler, and VIN analysis callback
 * @returns JSX.Element - Modal for manual VIN entry with validation
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedModal } from '../ui/AnimatedModal';
import { useVINScanner } from '../../hooks/useVINScanner';
import { useOrientation } from '../../hooks/useOrientation';

interface ManualVINModalProps {
  visible: boolean;
  onClose: () => void;
  onAnalyze: (vin: string) => void;
}

export const ManualVINModal: React.FC<ManualVINModalProps> = ({ 
  visible, 
  onClose, 
  onAnalyze 
}) => {
  const [vinInput, setVinInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { validateVIN } = useVINScanner();
  const { isLandscape } = useOrientation();
  
  // Responsive sizing
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const modalWidth = Math.min(screenWidth * 0.9, isLandscape ? 700 : 400);
  const modalHeight = isLandscape ? screenHeight * 0.98 : screenHeight * 0.9;

  const handleVINChange = (text: string) => {
    // Convert to uppercase and remove invalid characters
    const cleaned = text.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
    // Limit to 17 characters
    const limited = cleaned.substring(0, 17);
    setVinInput(limited);
  };

  const handleAnalyze = async () => {
    if (!vinInput.trim()) {
      Alert.alert('Error', 'Please enter a VIN number');
      return;
    }

    if (vinInput.length !== 17) {
      Alert.alert('Error', 'VIN must be exactly 17 characters');
      return;
    }

    if (!validateVIN(vinInput)) {
      Alert.alert('Error', 'Invalid VIN format. Please check and try again.');
      return;
    }

    setIsValidating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief validation delay
      onAnalyze(vinInput);
    } catch {
      Alert.alert('Error', 'An error occurred while processing the VIN. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClose = () => {
    setVinInput('');
    onClose();
  };

  const isValidLength = vinInput.length === 17;
  const isValidFormat = vinInput.length > 0 && validateVIN(vinInput);

  return (
    <AnimatedModal visible={visible} onClose={handleClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <View style={[
          styles.modalContent, 
          { width: modalWidth, maxHeight: modalHeight },
          isLandscape && styles.modalContentLandscape
        ]}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={!isLandscape}
            style={isLandscape && { flex: 1 }}
            contentContainerStyle={[styles.scrollContent, isLandscape && styles.scrollContentLandscape]}
          >
            {/* Header */}
            <View style={[styles.header, isLandscape && styles.headerLandscape]}>
              <Text style={styles.title}>Enter VIN</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

          {/* VIN Input */}
          <View style={[styles.inputContainer, isLandscape && styles.inputContainerLandscape]}>
            <TextInput
              style={[
                styles.vinInput,
                isValidFormat && styles.vinInputValid,
                vinInput.length > 0 && !isValidFormat && styles.vinInputInvalid,
                isLandscape && styles.vinInputLandscape
              ]}
              placeholder="Enter 17-digit VIN"
              placeholderTextColor="#999"
              value={vinInput}
              onChangeText={handleVINChange}
              maxLength={17}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              textContentType="none"
              returnKeyType="done"
              onSubmitEditing={handleAnalyze}
              editable={!isValidating}
            />
            
            {/* Character Counter */}
            <View style={styles.counterContainer}>
              <Text style={[
                styles.counter,
                isValidLength && styles.counterValid
              ]}>
                {vinInput.length}/17
              </Text>
              {isValidLength && (
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              )}
            </View>
          </View>

          {/* Validation Hints */}
          <View style={[styles.hintsContainer, isLandscape && styles.hintsContainerLandscape]}>
            <Text style={styles.hintsTitle}>VIN Requirements:</Text>
            <View style={styles.hintItem}>
              <Ionicons 
                name={vinInput.length === 17 ? "checkmark-circle" : "radio-button-off"} 
                size={16} 
                color={vinInput.length === 17 ? "#4CAF50" : "#666"} 
              />
              <Text style={[styles.hintText, vinInput.length === 17 && styles.hintTextValid]}>
                Exactly 17 characters
              </Text>
            </View>
            <View style={styles.hintItem}>
              <Ionicons 
                name={isValidFormat ? "checkmark-circle" : "radio-button-off"} 
                size={16} 
                color={isValidFormat ? "#4CAF50" : "#666"} 
              />
              <Text style={[styles.hintText, isValidFormat && styles.hintTextValid]}>
                Valid format (no I, O, or Q)
              </Text>
            </View>
          </View>

          {/* Help Text */}
          <View style={[styles.helpContainer, isLandscape && styles.helpContainerLandscape]}>
            <Text style={styles.helpText}>
              VIN can be found on the dashboard, door frame, or vehicle registration
            </Text>
          </View>

          {/* Analyze Button */}
          <View style={isLandscape && styles.analyzeButtonContainer}>
            <TouchableOpacity
              style={[
                styles.analyzeButton,
                (!isValidFormat || isValidating) && styles.analyzeButtonDisabled,
                isLandscape && styles.analyzeButtonLandscape
              ]}
              onPress={handleAnalyze}
              disabled={!isValidFormat || isValidating}
            >
              {isValidating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.analyzeButtonText}>Analyze VIN</Text>
              )}
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </AnimatedModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContentLandscape: {
    maxHeight: '98%',
    minHeight: '90%',
    borderRadius: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentLandscape: {
    flexGrow: 1,
    paddingVertical: 2,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerLandscape: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
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
  inputContainer: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  inputContainerLandscape: {
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  vinInput: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'monospace',
    textAlign: 'center',
    color: '#333',
    backgroundColor: 'white',
  },
  vinInputLandscape: {
    paddingVertical: 8,
    fontSize: 15,
  },
  vinInputValid: {
    borderColor: '#4CAF50',
  },
  vinInputInvalid: {
    borderColor: '#F44336',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  counter: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
  },
  counterValid: {
    color: '#4CAF50',
  },
  hintsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  hintsContainerLandscape: {
    padding: 4,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  hintsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  hintTextValid: {
    color: '#4CAF50',
  },
  helpContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  helpContainerLandscape: {
    padding: 4,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  helpText: {
    fontSize: 12,
    color: '#1976d2',
    textAlign: 'center',
    lineHeight: 16,
  },
  analyzeButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  analyzeButtonLandscape: {
    paddingVertical: 8,
    marginBottom: 4,
    marginHorizontal: 16,
    marginTop: 0,
  },
  analyzeButtonContainer: {
    marginTop: 'auto',
    paddingBottom: 4,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManualVINModal; 