#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';

interface GatewaySync {
  name: string;
  sourcePath: string;
  targetPath: string;
  exists: boolean;
}

// Configuration
const gatewaysSourceDir = path.join(__dirname, 'gateways');
const wordPressPluginsDir = path.join(__dirname, '..', 'wordpress', 'wp-content', 'plugins');

class GatewaySyncManager {
  private gateways: GatewaySync[] = [];
  private watchers: chokidar.FSWatcher[] = [];

  constructor() {
    this.discoverGateways();
  }

  /**
   * Discover all gateway directories
   */
  private discoverGateways(): void {
    console.log('🔍 Discovering gateway plugins...\n');

    if (!fs.existsSync(gatewaysSourceDir)) {
      console.error('❌ Gateway source directory not found:', gatewaysSourceDir);
      process.exit(1);
    }

    if (!fs.existsSync(wordPressPluginsDir)) {
      console.error('❌ WordPress plugins directory not found:', wordPressPluginsDir);
      process.exit(1);
    }

    const items = fs.readdirSync(gatewaysSourceDir);

    for (const item of items) {
      const sourcePath = path.join(gatewaysSourceDir, item);

      if (fs.statSync(sourcePath).isDirectory() && item.startsWith('growfund-gateway-')) {
        const targetPath = path.join(wordPressPluginsDir, item);
        const exists = fs.existsSync(targetPath);

        this.gateways.push({
          name: item,
          sourcePath,
          targetPath,
          exists,
        });

        console.log(`📦 Found gateway: ${item}`);
        console.log(`   📁 Source: ${sourcePath}`);
        console.log(`   🎯 Target: ${targetPath}`);
        console.log(`   ${exists ? '✅ Target exists' : '❌ Target missing'}`);
        console.log('');
      }
    }

    if (this.gateways.length === 0) {
      console.log('⚠️  No gateway plugins found matching pattern "growfund-gateway-*"');
      process.exit(0);
    }

    console.log(`📊 Found ${this.gateways.length} gateway plugin(s)\n`);
  }

  /**
   * Sync a single file or directory
   */
  private syncPath(gateway: GatewaySync, relativePath: string): void {
    const sourcePath = path.join(gateway.sourcePath, relativePath);
    const targetPath = path.join(gateway.targetPath, relativePath);

    try {
      // Skip vendor directory and zip files during sync
      if (relativePath.includes('vendor/') || relativePath.endsWith('.zip')) {
        return;
      }

      // Ensure target directory exists
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Copy file
      if (fs.existsSync(sourcePath)) {
        const stats = fs.statSync(sourcePath);
        if (stats.isFile()) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`📝 Synced: ${gateway.name}/${relativePath}`);
        }
      }
    } catch (error) {
      console.error(
        `❌ Error syncing ${relativePath}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  /**
   * Perform initial sync for a gateway
   */
  private initialSync(gateway: GatewaySync): void {
    console.log(`🔄 Initial sync for ${gateway.name}...`);

    try {
      // Ensure target directory exists
      if (!fs.existsSync(gateway.targetPath)) {
        fs.mkdirSync(gateway.targetPath, { recursive: true });
        console.log(`📁 Created target directory: ${gateway.targetPath}`);
      }

      // Sync all files except vendor and zip files
      const rsyncCommand = `rsync -av --exclude='vendor/' --exclude='*.zip' "${gateway.sourcePath}/" "${gateway.targetPath}/"`;
      execSync(rsyncCommand, { stdio: 'pipe' });

      console.log(`✅ Initial sync completed for ${gateway.name}`);
    } catch (error) {
      console.error(
        `❌ Initial sync failed for ${gateway.name}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  /**
   * Start watching a gateway for changes
   */
  private watchGateway(gateway: GatewaySync): void {
    const watcher = chokidar.watch(gateway.sourcePath, {
      ignored: ['**/*.zip', '**/.DS_Store', '**/node_modules/**'],
      persistent: true,
      ignoreInitial: true,
    });

    watcher
      .on('add', (filePath) => {
        const relativePath = path.relative(gateway.sourcePath, filePath);
        this.syncPath(gateway, relativePath);
      })
      .on('change', (filePath) => {
        const relativePath = path.relative(gateway.sourcePath, filePath);
        this.syncPath(gateway, relativePath);
      })
      .on('unlink', (filePath) => {
        const relativePath = path.relative(gateway.sourcePath, filePath);
        const targetPath = path.join(gateway.targetPath, relativePath);

        try {
          if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
            console.log(`🗑️  Removed: ${gateway.name}/${relativePath}`);
          }
        } catch (error) {
          console.error(
            `❌ Error removing ${relativePath}:`,
            error instanceof Error ? error.message : error,
          );
        }
      })
      .on('addDir', (dirPath) => {
        const relativePath = path.relative(gateway.sourcePath, dirPath);
        const targetPath = path.join(gateway.targetPath, relativePath);

        try {
          if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
            console.log(`📁 Created directory: ${gateway.name}/${relativePath}`);
          }
        } catch (error) {
          console.error(
            `❌ Error creating directory ${relativePath}:`,
            error instanceof Error ? error.message : error,
          );
        }
      });

    this.watchers.push(watcher);
    console.log(`👁️  Watching ${gateway.name} for changes...`);
  }

  /**
   * Start the sync process
   */
  public start(): void {
    console.log('🚀 Starting Gateway Development Sync...\n');

    // Perform initial sync for all gateways
    for (const gateway of this.gateways) {
      this.initialSync(gateway);
    }

    console.log('');

    // Start watching for changes
    for (const gateway of this.gateways) {
      this.watchGateway(gateway);
    }

    console.log(`\n✅ Sync started for ${this.gateways.length} gateway(s)`);
    console.log('👁️  Watching for changes... (Press Ctrl+C to stop)\n');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.stop();
    });

    process.on('SIGTERM', () => {
      this.stop();
    });
  }

  /**
   * Stop watching and cleanup
   */
  public stop(): void {
    console.log('\n🛑 Stopping gateway sync...');

    for (const watcher of this.watchers) {
      watcher.close();
    }

    console.log('✅ Gateway sync stopped');
    process.exit(0);
  }

  /**
   * Perform a one-time sync without watching
   */
  public syncOnce(): void {
    console.log('🔄 Performing one-time gateway sync...\n');

    for (const gateway of this.gateways) {
      this.initialSync(gateway);
    }

    console.log('\n✅ One-time sync completed');
  }
}

// CLI interface
const command = process.argv[2];
const syncManager = new GatewaySyncManager();

switch (command) {
  case 'watch':
  case undefined:
    syncManager.start();
    break;
  case 'once':
    syncManager.syncOnce();
    break;
  case 'help':
    console.log('Gateway Development Sync');
    console.log('');
    console.log('Usage:');
    console.log('  npm run sync:gateways        # Start watching for changes');
    console.log('  npm run sync:gateways once   # Perform one-time sync');
    console.log('  npm run sync:gateways help   # Show this help');
    console.log('');
    break;
  default:
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "npm run sync:gateways help" for usage information');
    process.exit(1);
}

export default GatewaySyncManager;
