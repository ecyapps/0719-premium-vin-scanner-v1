#!/usr/bin/env node

/**
 * Flexible Node.js Version Check Script
 * Supports conditional version locking based on features needed
 */

/* eslint-env node */

const fs = require('fs');
const path = require('path');

// Main function to wrap the version check logic
function checkNodeVersion() {
  // Read expected version from package.json
  // eslint-disable-next-line no-undef
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const expectedVersion = packageJson.engines?.node;

  // Get current version
  const currentVersion = process.version.slice(1);

  // Colors for console output
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
  };

  // Check for bypass flags
  const bypassFlags = {
    SKIP_NODE_CHECK: process.env.SKIP_NODE_CHECK === 'true',
    DISABLE_MLKIT: process.env.DISABLE_MLKIT === 'true',
    FORCE_NODE_VERSION: process.env.FORCE_NODE_VERSION === 'true',
    DEVELOPMENT_MODE: process.env.NODE_ENV === 'development'
  };

  console.log(`\n🔍 Node.js Version Check:`);
  console.log(`   Expected: ${expectedVersion}`);
  console.log(`   Current:  ${currentVersion}`);

  // Check bypass conditions
  if (bypassFlags.SKIP_NODE_CHECK) {
    console.log(`${colors.yellow}⚠️ Node version check BYPASSED (SKIP_NODE_CHECK=true)${colors.reset}`);
    console.log(`${colors.blue}ℹ️  ML Kit features may not work with Node.js ${currentVersion}${colors.reset}`);
    console.log(`${colors.green}✅ Continuing with current version...${colors.reset}\n`);
    return;
  }

  if (bypassFlags.DISABLE_MLKIT) {
    console.log(`${colors.yellow}⚠️ ML Kit DISABLED (DISABLE_MLKIT=true)${colors.reset}`);
    console.log(`${colors.blue}ℹ️  Only barcode scanning and manual entry will work${colors.reset}`);
    console.log(`${colors.green}✅ Any Node version is acceptable for this mode${colors.reset}\n`);
    return;
  }

  // Version mismatch handling
  if (currentVersion !== expectedVersion) {
    console.log(`${colors.red}❌ NODE VERSION MISMATCH${colors.reset}`);
    console.log(`\n${colors.yellow}This project recommends Node.js ${expectedVersion} for ML Kit compatibility.${colors.reset}`);
    console.log(`${colors.blue}Current version ${currentVersion} may cause ML Kit plugin issues.${colors.reset}`);
    
    console.log(`\n${colors.green}🔧 Quick Solutions:${colors.reset}`);
    console.log(`${colors.green}1. Use correct version:${colors.reset}`);
    console.log(`   nvm use ${expectedVersion}`);
    console.log(`${colors.green}2. Bypass check temporarily:${colors.reset}`);
    console.log(`   SKIP_NODE_CHECK=true npm run dev`);
    console.log(`${colors.green}3. Disable ML Kit features:${colors.reset}`);
    console.log(`   DISABLE_MLKIT=true npm run dev`);
    console.log(`${colors.green}4. Force continue (risky):${colors.reset}`);
    console.log(`   FORCE_NODE_VERSION=true npm run dev`);
    
    if (bypassFlags.FORCE_NODE_VERSION) {
      console.log(`\n${colors.yellow}⚠️ FORCE MODE: Continuing with Node.js ${currentVersion}${colors.reset}`);
      console.log(`${colors.red}   ML Kit may not work properly!${colors.reset}`);
      console.log(`${colors.blue}   Consider using Node.js ${expectedVersion} for full functionality${colors.reset}`);
    } else if (bypassFlags.DEVELOPMENT_MODE) {
      console.log(`\n${colors.yellow}⚠️ Development Mode: Allowing version mismatch${colors.reset}`);
      console.log(`${colors.blue}   ML Kit features may be limited${colors.reset}`);
    } else {
      console.log(`\n${colors.red}Exiting... Use environment variables above to bypass${colors.reset}\n`);
      process.exit(1);
    }
  }

  if (currentVersion === expectedVersion) {
    console.log(`${colors.green}✅ Node version is correct!${colors.reset}`);
    console.log(`${colors.green}🚀 Full ML Kit functionality available${colors.reset}`);
  }

  // NPM version check
  const npmVersion = require('child_process').execSync('npm --version', { encoding: 'utf8' }).trim();
  const expectedNpmVersion = packageJson.engines?.npm;

  if (expectedNpmVersion) {
    console.log(`\n📦 NPM Version: ${npmVersion}`);
    console.log(`   Required: ${expectedNpmVersion}`);
    
    if (expectedNpmVersion.startsWith('>=')) {
      const minVersion = expectedNpmVersion.slice(2);
      const [currentMajor, currentMinor, currentPatch] = npmVersion.split('.').map(Number);
      const [minMajor, minMinor, minPatch] = minVersion.split('.').map(Number);
      
      const isVersionValid = 
        currentMajor > minMajor ||
        (currentMajor === minMajor && currentMinor > minMinor) ||
        (currentMajor === minMajor && currentMinor === minMinor && currentPatch >= minPatch);
      
      if (!isVersionValid) {
        console.log(`${colors.yellow}⚠️ NPM version might be too old${colors.reset}`);
        console.log(`   Consider upgrading: npm install -g npm@latest`);
      } else {
        console.log(`${colors.green}✅ NPM version is compatible${colors.reset}`);
      }
    }
  }

  console.log(`\n${colors.green}🎯 Ready to proceed!${colors.reset}\n`); 
}

// Call the main function
checkNodeVersion(); 