import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Clock, DollarSign, ChevronRight } from 'lucide-react-native';

export default function HistoryScreen() {
  const scans = [
    {
      id: 1,
      vehicle: '2021 Honda Accord Sport',
      vin: '1HGBH41JXMN109186',
      savings: 2400,
      dealerPrice: 26900,
      targetPrice: 24000,
      date: '2 hours ago',
    },
    {
      id: 2,
      vehicle: '2020 Toyota Camry LE',
      vin: '4T1G11AK8LU123456',
      savings: 1800,
      dealerPrice: 23500,
      targetPrice: 21200,
      date: '1 day ago',
    },
    {
      id: 3,
      vehicle: '2019 Nissan Altima SV',
      vin: '1N4AL3AP8KC123789',
      savings: 3200,
      dealerPrice: 21900,
      targetPrice: 18500,
      date: '3 days ago',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <Text style={styles.subtitle}>Your previous VIN scans and analyses</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Total Impact</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$7,400</Text>
            <Text style={styles.statLabel}>Total Savings</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Vehicles Scanned</Text>
          </View>
        </View>
      </View>

      <View style={styles.scansList}>
        {scans.map((scan) => (
          <TouchableOpacity
            key={scan.id}
            style={styles.scanCard}
            onPress={() => router.push('/results')}
          >
            <View style={styles.scanInfo}>
              <Text style={styles.vehicleName}>{scan.vehicle}</Text>
              <Text style={styles.vinText}>VIN: {scan.vin}</Text>
              
              <View style={styles.priceInfo}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Dealer Price:</Text>
                  <Text style={styles.dealerPrice}>${scan.dealerPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Your Target:</Text>
                  <Text style={styles.targetPrice}>${scan.targetPrice.toLocaleString()}</Text>
                </View>
              </View>
              
              <View style={styles.scanFooter}>
                <View style={styles.savingsTag}>
                  <DollarSign size={12} color="#00C851" />
                  <Text style={styles.savingsText}>${scan.savings.toLocaleString()} savings</Text>
                </View>
                <View style={styles.timeTag}>
                  <Clock size={12} color="#666" />
                  <Text style={styles.timeText}>{scan.date}</Text>
                </View>
              </View>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  statsCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00C851',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  scansList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  scanCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  vinText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  priceInfo: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  dealerPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF4444',
  },
  targetPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  scanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  savingsText: {
    fontSize: 12,
    color: '#00C851',
    fontWeight: '500',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666666',
  },
});