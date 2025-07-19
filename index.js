import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// This file is the entry point for the app
function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App); 