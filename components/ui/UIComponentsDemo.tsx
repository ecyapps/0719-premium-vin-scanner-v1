/**
 * @component UIComponentsDemo
 * @description Demo component showcasing all UI components with their variants
 * @returns Rendered demo screen with all component variations
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { DollarSign, Clock, MessageSquare, Scan, ArrowLeft, X } from 'lucide-react-native';
import { Card, Button, Badge } from './index';

export const UIComponentsDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const handleButtonPress = (buttonName: string) => {
    setSelectedButton(buttonName);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSelectedButton(null);
      Alert.alert('Button Pressed', `You pressed: ${buttonName}`);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>UI Components Demo</Text>
      
      {/* Card Component Showcase */}
      <Card variant="default" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Card Component Variants</Text>
        
        {/* Stat Cards */}
        <View style={styles.row}>
          <Card variant="stat">
            <DollarSign size={24} color="#00C851" />
            <Text style={styles.statValue}>$2,400</Text>
            <Text style={styles.statLabel}>Avg. Savings</Text>
          </Card>
          
          <Card variant="stat">
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Scans Done</Text>
          </Card>
        </View>

        {/* Recent Card */}
        <Card variant="recent">
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>2021 Honda Accord Sport</Text>
            <Text style={styles.cardSubtitle}>VIN: 1HGBH41JXMN109186</Text>
            <View style={styles.badgeRow}>
              <Badge variant="savings" text="$2,400 savings" icon={<DollarSign size={12} color="#00C851" />} />
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
          <View style={styles.flex}>
            <Text style={styles.actionTitle}>Start Negotiation Chat</Text>
            <Text style={styles.actionSubtitle}>Get personalized strategies</Text>
          </View>
        </Card>

        {/* Vehicle Card */}
        <Card variant="vehicle">
          <Text style={styles.vehicleTitle}>2021 Honda Accord Sport</Text>
          <Text style={styles.vinText}>VIN: 1HGBH41JXMN109186</Text>
        </Card>

        {/* Savings Card */}
        <Card variant="savings">
          <View style={styles.savingsIcon}>
            <DollarSign size={32} color="#00C851" />
          </View>
          <Text style={styles.savingsAmount}>$2,400</Text>
          <Text style={styles.savingsText}>Potential Savings</Text>
        </Card>

        {/* Feature Card */}
        <Card variant="feature">
          <MessageSquare size={24} color="#007AFF" />
          <View style={styles.flex}>
            <Text style={styles.featureTitle}>Real-time Strategy</Text>
            <Text style={styles.featureText}>
              Get instant advice during your dealership visit
            </Text>
          </View>
        </Card>

        {/* Coming Soon Card */}
        <Card variant="comingSoon">
          <View style={styles.iconContainer}>
            <MessageSquare size={48} color="#007AFF" />
          </View>
          <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            New features are on the way to enhance your experience.
          </Text>
        </Card>
      </Card>

      {/* Button Component Showcase */}
      <Card variant="default" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Button Component Variants</Text>
        
        {/* Primary Buttons */}
        <View style={styles.buttonSection}>
          <Text style={styles.buttonGroupTitle}>Primary Buttons</Text>
          <Button 
            variant="primary" 
            title="Primary Button"
            onPress={() => handleButtonPress('Primary')}
            loading={loading && selectedButton === 'Primary'}
          />
          <Button 
            variant="primary" 
            title="With Icon"
            icon={<Scan size={20} color="white" />}
            onPress={() => handleButtonPress('Primary with Icon')}
          />
          <Button 
            variant="primary" 
            title="Full Width"
            fullWidth
            onPress={() => handleButtonPress('Primary Full Width')}
          />
        </View>

        {/* Secondary Buttons */}
        <View style={styles.buttonSection}>
          <Text style={styles.buttonGroupTitle}>Secondary Buttons</Text>
          <Button 
            variant="secondary" 
            title="Secondary Button"
            onPress={() => handleButtonPress('Secondary')}
          />
          <Button 
            variant="secondary" 
            title="Disabled"
            disabled
            onPress={() => handleButtonPress('Secondary Disabled')}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <Text style={styles.buttonGroupTitle}>Action Buttons</Text>
          <Button 
            variant="action" 
            title="Get Negotiation Strategy"
            onPress={() => handleButtonPress('Action')}
            loading={loading && selectedButton === 'Action'}
          />
          <Button 
            variant="notify" 
            title="Notify Me When Ready"
            icon={<MessageSquare size={20} color="white" />}
            onPress={() => handleButtonPress('Notify')}
          />
        </View>

        {/* Utility Buttons */}
        <View style={styles.buttonSection}>
          <Text style={styles.buttonGroupTitle}>Utility Buttons</Text>
          <View style={styles.buttonRow}>
            <Button 
              variant="back" 
              icon={<ArrowLeft size={24} color="#000" />}
              iconPosition="only"
              onPress={() => handleButtonPress('Back')}
            />
            <Button 
              variant="close" 
              icon={<X size={24} color="white" />}
              iconPosition="only"
              onPress={() => handleButtonPress('Close')}
            />
            <Button 
              variant="floating" 
              icon={<Scan size={24} color="white" />}
              iconPosition="only"
              onPress={() => handleButtonPress('Floating')}
            />
          </View>
        </View>

        {/* Size Variants */}
        <View style={styles.buttonSection}>
          <Text style={styles.buttonGroupTitle}>Size Variants</Text>
          <Button 
            variant="primary" 
            size="small"
            title="Small"
            onPress={() => handleButtonPress('Small')}
          />
          <Button 
            variant="primary" 
            size="medium"
            title="Medium"
            onPress={() => handleButtonPress('Medium')}
          />
          <Button 
            variant="primary" 
            size="large"
            title="Large"
            onPress={() => handleButtonPress('Large')}
          />
        </View>

        {/* Toggle Buttons */}
        <View style={styles.buttonSection}>
          <Text style={styles.buttonGroupTitle}>Toggle Buttons</Text>
          <Button 
            variant="toggle" 
            title="Toggle Button"
            onPress={() => handleButtonPress('Toggle')}
          />
          <Button 
            variant="text" 
            title="Text Button"
            onPress={() => handleButtonPress('Text')}
          />
        </View>
      </Card>

      {/* Badge Component Showcase */}
      <Card variant="default" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Badge Component Variants</Text>
        
        {/* Status Badges */}
        <View style={styles.badgeSection}>
          <Text style={styles.buttonGroupTitle}>Status Badges</Text>
          <View style={styles.badgeRow}>
            <Badge variant="success" text="Success" />
            <Badge variant="warning" text="Warning" />
            <Badge variant="error" text="Error" />
            <Badge variant="info" text="Info" />
          </View>
        </View>

        {/* Savings Badges */}
        <View style={styles.badgeSection}>
          <Text style={styles.buttonGroupTitle}>Savings Badges</Text>
          <View style={styles.badgeRow}>
            <Badge variant="savings" text="$2,400 savings" icon={<DollarSign size={12} color="#00C851" />} />
            <Badge variant="time" text="2 hours ago" icon={<Clock size={12} color="#666" />} />
          </View>
        </View>

        {/* Dot Indicators */}
        <View style={styles.badgeSection}>
          <Text style={styles.buttonGroupTitle}>Dot Indicators</Text>
          <View style={styles.badgeRow}>
            <Badge variant="status" />
            <Text style={styles.dotText}>Ready</Text>
            <Badge variant="dot" />
            <Text style={styles.dotText}>Bullet point</Text>
          </View>
        </View>

        {/* Icon Badges */}
        <View style={styles.badgeSection}>
          <Text style={styles.buttonGroupTitle}>Icon Badges</Text>
          <View style={styles.badgeRow}>
            <Badge variant="do" icon={<Text style={styles.iconText}>✓</Text>} />
            <Text style={styles.dotText}>Do</Text>
            <Badge variant="dont" icon={<Text style={styles.iconText}>✗</Text>} />
            <Text style={styles.dotText}>Don&apos;t</Text>
          </View>
        </View>

        {/* Size Variants */}
        <View style={styles.badgeSection}>
          <Text style={styles.buttonGroupTitle}>Size Variants</Text>
          <View style={styles.badgeRow}>
            <Badge variant="success" size="small" text="Small" />
            <Badge variant="success" size="medium" text="Medium" />
            <Badge variant="success" size="large" text="Large" />
          </View>
        </View>

        {/* Custom Badges */}
        <View style={styles.badgeSection}>
          <Text style={styles.buttonGroupTitle}>Custom Badges</Text>
          <View style={styles.badgeRow}>
            <Badge 
              variant="default" 
              text="Custom"
              backgroundColor="#FF6B35"
              textColor="white"
            />
            <Badge 
              variant="default" 
              text="Rounded"
              rounded
              backgroundColor="#9C27B0"
              textColor="white"
            />
            <Badge 
              variant="default" 
              text="Bordered"
              border
              borderColor="#007AFF"
              backgroundColor="transparent"
              textColor="#007AFF"
            />
          </View>
        </View>
      </Card>

      {/* Integration Example */}
      <Card variant="default" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Integration Example</Text>
        <Text style={styles.integrationText}>
          This demonstrates how Card, Button, and Badge components work together:
        </Text>
        
        <Card variant="scan">
          <View style={styles.flex}>
            <Text style={styles.scanTitle}>2021 Honda Accord Sport</Text>
            <Text style={styles.scanSubtitle}>VIN: 1HGBH41JXMN109186</Text>
            <View style={styles.badgeRow}>
              <Badge variant="savings" text="$2,400 savings" icon={<DollarSign size={12} color="#00C851" />} />
              <Badge variant="time" text="2 hours ago" icon={<Clock size={12} color="#666" />} />
            </View>
          </View>
          <Button 
            variant="text" 
            title="View Details"
            size="small"
            onPress={() => handleButtonPress('View Details')}
          />
        </Card>
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
  sectionCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  buttonSection: {
    marginBottom: 20,
  },
  buttonGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  badgeSection: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  flex: {
    flex: 1,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    marginBottom: 8,
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
  vinText: {
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
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotText: {
    fontSize: 14,
    color: '#666666',
    marginRight: 12,
  },
  iconText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  integrationText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  scanSubtitle: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  spacer: {
    height: 50,
  },
});

export default UIComponentsDemo; 