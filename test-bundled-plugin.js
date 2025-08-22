#!/usr/bin/env node

// Test script to verify the bundled plugin works correctly
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log('🧪 Testing bundled plugin installation...')

const packageDir = path.join(__dirname, 'packages/core')
const distDir = path.join(packageDir, 'dist')

// Check if all required files exist
const requiredFiles = [
  'index.mjs',
  'index.cjs', 
  'index.d.ts',
  'overlay.bundle.js'
]

console.log('\n📁 Checking dist files:')
for (const file of requiredFiles) {
  const filePath = path.join(distDir, file)
  const exists = fs.existsSync(filePath)
  const size = exists ? (fs.statSync(filePath).size / 1024).toFixed(2) + 'KB' : 'N/A'
  console.log(`  ${exists ? '✅' : '❌'} ${file} (${size})`)
}

// Check package.json exports
const packageJson = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'))
console.log('\n📦 Package exports:')
console.log(`  Main: ${packageJson.main}`)
console.log(`  Module: ${packageJson.module}`)
console.log(`  Types: ${packageJson.types}`)

// Check if overlay bundle is properly minified and includes all components
const overlayBundle = fs.readFileSync(path.join(distDir, 'overlay.bundle.js'), 'utf8')
const bundleSize = (overlayBundle.length / 1024).toFixed(2)

console.log('\n🎨 Overlay bundle analysis:')
console.log(`  Size: ${bundleSize}KB`)
console.log(`  Contains InspectorButton: ${overlayBundle.includes('InspectorButton') ? '✅' : '❌'}`)
console.log(`  Contains InspectorOverlay: ${overlayBundle.includes('InspectorOverlay') ? '✅' : '❌'}`) 
console.log(`  Contains InspectorHighlight: ${overlayBundle.includes('InspectorHighlight') ? '✅' : '❌'}`)
console.log(`  Contains positioning utils: ${overlayBundle.includes('calculateFloatPosition') ? '✅' : '❌'}`)
console.log(`  Contains animation styles: ${overlayBundle.includes('react-inspector-animated') ? '✅' : '❌'}`)

// Verify no source dependencies
const hasSourceRefs = packageJson.files.includes('src/Overlay.jsx')
console.log(`\n🔍 Source dependency check:`)
console.log(`  Source files excluded from package: ${!hasSourceRefs ? '✅' : '❌'}`)

console.log('\n🎉 Test complete!')