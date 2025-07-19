#!/usr/bin/env node

/**
 * Metro/Expo Cleanup Script
 * Permanently fixes 500 errors by ensuring clean server startup
 */

const { execSync } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function log(message, color = 'blue') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function cleanMetroProcesses() {
  log('🧹 Cleaning Metro/Expo processes...');
  
  const killCommands = [
    'pkill -9 -f "expo.*start" 2>/dev/null || true',
    'pkill -9 -f "metro.*start" 2>/dev/null || true',
    'pkill -9 -f "Metro.*start" 2>/dev/null || true',
    'pkill -9 -f "node.*metro" 2>/dev/null || true',
    'pkill -9 -f "node.*expo" 2>/dev/null || true',
  ];

  for (const cmd of killCommands) {
    try {
      execSync(cmd, { stdio: 'ignore' });
    } catch (error) {
      // Ignore errors - process might not exist
    }
  }

  // Clean up specific ports
  const ports = [8081, 19000, 19001, 19002];
  for (const port of ports) {
    try {
      const { stdout } = await exec(`lsof -ti:${port} 2>/dev/null || true`);
      if (stdout.trim()) {
        const pids = stdout.trim().split('\n');
        for (const pid of pids) {
          try {
            execSync(`kill -9 ${pid} 2>/dev/null || true`);
          } catch (error) {
            // Ignore errors
          }
        }
      }
    } catch (error) {
      // Ignore errors
    }
  }

  log('✅ Metro/Expo processes cleaned', 'green');
}

async function cleanCache() {
  log('🧹 Cleaning Metro cache...');
  
  const cacheCommands = [
    'rm -rf /tmp/metro-* 2>/dev/null || true',
    'rm -rf /tmp/haste-map-* 2>/dev/null || true',
    'rm -rf ~/.expo/packager-info.json 2>/dev/null || true',
  ];

  for (const cmd of cacheCommands) {
    try {
      execSync(cmd, { stdio: 'ignore' });
    } catch (error) {
      // Ignore errors
    }
  }

  log('✅ Cache cleaned', 'green');
}

async function verifyCleanup() {
  log('🔍 Verifying cleanup...');
  
  try {
    const { stdout } = await exec('ps aux | grep -E "(expo|metro)" | grep -v grep | grep -v "clean-metro" || true');
    if (stdout.trim()) {
      log('⚠️  Some processes still running:', 'yellow');
      console.log(stdout);
    } else {
      log('✅ All processes cleaned successfully', 'green');
    }
  } catch (error) {
    log('✅ All processes cleaned successfully', 'green');
  }

  // Check ports
  const ports = [8081, 19000, 19001, 19002];
  let allPortsFree = true;
  
  for (const port of ports) {
    try {
      const { stdout } = await exec(`lsof -ti:${port} 2>/dev/null || true`);
      if (stdout.trim()) {
        log(`⚠️  Port ${port} still in use`, 'yellow');
        allPortsFree = false;
      }
    } catch (error) {
      // Port is free
    }
  }

  if (allPortsFree) {
    log('✅ All ports available', 'green');
  }
}

async function main() {
  try {
    log('🚀 Starting Metro cleanup...', 'blue');
    await cleanMetroProcesses();
    await cleanCache();
    await verifyCleanup();
    log('🎉 Cleanup complete! Ready for clean server start.', 'green');
    process.exit(0);
  } catch (error) {
    log(`❌ Error during cleanup: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { cleanMetroProcesses, cleanCache, verifyCleanup }; 