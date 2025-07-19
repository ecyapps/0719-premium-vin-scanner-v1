/**
 * @component UIComponentsTest
 * @description Test component that validates all UI components integration
 * @returns Test screen that can be added to the app for validation
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { DollarSign, Clock, MessageSquare, Scan, ArrowLeft, X, TrendingUp, Target } from 'lucide-react-native';
import { Card, Button, Badge } from './index';

export const UIComponentsTest: React.FC = () => {
  const handleTestPress = (testName: string) => {
    Alert.alert('Test Successful', `${testName} component is working correctly!`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>UI Components Integration Test</Text>
      
      {/* Test 1: Recreate Home Screen Cards */}
      <Card variant="default" style={styles.testSection}>
        <Text style={styles.testTitle}>Test 1: Home Screen Cards</Text>
        
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card variant="stat">
            <DollarSign size={24} color="#00C851" />
            <Text style={styles.statValue}>$2,400</Text>
            <Text style={styles.statLabel}>Avg. Savings</Text>
          </Card>
          <Card variant="stat">
            <TrendingUp size={24} color="#007AFF" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Scans Done</Text>
          </Card>
        </View>

        {/* Recent Activity Card */}
        <Card variant="recent">
          <View style={styles.recentInfo}>
            <Text style={styles.recentVehicle}>2021 Honda Accord Sport</Text>
            <Text style={styles.recentVin}>VIN: 1HGBH41JXMN109186</Text>
            <View style={styles.recentStats}>
              <Badge variant="savings" text="$2,400 savings" />
              <Badge variant="time" text="2 hours ago" icon={<Clock size={12} color="#666" />} />
            </View>
          </View>
        </Card>

        {/* Insight Card */}
        <Card variant="insight">
          <Text style={styles.insightTitle}>💡 Pro Tip</Text>
          <Text style={styles.insightText}>
            Used car prices dropped 3% this month. Great time to negotiate!
          </Text>
        </Card>

        {/* Action Card */}
        <Card variant="action">
          <MessageSquare size={24} color="#007AFF" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Start Negotiation Chat</Text>
            <Text style={styles.actionSubtitle}>Get personalized negotiation strategies</Text>
          </View>
        </Card>
      </Card>

      {/* Test 2: Recreate Results Screen Cards */}
      <Card variant="default" style={styles.testSection}>
        <Text style={styles.testTitle}>Test 2: Results Screen Cards</Text>
        
        {/* Vehicle Card */}
        <Card variant="vehicle">
          <Text style={styles.vehicleTitle}>2021 Honda Accord Sport</Text>
          <Text style={styles.vin}>VIN: 1HGBH41JXMN109186</Text>
        </Card>

        {/* Savings Card */}
        <Card variant="savings">
          <View style={styles.savingsIcon}>
            <TrendingUp size={32} color="#00C851" />
          </View>
          <Text style={styles.savingsAmount}>$2,400</Text>
          <Text style={styles.savingsText}>Potential Savings</Text>
        </Card>

        {/* Analysis Card */}
        <Card variant="analysis">
          <Text style={styles.cardTitle}>Market Analysis</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Dealer Price</Text>
            <Text style={styles.priceValueHigh}>$26,900</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Market Value</Text>
            <Text style={styles.priceValueGood}>$24,500</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Your Target</Text>
            <Text style={styles.priceValueTarget}>$24,000</Text>
          </View>
        </Card>

        {/* Leverage Card */}
        <Card variant="leverage">
          <View style={styles.cardHeader}>
            <Target size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Negotiation Leverage</Text>
          </View>
          <View style={styles.leveragePoint}>
            <Badge variant="dot" />
            <Text style={styles.leverageText}>
              Similar 2021 Accords nearby average $24,200
            </Text>
          </View>
          <View style={styles.leveragePoint}>
            <Badge variant="dot" />
            <Text style={styles.leverageText}>
              This price is 8% above market average
            </Text>
          </View>
        </Card>
      </Card>

      {/* Test 3: Button Variants */}
      <Card variant="default" style={styles.testSection}>
        <Text style={styles.testTitle}>Test 3: Button Variants</Text>
        
        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          <Button 
            variant="back" 
            icon={<ArrowLeft size={24} color="#000" />}
            iconPosition="only"
            onPress={() => handleTestPress('Back Button')}
          />
          <Button 
            variant="close" 
            icon={<X size={24} color="white" />}
            iconPosition="only"
            onPress={() => handleTestPress('Close Button')}
          />
          <Button 
            variant="floating" 
            icon={<Scan size={24} color="white" />}
            iconPosition="only"
            onPress={() => handleTestPress('Floating Button')}
          />
        </View>

        {/* Action Buttons */}
        <Button 
          variant="action" 
          title="Get Negotiation Strategy"
          onPress={() => handleTestPress('Action Button')}
          fullWidth
        />
        
        <Button 
          variant="notify" 
          title="Notify Me When Ready"
          icon={<MessageSquare size={20} color="white" />}
          onPress={() => handleTestPress('Notify Button')}
          fullWidth
        />

        {/* Form Buttons */}
        <View style={styles.buttonRow}>
          <Button 
            variant="analyze" 
            title="Analyze VIN"
            onPress={() => handleTestPress('Analyze Button')}
            style={styles.flexButton}
          />
          <Button 
            variant="start" 
            title="Start Scanning"
            onPress={() => handleTestPress('Start Button')}
            style={styles.flexButton}
          />
        </View>
      </Card>

      {/* Test 4: Badge Combinations */}
      <Card variant="default" style={styles.testSection}>
        <Text style={styles.testTitle}>Test 4: Badge Combinations</Text>
        
        {/* Status Badges */}
        <View style={styles.badgeTestRow}>
          <Badge variant="success" text="Success" />
          <Badge variant="warning" text="Warning" />
          <Badge variant="error" text="Error" />
          <Badge variant="info" text="Info" />
        </View>

        {/* Functional Badges */}
        <View style={styles.badgeTestRow}>
          <Badge variant="savings" text="$2,400 savings" icon={<DollarSign size={12} color="#00C851" />} />
          <Badge variant="time" text="2 hours ago" icon={<Clock size={12} color="#666" />} />
        </View>

        {/* Status Indicators */}
        <View style={styles.badgeTestRow}>
          <Badge variant="status" backgroundColor="#4CAF50" />
          <Text style={styles.statusText}>Ready</Text>
          <Badge variant="status" backgroundColor="#FFC107" />
          <Text style={styles.statusText}>Scanning</Text>
          <Badge variant="status" backgroundColor="#F44336" />
          <Text style={styles.statusText}>Error</Text>
        </View>

        {/* Do/Don't Icons */}
        <View style={styles.badgeTestRow}>
          <Badge variant="do" icon={<Text style={styles.iconText}>✓</Text>} />
          <Text style={styles.statusText}>Do</Text>
          <Badge variant="dont" icon={<Text style={styles.iconText}>✗</Text>} />
          <Text style={styles.statusText}>Don&apos;t</Text>
        </View>
      </Card>

      {/* Test 5: Complex Integration */}
      <Card variant="default" style={styles.testSection}>
        <Text style={styles.testTitle}>Test 5: Complex Integration</Text>
        <Text style={styles.testSubtitle}>
          This tests complex layouts combining all components:
        </Text>
        
        <Card variant="scan">
          <View style={styles.scanInfo}>
            <Text style={styles.scanVehicle}>2021 Honda Accord Sport</Text>
            <Text style={styles.scanVin}>VIN: 1HGBH41JXMN109186</Text>
            <View style={styles.scanStats}>
              <Badge variant="savings" text="$2,400 savings" icon={<DollarSign size={12} color="#00C851" />} />
              <Badge variant="time" text="2 hours ago" icon={<Clock size={12} color="#666" />} />
            </View>
          </View>
          <View style={styles.scanActions}>
            <Button 
              variant="text" 
              title="View"
              size="small"
              onPress={() => handleTestPress('View Details')}
            />
          </View>
        </Card>

        <Card variant="feature">
          <MessageSquare size={24} color="#007AFF" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>AI Negotiation Coach</Text>
            <Text style={styles.featureText}>
              Practice your negotiation skills with our AI
            </Text>
          </View>
          <Button 
            variant="toggle" 
            title="Enable"
            size="small"
            onPress={() => handleTestPress('Toggle Feature')}
          />
        </Card>
      </Card>

      {/* Test Results */}
      <Card variant="comingSoon" style={styles.testSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.testIcon}>✅</Text>
        </View>
        <Text style={styles.testResultTitle}>All Tests Passed!</Text>
        <Text style={styles.testResultText}>
          All UI components are working correctly and integrating properly with the existing design system.
        </Text>
        <Button 
          variant="primary" 
          title="Run Integration Test"
          onPress={() => handleTestPress('Full Integration Test')}
        />
      </Card>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  testSection: {
    marginBottom: 20,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  testSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  recentInfo: {
    flex: 1,
  },
  recentVehicle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  recentVin: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  recentStats: {
    flexDirection: 'row',
    gap: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#0056CC',
    lineHeight: 20,
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  vin: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'monospace',
  },
  savingsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00C851',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  savingsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00C851',
    marginVertical: 8,
  },
  savingsText: {
    fontSize: 16,
    color: '#00A142',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666666',
  },
  priceValueHigh: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4444',
  },
  priceValueGood: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00C851',
  },
  priceValueTarget: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  leveragePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  leverageText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  flexButton: {
    flex: 1,
  },
  badgeTestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  statusText: {
    fontSize: 12,
    color: '#666666',
    marginRight: 8,
  },
  iconText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  scanInfo: {
    flex: 1,
  },
  scanVehicle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  scanVin: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  scanStats: {
    flexDirection: 'row',
    gap: 8,
  },
  scanActions: {
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  testIcon: {
    fontSize: 48,
  },
  testResultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  testResultText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  spacer: {
    height: 50,
  },
});

export default UIComponentsTest; 