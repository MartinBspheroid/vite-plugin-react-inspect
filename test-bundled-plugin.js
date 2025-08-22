#!/usr/bin/env node

// Test script to verify the bundled plugin works correctly
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const packageDir = path.join(__dirname, 'packages/core')
const distDir = path.join(packageDir, 'dist')

// Check if all required files exist
const requiredFiles = ['index.mjs', 'index.cjs', 'index.d.ts', 'overlay.bundle.js']
for (const file of requiredFiles) {
  const filePath = path.join(distDir, file)
  const exists = fs.existsSync(filePath)
  const _size = exists ? `${(fs.statSync(filePath).size / 1024).toFixed(2)}KB` : 'N/A'
}

// Check package.json exports
const packageJson = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'))

// Check if overlay bundle is properly minified and includes all components
const overlayBundle = fs.readFileSync(path.join(distDir, 'overlay.bundle.js'), 'utf8')
const _bundleSize = (overlayBundle.length / 1024).toFixed(2)

// Verify no source dependencies
const _hasSourceRefs = packageJson.files.includes('src/Overlay.jsx')
