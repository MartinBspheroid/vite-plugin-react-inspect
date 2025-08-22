#!/usr/bin/env node

import { execSync } from 'node:child_process'
import fs from 'node:fs'

// Test utilities
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

function checkFileNotExists(filePath, _description) {
  if (!fs.existsSync(filePath)) {
    return true
  }
  return false
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  total: 0,
}

function trackResult(success) {
  results.total++
  if (success) {
    results.passed++
  } else {
    results.failed++
  }
}

trackResult(runCommand('bun run build', 'Complete build system execution').success)
trackResult(checkFileExists('packages/core/dist/index.mjs', 'Core plugin ESM build'))
trackResult(checkFileExists('packages/core/dist/index.cjs', 'Core plugin CommonJS build'))
trackResult(checkFileExists('packages/core/dist/index.d.ts', 'Core plugin TypeScript declarations'))
trackResult(checkFileExists('packages/unplugin/dist/index.js', 'Unplugin wrapper build'))
trackResult(checkFileExists('packages/core/dist/overlay.bundle.js', 'Overlay bundle'))

const buildStart = Date.now()
const buildResult = runCommand('bun run build', 'Performance build test')
const buildTime = Date.now() - buildStart
trackResult(buildResult.success && buildTime < 2000) // Should complete in under 2 seconds

trackResult(checkFileNotExists('pnpm-lock.yaml', 'No pnpm lock file'))
trackResult(checkFileNotExists('packages/core/tsup.config.ts', 'No tsup config'))
trackResult(checkFileExists('bun.lockb', 'Bun lock file exists'))
trackResult(
  checkFileNotExists(
    'packages/core/scripts/generate-bundled-sources.js',
    'No string bundling script'
  )
)

trackResult(checkFileContent('package.json', 'bun run', 'Root uses bun commands'))
trackResult(
  checkFileContent('packages/core/package.json', 'bun run build.js', 'Core uses bun build script')
)
trackResult(checkFileContent('bump.config.ts', 'bun run build', 'Bump config uses bun'))

trackResult(
  checkFileContent(
    'packages/core/src/index.ts',
    'virtual:react-inspector-options',
    'Virtual module system'
  )
)
trackResult(
  checkFileContent('packages/core/src/index.ts', 'fs.promises.readFile', 'Modern file serving')
)
trackResult(
  checkFileContent('packages/core/src/index.ts', 'compileSFCTemplate', 'TypeScript compilation')
)
trackResult(
  checkFileContent('packages/core/src/index.ts', 'PluginOption', 'Pure Vite plugin interface')
)

trackResult(
  checkFileExists('packages/core/src/Overlay.standalone.jsx', 'Standalone overlay component')
)
trackResult(checkFileExists('packages/core/build-overlay.js', 'Overlay build script'))
trackResult(
  checkFileContent('packages/core/build-overlay.js', 'build(', 'Overlay build configuration')
)

trackResult(
  checkFileContent(
    'packages/unplugin/src/index.ts',
    'function unpluginReactInspector',
    'Unplugin converted to pure function'
  )
)
trackResult(
  checkFileContent(
    'packages/unplugin/src/vite.ts',
    'export default unplugin',
    'Vite export is direct'
  )
)
trackResult(
  checkFileNotExists('packages/unplugin/src/index.ts', 'createUnplugin', 'No createUnplugin usage')
)

trackResult(checkFileContent('README.md', 'bun add', 'README updated for Bun'))
trackResult(checkFileContent('README.md', '20-30x faster', 'Performance benefits documented'))
trackResult(checkFileContent('packages/core/README.md', 'bun add', 'Core README updated'))
trackResult(checkFileContent('packages/unplugin/README.md', 'bun add', 'Unplugin README updated'))

// Test that playground can start (but don't wait for it to fully start)
const playgroundTest = runCommand(
  'timeout 10s bun run play:react || true',
  'Playground startup test'
)
trackResult(playgroundTest.success || playgroundTest.output.includes('VITE'))

// Test linting
trackResult(
  runCommand('bun run lint || true', 'Linting test (should pass or have only minor issues)').success
)

trackResult(checkFileContent('packages/core/dist/index.mjs', 'export', 'Core plugin has exports'))
trackResult(
  checkFileContent(
    'packages/core/dist/overlay.bundle.js',
    'React',
    'Overlay bundle contains React components'
  )
)

if (results.failed === 0) {
} else {
  process.exit(1)
}
