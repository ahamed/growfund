#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface BuildResult {
  folderName: string;
  success: boolean;
  error?: string;
  filePath?: string;
  sizeKB?: number;
}

// Configuration
const gatewaysDir: string = path.join(__dirname, 'gateways');
const outputDir: string = gatewaysDir; // Output zip files in the same directory structure

console.log('🚀 Building gateway zip files...\n');

// Check if gateways directory exists
if (!fs.existsSync(gatewaysDir)) {
  console.error('❌ Gateways directory not found:', gatewaysDir);
  process.exit(1);
}

// Get all directories in the gateways folder
const gatewayFolders: string[] = fs.readdirSync(gatewaysDir).filter((item: string): boolean => {
  const itemPath: string = path.join(gatewaysDir, item);
  return fs.statSync(itemPath).isDirectory() && item.startsWith('growfund-gateway-');
});

if (gatewayFolders.length === 0) {
  console.log('⚠️  No gateway folders found matching pattern "growfund-gateway-*"');
  process.exit(0);
}

console.log(`📁 Found ${gatewayFolders.length} gateway folder(s):\n`);

// Process each gateway folder
const results: BuildResult[] = gatewayFolders.map(
  (folderName: string, index: number): BuildResult => {
    try {
      const folderPath: string = path.join(gatewaysDir, folderName);
      const zipFileName: string = `${folderName}.zip`;
      const zipFilePath: string = path.join(folderPath, zipFileName);

      console.log(`${index + 1}. Processing: ${folderName}`);

      // Remove existing zip file if it exists
      if (fs.existsSync(zipFilePath)) {
        fs.unlinkSync(zipFilePath);
        console.log(`   ♻️  Removed existing ${zipFileName}`);
      }

      // Create zip file using system zip command
      // Change to the gateway folder and zip all contents except the output zip file
      // Include vendor directory and all other files
      const zipCommand: string = `cd "${folderPath}" && zip -r "${zipFileName}" . -x "${zipFileName}"`;

      console.log(`   📦 Creating ${zipFileName}...`);
      execSync(zipCommand, { stdio: 'pipe' });

      // Verify the zip file was created
      if (fs.existsSync(zipFilePath)) {
        const stats = fs.statSync(zipFilePath);
        const sizeInKB: number = Math.round((stats.size / 1024) * 100) / 100;
        console.log(`   ✅ Created ${zipFileName} (${sizeInKB} KB)`);

        return {
          folderName,
          success: true,
          filePath: zipFilePath,
          sizeKB: sizeInKB,
        };
      } else {
        console.log(`   ❌ Failed to create ${zipFileName}`);
        return {
          folderName,
          success: false,
          error: 'Zip file not created',
        };
      }
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
      console.error(`   ❌ Error processing ${folderName}:`, errorMessage);
      return {
        folderName,
        success: false,
        error: errorMessage,
      };
    } finally {
      console.log(''); // Empty line for readability
    }
  },
);

console.log('🎉 Gateway zip files build completed!\n');

// Summary
const successfulResults: BuildResult[] = results.filter((result: BuildResult) => result.success);
const failedResults: BuildResult[] = results.filter((result: BuildResult) => !result.success);

console.log(`📊 Summary:`);
console.log(`   Total folders processed: ${results.length}`);
console.log(`   Successful zip files: ${successfulResults.length}`);
console.log(`   Failed: ${failedResults.length}`);

if (successfulResults.length > 0) {
  console.log(`\n📦 Created zip files:`);
  successfulResults.forEach((result: BuildResult) => {
    console.log(
      `   • ${result.folderName}/${result.folderName}.zip${
        result.sizeKB ? ` (${result.sizeKB} KB)` : ''
      }`,
    );
  });
}

if (failedResults.length > 0) {
  console.log(`\n❌ Failed builds:`);
  failedResults.forEach((result: BuildResult) => {
    console.log(`   • ${result.folderName}: ${result.error}`);
  });
}

// Exit with appropriate code
process.exit(failedResults.length > 0 ? 1 : 0);
