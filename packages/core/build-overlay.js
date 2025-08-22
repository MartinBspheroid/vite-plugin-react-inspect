#!/usr/bin/env node

import { argv, exit } from 'node:process'
import { build } from 'bun'

const isDev = argv.includes('--watch') || argv.includes('--dev')

if (isDev) {
  console.warn('Building overlay (watch mode)...')
} else {
  console.warn('Building overlay...')
}

build({
  entrypoints: ['src/Overlay.standalone.jsx'],
  outdir: 'dist',
  target: 'browser',
  format: 'esm',
  minify: !isDev,
  bundle: true,
  external: ['react', 'react-dom'],
  jsx: 'automatic',
  sourcemap: isDev ? 'inline' : false,
  watch: isDev,
  naming: '[dir]/overlay.bundle.[ext]',
})
  .then(result => {
    console.warn('✅ Overlay bundle completed successfully')
    console.warn('Build result:', result)
    console.warn('Checking if file exists...')
    const fs = require('node:fs')
    if (fs.existsSync('dist/overlay.bundle.js')) {
      console.warn('✅ File exists!')
    } else {
      console.warn('❌ File does not exist')
    }
  })
  .catch(error => {
    console.error('❌ Overlay build failed:', error)
    exit(1)
  })
