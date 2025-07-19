#!/usr/bin/env node

/**
 * Robust Development Server Startup Script
 * Prevents Metro/Expo conflicts and 500 errors permanently
 */

const { spawn } = require('child_process');
const { cleanMetroProcesses, cleanCache } = require('./clean-metro');
const path = require('path');

// Use current working directory as fallback
const scriptDir = path.dirname(__filename);

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'blue') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function startServer() {
  try {
    log('🚀 Starting development server with conflict prevention...', 'blue');
    
    // Step 1: Clean up any existing processes
    await cleanMetroProcesses();
    await cleanCache();
    
    // Step 2: Wait for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Start fresh server
    log('🌟 Starting fresh Metro server...', 'green');
    
    const expoPath = path.join(scriptDir, '../node_modules/.bin/expo');
    const args = ['start', '--clear', '--port', '8081'];
    
    const server = spawn('node', [expoPath, ...args], {
      stdio: 'inherit',
      cwd: path.join(scriptDir, '..'),
      env: {
        ...process.env,
        NODE_ENV: 'development',
        EXPO_DEVTOOLS: 'false', // Prevent port conflicts
        EXPO_CACHE_PROMPT: 'false',
        EXPO_NO_DOCTOR: 'true'
      }
    });

    // Handle server events
    server.on('error', (error) => {
      log(`❌ Server error: ${error.message}`, 'red');
      process.exit(1);
    });

    server.on('close', (code) => {
      if (code !== 0) {
        log(`❌ Server exited with code ${code}`, 'red');
        process.exit(code);
      }
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      log('\n🛑 Shutting down server...', 'yellow');
      server.kill('SIGINT');
      await cleanMetroProcesses();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      log('\n🛑 Shutting down server...', 'yellow');
      server.kill('SIGTERM');
      await cleanMetroProcesses();
      process.exit(0);
    });

    log('✅ Development server started successfully!', 'green');
    log('📱 Use "npm run android" or "npm run ios" to deploy to device', 'blue');
    
  } catch (error) {
    log(`❌ Failed to start server: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer }; 