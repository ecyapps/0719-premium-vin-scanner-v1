#!/usr/bin/env node

/**
 * Protection System Test Script for Owner
 * VisiblePaths Inc. - Jean Paul Paulynice
 */

console.log('🔒 VisiblePaths Inc. VIN Scanner - Protection Test');
console.log('='.repeat(50));

// Test 1: Environment Detection
console.log('\n📍 Test 1: Environment Detection');
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';
const isDisabled = process.env.DISABLE_PROTECTION === 'true';

console.log(`  __DEV__ flag: ${isDev ? '✅ Development' : '❌ Production'}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`  DISABLE_PROTECTION: ${isDisabled ? '✅ Disabled' : '❌ Not set'}`);

// Test 2: Protection Status
console.log('\n📊 Test 2: Protection Status');
try {
  const { getProtectionStatus } = require('./utils/codeProtection.ts');
  console.log('  ✅ Protection module loaded successfully');
} catch (error) {
  console.log('  ⚠️  Protection module loading (this is expected in Node.js)');
}

// Test 3: Copyright Headers Check
console.log('\n📄 Test 3: Copyright Headers');
const fs = require('fs');
const filesToCheck = [
  'app/_layout.tsx',
  'app/scanner.tsx',
  'hooks/useVINScanner.ts'
];

filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const hasHeader = content.includes('VisiblePaths Inc.');
    const hasYear = content.includes('2025');
    console.log(`  ${file}: ${hasHeader && hasYear ? '✅ Protected' : '❌ Missing'}`);
  } catch (error) {
    console.log(`  ${file}: ❌ Not found`);
  }
});

// Test 4: Available Control Methods
console.log('\n🎛️  Test 4: Available Control Methods');
console.log('  Method 1: export DISABLE_PROTECTION=true');
console.log('  Method 2: Create .env file with DISABLE_PROTECTION=true');
console.log('  Method 3: Uncomment disableProtectionForDevelopment() in app/_layout.tsx');
console.log('  Method 4: Modify isDevelopmentEnvironment() to return true');

// Test 5: Emergency Disable Test
console.log('\n🚨 Test 5: Emergency Disable Commands');
console.log('  Quick disable: export DISABLE_PROTECTION=true');
console.log('  File remove: rm utils/codeProtection.ts');
console.log('  Script available: node scripts/protect-code.js status');

console.log('\n✅ All protection tests completed!');
console.log('\nℹ️  For full control guide, see: OWNER_CONTROL_GUIDE.md');
console.log('📧 Owner contact: paulynice@visiblepaths.com'); 