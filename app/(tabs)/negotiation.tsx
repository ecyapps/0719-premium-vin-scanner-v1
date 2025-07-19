import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MessageSquare, Bot, User, Send } from 'lucide-react-native';

export default function NegotiationScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Negotiation Assistant</Text>
        <Text style={styles.subtitle}>AI-powered chat to help you negotiate better deals</Text>
      </View>

      <View style={styles.comingSoonCard}>
        <View style={styles.iconContainer}>
          <MessageSquare size={48} color="#007AFF" />
        </View>
        <Text style={styles.comingSoonTitle}>Chat Negotiation Coming Soon!</Text>
        <Text style={styles.comingSoonText}>
          Get personalized negotiation strategies, practice conversations, and real-time advice during your car buying process.
        </Text>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>What&apos;s Coming:</Text>
        
        <View style={styles.featureCard}>
          <Bot size={24} color="#007AFF" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>AI Negotiation Coach</Text>
            <Text style={styles.featureText}>
              Practice your negotiation skills with our AI before the real conversation
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <MessageSquare size={24} color="#00C851" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Real-time Strategy</Text>
            <Text style={styles.featureText}>
              Get instant advice and talking points during your dealership visit
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <User size={24} color="#FF6B35" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Personalized Scripts</Text>
            <Text style={styles.featureText}>
              Custom negotiation scripts based on your specific vehicle and situation
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.notifyButton}>
        <Send size={20} color="white" />
        <Text style={styles.notifyButtonText}>Notify Me When Ready</Text>
      </TouchableOpacity>
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
  comingSoonCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
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
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
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
  notifyButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});