/**
 * @component VINTestingDashboard
 * @description Testing dashboard for systematic VIN scanner optimization testing
 * @props VINTestingDashboardProps - Configuration and testing controls
 * @returns VIN testing interface with feature toggles and metrics
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useVINScanner } from '../../hooks/useVINScanner';

interface VINTestingDashboardProps {
  onTestResult?: (result: any) => void;
  isVisible?: boolean;
}

export const VINTestingDashboard: React.FC<VINTestingDashboardProps> = ({
  onTestResult,
  isVisible = false,
}) => {
  const scanner = useVINScanner();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  // Get current feature status
  const phase1Status = scanner.getPhase1Status();
  const performanceStats = scanner.getPerformanceStats();

  // Test individual features
  const testFeature = useCallback(async (feature: 'roiProcessing' | 'progressiveQuality' | 'adaptiveIntervals') => {
    setCurrentTest(feature);
    
    try {
      // Enable the feature
      scanner.enablePhase1Feature(feature);
      
      // Wait a moment for the feature to be activated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real test, we would scan known VINs here
      console.log(`🧪 Testing feature: ${feature}`);
      
      // For now, just record that we enabled it
      const result = {
        feature,
        enabled: true,
        timestamp: Date.now(),
        status: 'enabled'
      };
      
      setTestResults(prev => [...prev, result]);
      onTestResult?.(result);
      
      Alert.alert(
        'Feature Enabled',
        `${feature} is now enabled. Test scanning some VINs to see the effects.`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error(`❌ Error testing feature ${feature}:`, error);
      Alert.alert('Test Error', `Failed to test ${feature}: ${error}`);
    } finally {
      setCurrentTest(null);
    }
  }, [scanner, onTestResult]);

  // Disable a feature
  const disableFeature = useCallback((feature: 'roiProcessing' | 'progressiveQuality' | 'adaptiveIntervals') => {
    scanner.disablePhase1Feature(feature);
    
    const result = {
      feature,
      enabled: false,
      timestamp: Date.now(),
      status: 'disabled'
    };
    
    setTestResults(prev => [...prev, result]);
    onTestResult?.(result);
    
    Alert.alert(
      'Feature Disabled',
      `${feature} is now disabled.`,
      [{ text: 'OK' }]
    );
  }, [scanner, onTestResult]);

  // Enable all Phase 1 features
  const enableAllPhase1 = useCallback(() => {
    scanner.enableAllPhase1Features();
    
    const result = {
      feature: 'all_phase1',
      enabled: true,
      timestamp: Date.now(),
      status: 'all_enabled'
    };
    
    setTestResults(prev => [...prev, result]);
    onTestResult?.(result);
    
    Alert.alert(
      'Phase 1 Enabled',
      'All Phase 1 features are now enabled:\n• ROI Processing\n• Progressive Quality\n• Adaptive Intervals',
      [{ text: 'OK' }]
    );
  }, [scanner, onTestResult]);

  // Clear test results
  const clearResults = useCallback(() => {
    setTestResults([]);
  }, []);

  // Feature toggle button component
  const FeatureToggle: React.FC<{
    feature: 'roiProcessing' | 'progressiveQuality' | 'adaptiveIntervals';
    title: string;
    description: string;
    isEnabled: boolean;
  }> = ({ feature, title, description, isEnabled }) => (
    <View style={styles.featureContainer}>
      <View style={styles.featureInfo}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      <View style={styles.featureControls}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isEnabled ? styles.enabledButton : styles.disabledButton
          ]}
          onPress={() => isEnabled ? disableFeature(feature) : testFeature(feature)}
          disabled={currentTest === feature}
        >
          <Text style={styles.toggleButtonText}>
            {currentTest === feature ? 'Testing...' : (isEnabled ? 'Disable' : 'Enable')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isVisible) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIN Scanner Testing Dashboard</Text>
        <Text style={styles.headerSubtitle}>Phase 1: Performance Optimizations</Text>
      </View>

      {/* Performance Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        {scanner.baselineMetrics && (
          <View style={styles.metricsRow}>
            <Text style={styles.metricLabel}>Last Scan Time:</Text>
            <Text style={styles.metricValue}>{scanner.baselineMetrics.scanTime}ms</Text>
          </View>
        )}
        {scanner.baselineMetrics && (
          <View style={styles.metricsRow}>
            <Text style={styles.metricLabel}>Confidence:</Text>
            <Text style={styles.metricValue}>{Math.round(scanner.baselineMetrics.confidence * 100)}%</Text>
          </View>
        )}
        {performanceStats && (
          <View style={styles.metricsRow}>
            <Text style={styles.metricLabel}>Success Rate:</Text>
            <Text style={styles.metricValue}>
              {performanceStats.averageAccuracy ? Math.round(performanceStats.averageAccuracy * 100) : 0}%
            </Text>
          </View>
        )}
      </View>

      {/* Phase 1 Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Phase 1 Features</Text>
        
        <FeatureToggle
          feature="roiProcessing"
          title="ROI Processing"
          description="Scan only the scanning frame area (50% performance boost)"
          isEnabled={phase1Status.roiProcessing}
        />
        
        <FeatureToggle
          feature="progressiveQuality"
          title="Progressive Quality"
          description="Start with 0.5 quality, increase to 0.8 then 1.0"
          isEnabled={phase1Status.progressiveQuality}
        />
        
        <FeatureToggle
          feature="adaptiveIntervals"
          title="Adaptive Intervals"
          description="3s → 5s → 8s intervals based on failures"
          isEnabled={phase1Status.adaptiveIntervals}
        />
      </View>

      {/* Bulk Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={enableAllPhase1}
        >
          <Text style={styles.primaryButtonText}>Enable All Phase 1</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={clearResults}
        >
          <Text style={styles.secondaryButtonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      {/* Test Results */}
      {testResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          {testResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultFeature}>{result.feature}</Text>
              <Text style={styles.resultStatus}>{result.status}</Text>
              <Text style={styles.resultTime}>
                {new Date(result.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.sectionTitle}>Testing Instructions</Text>
        <Text style={styles.instructionText}>
          1. Enable features one at a time{'\n'}
          2. Test scanning with known VINs{'\n'}
          3. Monitor performance metrics{'\n'}
          4. Disable if issues occur{'\n'}
          5. Compare before/after results
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 4,
  },
  metricsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  featuresContainer: {
    margin: 16,
    marginTop: 0,
  },
  featureContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureInfo: {
    flex: 1,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featureControls: {
    alignItems: 'flex-end',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  enabledButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#FF9800',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    margin: 16,
    marginTop: 0,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultFeature: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  resultStatus: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  resultTime: {
    fontSize: 12,
    color: '#999',
    flex: 1,
    textAlign: 'right',
  },
  instructionsContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginBottom: 32,
  },
  instructionText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});

export default VINTestingDashboard; 