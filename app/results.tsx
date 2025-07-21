import {
  View,
  Text,
  StyleSheet,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  vehicleCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
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
  savingsCard: {
    backgroundColor: '#E8F5E8',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00C851',
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
  analysisCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  leverageCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  leverageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginTop: 7,
  },
  leverageText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#000000',
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});
