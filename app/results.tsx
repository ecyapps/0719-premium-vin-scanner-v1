// components/ResultsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  TrendingDown,
  Target,
  TriangleAlert as AlertTriangle,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { styles } from './styles';

export default function ResultsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Results</Text>
        </View>

        <View style={styles.vehicleCard}>
          <Text style={styles.vehicleTitle}>2021 Honda Accord Sport</Text>
          <Text style={styles.vin}>VIN: 1HGBH41JXMN109186</Text>
        </View>

        <View style={styles.savingsCard}>
          <View style={styles.savingsIcon}>
            <TrendingDown size={32} color="#00C851" />
          </View>
          <Text style={styles.savingsAmount}>$2,400</Text>
          <Text style={styles.savingsText}>Potential Savings</Text>
        </View>

        <View style={styles.analysisCard}>
          <Text style={styles.cardTitle}>Market Analysis</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Dealer Price</Text>
            <View style={styles.priceContainer}>
              <AlertTriangle size={16} color="#FF4444" />
              <Text style={styles.priceValueHigh}>$26,900</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Market Value</Text>
            <Text style={styles.priceValueGood}>$24,500</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Your Target</Text>
            <Text style={styles.priceValueTarget}>$24,000</Text>
          </View>
        </View>

        <View style={styles.leverageCard}>
          <View style={styles.cardHeader}>
            <Target size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Negotiation Leverage</Text>
          </View>

          <View style={styles.leveragePoint}>
            <View style={styles.leverageDot} />
            <Text style={styles.leverageText}>
              Similar 2021 Accords nearby average $24,200
            </Text>
          </View>

          <View style={styles.leveragePoint}>
            <View style={styles.leverageDot} />
            <Text style={styles.leverageText}>
              This price is 8% above market average
            </Text>
          </View>

          <View style={styles.leveragePoint}>
            <View style={styles.leverageDot} />
            <Text style={styles.leverageText}>
              3 comparable vehicles within 25 miles for less
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>Get Negotiation Strategy</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
