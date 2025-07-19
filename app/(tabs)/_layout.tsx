import { Tabs , router } from 'expo-router';
import { History, Chrome as Home, MessageSquare, Scan } from 'lucide-react-native';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

function FloatingScanButton() {
  return (
    <View style={styles.floatingButtonContainer}>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/scanner')}
        activeOpacity={0.8}
      >
        <Scan size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: 'transparent',
            borderTopWidth: 0,
            height: 80,
            paddingBottom: 15,
            paddingTop: 8,
            elevation: 0,
            shadowOpacity: 0,
            justifyContent: 'center',
          },
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#CCCCCC',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
          tabBarItemStyle: {
            paddingHorizontal: 8,
            maxWidth: 100,
          },
        }}>
        
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        
        {/* Analytics Tab */}
        <Tabs.Screen
          name="history"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ size, color }) => (
              <History size={size} color={color} />
            ),
          }}
        />
        
        {/* Negotiation Tab */}
        <Tabs.Screen
          name="negotiation"
          options={{
            title: 'Negotiation',
            tabBarIcon: ({ size, color }) => (
              <MessageSquare size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      
      {/* Floating Scan Button */}
      <FloatingScanButton />
    </>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 40, // Much lower - just above tab bar
    right: 20,
    zIndex: 1000,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});