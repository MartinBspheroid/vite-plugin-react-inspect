#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { argv, exit } from 'node:process'
import { build } from 'bun'

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'pipe' })
    let stdout = ''
    let stderr = ''

    child.stdout.on('data', data => {
      stdout += data.toString()
    })

    child.stderr.on('data', data => {
      stderr += data.toString()
    })

    child.on('close', code => {
      if (code === 0) {
        resolve({ stdout, stderr })
      } else {
        reject(new Error(`${command} failed with exit code ${code}\n${stderr}`))
      }
    })
  })
}

const isDev = argv.includes('--watch') || argv.includes('--dev')

if (isDev) {
  console.warn('Building vite-plugin-react-inspector (watch mode)...')
} else {
  console.warn('Building vite-plugin-react-inspector...')
}

Promise.all([
  // Build ESM
  build({
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    target: 'node',
    format: 'esm',
    minify: !isDev,
    external: ['vite', 'react', 'react-dom'],
    naming: '[dir]/[name].mjs',
    sourcemap: isDev ? 'inline' : false,
    watch: isDev,
  }),
  // Build CJS
  build({
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    target: 'node',
    format: 'cjs',
    minify: !isDev,
    external: ['vite', 'react', 'react-dom'],
    naming: '[dir]/[name].cjs',
    sourcemap: isDev ? 'inline' : false,
    watch: isDev,
  }),
])
  .then(async () => {
    console.warn('✅ Main build completed successfully')

    // Generate TypeScript declarations
    console.warn('Generating TypeScript declarations...')
    try {
      await runCommand('bunx', ['tsc', '--project', '.'])
      console.warn('✅ TypeScript declarations generated successfully')
    } catch (error) {
      console.error('❌ TypeScript declaration generation failed:', error.message)
      throw error
    }

    // Build overlay bundle
    console.warn('Building overlay bundle...')
    await build({
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

    console.warn('✅ Overlay build completed successfully')
    console.warn('✅ All builds completed successfully')
  })
  .catch(error => {
    console.error('❌ Build failed:', error)
    exit(1)
  })
