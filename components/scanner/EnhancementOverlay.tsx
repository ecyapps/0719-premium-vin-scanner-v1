/**
 * @component EnhancementOverlay
 * @description Overlay for displaying real-time guidance and enhancement feedback
 * @props EnhancementOverlayProps - Configuration and guidance messages
 * @returns JSX.Element - Safe overlay for enhancement feedback
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrientation } from '../../hooks/useOrientation';

// TypeScript interfaces
interface EnhancementStats {
  totalScans: number;
  enhancedScans: number;
  successRate: number;
  averageImprovement: number;
  failureRate: number;
  fallbackUsage: number;
}

interface EnhancementFeatures {
  screenDetection: boolean;
  screenBonus: boolean;
  contrastAnalysis: boolean;
  aggressiveCorrection: boolean;
  contextualCorrection: boolean;
  qualityAnalysis: boolean;
  adaptiveProcessing: boolean;
  realTimeGuidance: boolean;
  performanceMonitoring: boolean;
}

interface UserGuidance {
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  suggestions: string[];
}

interface EnhancementOverlayProps {
  // Enhancement data
  enhancementFeatures: EnhancementFeatures;
  enhancementStats: EnhancementStats;
  currentGuidance: UserGuidance | null;
  isEnhancing: boolean;
  
  // Controls
  onToggleFeature: (feature: keyof EnhancementFeatures) => void;
  onResetStats: () => void;
  
  // Visibility
  showControls: boolean;
  onToggleControls: () => void;
  
  // Optional customization
  position?: 'top' | 'bottom';
  compact?: boolean;
}

export const EnhancementOverlay: React.FC<EnhancementOverlayProps> = ({
  enhancementFeatures,
  enhancementStats,
  currentGuidance,
  isEnhancing,
  onToggleFeature,
  onResetStats,
  showControls,
  onToggleControls,
  position = 'bottom',
  compact = false
}) => {
  const { isLandscape } = useOrientation();
  const [guidanceVisible, setGuidanceVisible] = useState(false);
  const guidanceOpacity = useRef(new Animated.Value(0)).current;
  const guidanceHeight = useRef(new Animated.Value(0)).current;

  const hideGuidance = useCallback(() => {
    Animated.parallel([
      Animated.timing(guidanceOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(guidanceHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setGuidanceVisible(false);
    });
  }, [guidanceOpacity, guidanceHeight]);
  
  // Show guidance when available
  useEffect(() => {
    if (currentGuidance) {
      setGuidanceVisible(true);
      Animated.parallel([
        Animated.timing(guidanceOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(guidanceHeight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
      
      // Auto-hide after 5 seconds unless it's an error
      if (currentGuidance.type !== 'error') {
        setTimeout(() => {
          hideGuidance();
        }, 5000);
      }
    }
  }, [currentGuidance, guidanceOpacity, guidanceHeight, hideGuidance]);
  
  // Get guidance style based on type
  const getGuidanceStyle = (type: UserGuidance['type']) => {
    const styles = {
      info: { backgroundColor: 'rgba(33, 150, 243, 0.9)', borderColor: '#2196F3' },
      warning: { backgroundColor: 'rgba(255, 193, 7, 0.9)', borderColor: '#FFC107' },
      error: { backgroundColor: 'rgba(244, 67, 54, 0.9)', borderColor: '#F44336' },
      success: { backgroundColor: 'rgba(76, 175, 80, 0.9)', borderColor: '#4CAF50' }
    };
    return styles[type];
  };
  
  // Get guidance icon based on type
  const getGuidanceIcon = (type: UserGuidance['type']): keyof typeof import('@expo/vector-icons').Ionicons.glyphMap => {
    const icons = {
      info: 'information-circle-outline' as const,
      warning: 'warning-outline' as const,
      error: 'close-circle-outline' as const,
      success: 'checkmark-circle-outline' as const
    };
    return icons[type] || 'information-circle-outline';
  };
  
  // Feature toggle component
  const FeatureToggle: React.FC<{ feature: keyof EnhancementFeatures; label: string; description: string }> = ({
    feature,
    label,
    description
  }) => (
    <TouchableOpacity
      style={[
        styles.featureToggle,
        enhancementFeatures[feature] && styles.featureToggleActive
      ]}
      onPress={() => onToggleFeature(feature)}
    >
      <View style={styles.featureToggleContent}>
        <Text style={[
          styles.featureToggleLabel,
          enhancementFeatures[feature] && styles.featureToggleLabelActive
        ]}>
          {label}
        </Text>
        <Text style={styles.featureToggleDescription}>{description}</Text>
      </View>
      <Ionicons
        name={enhancementFeatures[feature] ? 'toggle' : 'toggle-outline'}
        size={24}
        color={enhancementFeatures[feature] ? '#4CAF50' : '#999'}
      />
    </TouchableOpacity>
  );
  
  return (
    <View style={[
      styles.overlay,
      position === 'top' && styles.overlayTop,
      isLandscape && styles.overlayLandscape
    ]}>
      {/* Real-time Guidance */}
      {guidanceVisible && currentGuidance && (
        <Animated.View
          style={[
            styles.guidanceContainer,
            getGuidanceStyle(currentGuidance.type),
            {
              opacity: guidanceOpacity,
              transform: [{
                scaleY: guidanceHeight
              }]
            }
          ]}
        >
          <View style={styles.guidanceHeader}>
            <Ionicons
              name={getGuidanceIcon(currentGuidance.type)}
              size={20}
              color="white"
            />
            <Text style={styles.guidanceMessage}>{currentGuidance.message}</Text>
            <TouchableOpacity onPress={hideGuidance}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {currentGuidance.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {currentGuidance.suggestions.map((suggestion, index) => (
                <Text key={index} style={styles.suggestionText}>
                  • {suggestion}
                </Text>
              ))}
            </View>
          )}
        </Animated.View>
      )}
      
      {/* Enhancement Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <View style={[
              styles.statusIndicator,
              isEnhancing ? styles.statusIndicatorActive : styles.statusIndicatorIdle
            ]} />
            <Text style={styles.statusText}>
              {isEnhancing ? 'Enhancing...' : 'Ready'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.controlsToggle}
            onPress={onToggleControls}
          >
            <Ionicons
              name={showControls ? 'chevron-down' : 'chevron-up'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
        
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{enhancementStats.totalScans}</Text>
            <Text style={styles.quickStatLabel}>Scans</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>
              {enhancementStats.enhancedScans}
            </Text>
            <Text style={styles.quickStatLabel}>Enhanced</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>
              {(enhancementStats.successRate * 100).toFixed(0)}%
            </Text>
            <Text style={styles.quickStatLabel}>Success</Text>
          </View>
        </View>
      </View>
      
      {/* Controls Panel */}
      {showControls && (
        <View style={[
          styles.controlsPanel,
          isLandscape && styles.controlsPanelLandscape
        ]}>
          <ScrollView
            style={styles.controlsScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.controlsHeader}>
              <Text style={styles.controlsTitle}>Enhancement Controls</Text>
              <TouchableOpacity onPress={onResetStats} style={styles.resetButton}>
                <Ionicons name="refresh" size={16} color="#666" />
                <Text style={styles.resetButtonText}>Reset Stats</Text>
              </TouchableOpacity>
            </View>
            
            {/* Feature Toggles */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Screen Scanning</Text>
              <FeatureToggle
                feature="screenDetection"
                label="Screen Detection"
                description="Detect website/app screens automatically"
              />
              <FeatureToggle
                feature="screenBonus"
                label="Screen Bonus"
                description="Extra confidence for screen scans"
              />
              <FeatureToggle
                feature="contrastAnalysis"
                label="Contrast Analysis"
                description="Analyze screen contrast and brightness"
              />
              
              <Text style={styles.sectionTitle}>Character Correction</Text>
              <FeatureToggle
                feature="contextualCorrection"
                label="Contextual Correction"
                description="Smart character corrections based on context"
              />
              <FeatureToggle
                feature="aggressiveCorrection"
                label="Aggressive Correction"
                description="More corrections (may affect accuracy)"
              />
              
              <Text style={styles.sectionTitle}>Quality Analysis</Text>
              <FeatureToggle
                feature="qualityAnalysis"
                label="Quality Analysis"
                description="Analyze image quality and provide feedback"
              />
              <FeatureToggle
                feature="adaptiveProcessing"
                label="Adaptive Processing"
                description="Adjust processing based on image quality"
              />
              
              <Text style={styles.sectionTitle}>User Experience</Text>
              <FeatureToggle
                feature="realTimeGuidance"
                label="Real-time Guidance"
                description="Show scanning tips and suggestions"
              />
              <FeatureToggle
                feature="performanceMonitoring"
                label="Performance Monitoring"
                description="Track enhancement performance metrics"
              />
            </View>
            
            {/* Detailed Stats */}
            <View style={styles.detailedStats}>
              <Text style={styles.sectionTitle}>Performance Metrics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{enhancementStats.totalScans}</Text>
                  <Text style={styles.statLabel}>Total Scans</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{enhancementStats.enhancedScans}</Text>
                  <Text style={styles.statLabel}>Enhanced</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {(enhancementStats.averageImprovement * 100).toFixed(1)}%
                  </Text>
                  <Text style={styles.statLabel}>Avg Improvement</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{enhancementStats.fallbackUsage}</Text>
                  <Text style={styles.statLabel}>Fallbacks</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  overlayTop: {
    bottom: 'auto',
    top: 60,
    paddingTop: 16,
  },
  overlayLandscape: {
    paddingHorizontal: 20,
  },
  
  // Guidance styles
  guidanceContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guidanceMessage: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  suggestionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  suggestionText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
    opacity: 0.9,
  },
  
  // Status styles
  statusContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusIndicatorActive: {
    backgroundColor: '#FFC107',
  },
  statusIndicatorIdle: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  controlsToggle: {
    padding: 4,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  quickStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  
  // Controls styles
  controlsPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 12,
    maxHeight: 400,
  },
  controlsPanelLandscape: {
    maxHeight: 300,
  },
  controlsScroll: {
    flex: 1,
  },
  controlsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#666',
  },
  
  // Feature toggle styles
  featuresSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  featureToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  featureToggleActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  featureToggleContent: {
    flex: 1,
  },
  featureToggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  featureToggleLabelActive: {
    color: '#4CAF50',
  },
  featureToggleDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Stats styles
  detailedStats: {
    padding: 16,
    paddingTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
}); 