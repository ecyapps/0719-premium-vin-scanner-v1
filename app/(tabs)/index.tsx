import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Scan, TrendingUp, DollarSign, Clock, ChevronRight, MessageSquare } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>AutoCoach Guardian</Text>
        <Text style={styles.tagline}>Your Smart Car Buying Assistant</Text>
      </View>

      {/* Floating Scan Button */}
      <View style={styles.scanSection}>
        <TouchableOpacity
          style={styles.floatingScanButton}
          onPress={() => router.push('/scanner')}
          activeOpacity={0.9}
        >
          <Scan size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.scanText}>Tap to scan any VIN</Text>
        <Text style={styles.scanSubtext}>Discover your negotiation advantage instantly</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <DollarSign size={24} color="#00C851" />
            <Text style={styles.statValue}>$2,400</Text>
            <Text style={styles.statLabel}>Avg. Savings</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#007AFF" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Scans Done</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.recentCard} onPress={() => router.push('/results')}>
          <View style={styles.recentInfo}>
            <Text style={styles.recentVehicle}>2021 Honda Accord Sport</Text>
            <Text style={styles.recentVin}>VIN: 1HGBH41JXMN109186</Text>
            <View style={styles.recentStats}>
              <View style={styles.savingsTag}>
                <Text style={styles.savingsText}>$2,400 savings</Text>
              </View>
              <View style={styles.timeTag}>
                <Clock size={12} color="#666" />
                <Text style={styles.timeText}>2 hours ago</Text>
              </View>
            </View>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Market Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Market Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>💡 Pro Tip</Text>
          <Text style={styles.insightText}>
            Used car prices dropped 3% this month. Great time to negotiate!
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/negotiation')}
        >
          <MessageSquare size={24} color="#007AFF" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Start Negotiation Chat</Text>
            <Text style={styles.actionSubtitle}>Get personalized negotiation strategies</Text>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionCard, styles.enhancedActionCard]}
          onPress={() => router.push('/enhanced-scanner')}
        >
          <View style={styles.enhancedIcon}>
            <Scan size={20} color="white" />
          </View>
          <View style={styles.actionContent}>
            <View style={styles.enhancedTitleRow}>
              <Text style={styles.actionTitle}>Enhanced Scanner</Text>
              <View style={styles.betaBadge}>
                <Text style={styles.betaBadgeText}>BETA</Text>
              </View>
            </View>
            <Text style={styles.actionSubtitle}>Advanced scanning with real-time optimizations</Text>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
  },
  scanSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  floatingScanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 16,
  },
  scanText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  scanSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
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
  recentSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  recentCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  savingsTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
  insightsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  insightCard: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
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
  actionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  actionCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  enhancedActionCard: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  enhancedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enhancedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  betaBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  betaBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
});