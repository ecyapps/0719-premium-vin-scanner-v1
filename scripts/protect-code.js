#!/usr/bin/env node

/**
 * PROPRIETARY CODE PROTECTION SCRIPT
 * Copyright (c) 2025 VisiblePaths Inc. All rights reserved.
 * 
 * This script implements additional code protection measures including:
 * - Copyright header verification
 * - Digital fingerprint validation
 * - Build watermarking
 * - Protection integrity checks
 * 
 * Digital Fingerprint: VIN-SCANNER-PROTECTION-SCRIPT-2024
 * License: Proprietary - See LICENSE file for terms
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Protection configuration
const PROTECTION_CONFIG = {
  copyrightNotice: 'Copyright (c) 2025 VisiblePaths Inc. All rights reserved.',
  licenseType: 'PROPRIETARY',
  protectionLevel: 'MAXIMUM',
  watermarkPrefix: 'VIN-SCANNER',
  buildYear: '2025'
};

// Files that must have copyright headers
const PROTECTED_FILES = [
  'app/_layout.tsx',
  'app/scanner.tsx',
  'app/enhanced-scanner.tsx',
  'hooks/useVINScanner.ts',
  'hooks/useVINScannerEnhancements.ts',
  'components/scanner/CameraView.tsx',
  'components/scanner/CameraOverlay.tsx',
  'utils/codeProtection.ts'
];

// Generate unique build fingerprint
function generateBuildFingerprint() {
  const timestamp = Date.now().toString();
  const randomData = Math.random().toString(36).substring(2, 15);
  const hash = crypto.createHash('sha256').update(timestamp + randomData).digest('hex');
  return `${PROTECTION_CONFIG.watermarkPrefix}-${PROTECTION_CONFIG.buildYear}-${hash.substring(0, 8).toUpperCase()}`;
}

// Verify copyright header in file
function verifyCopyrightHeader(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasCopyright = content.includes(PROTECTION_CONFIG.copyrightNotice);
    const hasDigitalFingerprint = content.includes('Digital Fingerprint:');
    const hasLicenseReference = content.includes('License: Proprietary');
    
    return {
      hasCopyright,
      hasDigitalFingerprint,
      hasLicenseReference,
      isProtected: hasCopyright && hasDigitalFingerprint && hasLicenseReference
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return { isProtected: false };
  }
}

// Add protection header to file
function addProtectionHeader(filePath, componentName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fingerprint = `${PROTECTION_CONFIG.watermarkPrefix}-${componentName.toUpperCase()}-${PROTECTION_CONFIG.buildYear}`;
    
    const protectionHeader = `/**
 * PROPRIETARY SOFTWARE - ${componentName}
 * ${PROTECTION_CONFIG.copyrightNotice}
 * 
 * This file contains proprietary code and business logic.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 * 
 * Digital Fingerprint: ${fingerprint}
 * License: Proprietary - See LICENSE file for full terms
 */

`;

    // Add header if not present
    if (!content.includes(PROTECTION_CONFIG.copyrightNotice)) {
      const newContent = protectionHeader + content;
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Added protection header to ${filePath}`);
    } else {
      console.log(`📋 Protection header already present in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error adding protection header to ${filePath}:`, error.message);
  }
}

// Verify protection integrity
function verifyProtectionIntegrity() {
  console.log('🔍 Verifying code protection integrity...\n');
  
  let allProtected = true;
  const protectionReport = [];
  
  // Check protected files
  PROTECTED_FILES.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      const verification = verifyCopyrightHeader(filePath);
      protectionReport.push({
        file,
        ...verification
      });
      
      if (!verification.isProtected) {
        allProtected = false;
        console.log(`❌ ${file} - Missing protection`);
      } else {
        console.log(`✅ ${file} - Protected`);
      }
    } else {
      console.log(`⚠️  ${file} - File not found`);
    }
  });
  
  // Check core protection files
  const coreFiles = ['LICENSE', 'utils/codeProtection.ts', 'PROTECTION_GUIDE.md'];
  coreFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} - Present`);
    } else {
      console.log(`❌ ${file} - Missing critical protection file`);
      allProtected = false;
    }
  });
  
  console.log('\n📊 Protection Report:');
  console.log('====================');
  console.log(`Total Files Checked: ${PROTECTED_FILES.length}`);
  console.log(`Protected Files: ${protectionReport.filter(r => r.isProtected).length}`);
  console.log(`Unprotected Files: ${protectionReport.filter(r => !r.isProtected).length}`);
  console.log(`Overall Status: ${allProtected ? '✅ PROTECTED' : '❌ VULNERABLE'}`);
  
  return allProtected;
}

// Generate protection report
function generateProtectionReport() {
  const buildFingerprint = generateBuildFingerprint();
  const timestamp = new Date().toISOString();
  
  const report = {
    timestamp,
    buildFingerprint,
    protectionLevel: PROTECTION_CONFIG.protectionLevel,
    copyright: PROTECTION_CONFIG.copyrightNotice,
    licenseType: PROTECTION_CONFIG.licenseType,
    protectedFiles: PROTECTED_FILES.length,
    integrity: verifyProtectionIntegrity(),
    warnings: [
      'This software is protected by copyright law',
      'Unauthorized copying, modification, or distribution is prohibited',
      'All usage is monitored and logged',
      'Violations will be prosecuted to the full extent of the law'
    ]
  };
  
  // Save report
  fs.writeFileSync('protection-report.json', JSON.stringify(report, null, 2));
  console.log('\n📋 Protection report saved to protection-report.json');
  
  // Display summary
  console.log('\n🔒 PROTECTION SUMMARY');
  console.log('====================');
  console.log(`Build Fingerprint: ${buildFingerprint}`);
  console.log(`Protection Level: ${PROTECTION_CONFIG.protectionLevel}`);
  console.log(`License Type: ${PROTECTION_CONFIG.licenseType}`);
  console.log(`Timestamp: ${timestamp}`);
  
  return report;
}

// Main execution
function main() {
  console.log('🔒 VIN Scanner Code Protection System');
  console.log('=====================================\n');
  
  const command = process.argv[2];
  
  switch (command) {
    case 'verify':
      verifyProtectionIntegrity();
      break;
      
    case 'report':
      generateProtectionReport();
      break;
      
    case 'protect':
      // Add protection headers to all files
      PROTECTED_FILES.forEach(file => {
        const componentName = path.basename(file, path.extname(file));
        addProtectionHeader(file, componentName);
      });
      break;
      
    case 'status':
      console.log('🔒 Protection Status:');
      console.log(`Copyright: ${PROTECTION_CONFIG.copyrightNotice}`);
      console.log(`License: ${PROTECTION_CONFIG.licenseType}`);
      console.log(`Protection Level: ${PROTECTION_CONFIG.protectionLevel}`);
      console.log(`Build Year: ${PROTECTION_CONFIG.buildYear}`);
      break;
      
    default:
      console.log('Usage: node scripts/protect-code.js <command>');
      console.log('Commands:');
      console.log('  verify  - Verify protection integrity');
      console.log('  report  - Generate protection report');
      console.log('  protect - Add protection headers');
      console.log('  status  - Show protection status');
      break;
  }
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = {
  verifyProtectionIntegrity,
  generateProtectionReport,
  addProtectionHeader,
  PROTECTION_CONFIG
}; 