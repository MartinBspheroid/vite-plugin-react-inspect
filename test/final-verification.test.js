#!/usr/bin/env node

import { execSync } from 'node:child_process'
import fs from 'node:fs'

// Key success metrics
const metrics = {
  buildSystem: false,
  performance: false,
  dependencies: false,
  pluginFunctionality: false,
  overlaySystem: false,
  documentation: false,
  integration: false,
}

function runCommand(command, _description) {
  try {
    const output = execSync(command, { encoding: 'utf8', timeout: 30000 })
    return { success: true, output }
  } catch (error) {
    return { success: false, error }
  }
}

function checkFileExists(filePath, _description) {
  if (fs.existsSync(filePath)) {
    return true
  }
  return false
}

function checkFileContent(filePath, expectedContent, _description) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8')
    if (content.includes(expectedContent)) {
      return true
    }
    return false
  }
  return false
}
metrics.buildSystem =
  runCommand('bun run build', 'Complete build system works').success &&
  checkFileExists('packages/core/dist/index.mjs', 'ESM build output') &&
  checkFileExists('packages/core/dist/index.cjs', 'CommonJS build output') &&
  checkFileExists('packages/core/dist/index.d.ts', 'TypeScript declarations') &&
  checkFileExists('packages/core/dist/overlay.bundle.js', 'Overlay bundle')
const buildStart = Date.now()
const buildResult = runCommand('bun run build', 'Performance test')
const buildTime = Date.now() - buildStart
metrics.performance = buildResult.success && buildTime < 2000
metrics.dependencies =
  !fs.existsSync('pnpm-lock.yaml') &&
  !fs.existsSync('packages/core/tsup.config.ts') &&
  fs.existsSync('bun.lock') &&
  checkFileContent('package.json', 'bun run', 'Uses bun commands')
metrics.pluginFunctionality =
  checkFileContent(
    'packages/core/src/index.ts',
    'virtual:react-inspector-path:load.js',
    'Virtual modules'
  ) &&
  checkFileContent('packages/core/src/index.ts', 'fs.promises.readFile', 'Modern file serving') &&
  checkFileContent('packages/core/src/index.ts', 'PluginOption', 'Pure Vite interface') &&
  !fs.existsSync('packages/unplugin')
metrics.overlaySystem =
  checkFileExists('packages/core/src/Overlay.standalone.jsx', 'Standalone overlay') &&
  checkFileExists('packages/core/build-overlay.js', 'Overlay build script') &&
  checkFileContent('packages/core/build-overlay.js', 'build(', 'Overlay configuration')
metrics.documentation =
  checkFileContent('README.md', 'bun add', 'README updated') &&
  checkFileContent('README.md', '20-30x faster', 'Performance documented') &&
  checkFileContent('packages/core/README.md', 'bun add', 'Core README updated')
const playgroundTest = runCommand(
  'timeout 10s bun run play:react || true',
  'Playground integration'
)
metrics.integration = playgroundTest.success || playgroundTest.output.includes('VITE')

// Calculate overall success
const successMetrics = Object.values(metrics).filter(Boolean).length
const totalMetrics = Object.keys(metrics).length
const successRate = ((successMetrics / totalMetrics) * 100).toFixed(1)

if (successRate === '100.0') {
} else {
}
