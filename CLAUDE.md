# Bun-Powered Vite Plugin Development Guide

This project represents a complete migration from legacy tooling (pnpm, tsup, unplugin) to a modern, high-performance Bun ecosystem. This document outlines best practices, architectural decisions, and development workflows for building Vite plugins with Bun.

## Architecture Overview

### 🔥 Complete Toolchain Migration
- **Package Manager**: Bun (pnpm eliminated)
- **Bundler**: Bun build (tsup eliminated) 
- **Plugin Framework**: Pure Vite native API (unplugin eliminated)
- **Overlay System**: Modern Bun bundling (string-based hacks eliminated)

### Philosophy: "Burn the Boats"
- **No backwards compatibility** with legacy tooling
- **Single toolchain focus** - Bun + Vite only
- **Performance-first** approach with no compromises
- **Modern development** practices throughout

## Development Workflow

### Package Management with Bun

```bash
# Installation (20-30x faster than pnpm)
bun install

# Development
bun run dev

# Building
bun run build

# Playground testing  
bun run play:react
```

**Best Practices:**
- Use `bun install` exclusively - no npm/pnpm/yarn fallbacks
- Leverage Bun's native TypeScript support
- Utilize workspace features for monorepo development
- Take advantage of Bun's superior dependency resolution

### Build System with Bun

The project uses Bun's native bundler instead of tsup for superior performance:

```javascript
// packages/core/build.js
await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: 'dist',
  target: 'node',
  format: 'esm',
  minify: true,
  external: ['vite', 'react', 'react-dom'],
  naming: '[dir]/[name].mjs'
});
```

**Key Benefits:**
- **1.75x faster** than tsup/esbuild
- **Native TypeScript/JSX** support without transpilation
- **Built-in tree shaking** and optimization
- **Single tool** for all bundling needs

### Modern Overlay Bundling

**OLD APPROACH (Eliminated):**
```javascript
// ❌ DELETED: String-based bundling madness
const bundledSources = {
  'Overlay.jsx': readFileSync('src/Overlay.jsx', 'utf-8'),
  // More string hacks...
};
```

**NEW APPROACH (Pure Bun):**
```javascript
// ✅ Modern Bun bundling
await Bun.build({
  entrypoints: ['src/Overlay.jsx'],
  outfile: 'dist/overlay.bundle.js',
  format: 'esm',
  minify: true,
  bundle: true,
  external: ['react', 'react-dom'],
  jsx: 'automatic'
});
```

### Pure Vite Plugin API

**OLD APPROACH (Eliminated):**
```javascript
// ❌ DELETED: Cross-bundler bloat with unplugin
import { createUnplugin } from 'unplugin';
```

**NEW APPROACH (Pure Vite):**
```typescript
// ✅ Pure Vite native API
import type { Plugin } from 'vite';

export function viteReactInspector(options = {}): Plugin {
  return {
    name: 'vite-plugin-react-inspector',
    enforce: 'pre',
    apply: 'serve',
    configResolved(config) { /* ... */ },
    transform(code, id) { /* ... */ },
    // Pure Vite hooks only
  };
}
```

## Best Practices

### 1. Bun-First Development

**DO:**
- Use `bun` for all package management operations
- Leverage Bun's native TypeScript execution
- Utilize Bun's built-in test runner
- Take advantage of Bun's superior performance

**DON'T:**
- Fall back to npm/pnpm/yarn
- Use external transpilation tools
- Compromise performance for compatibility

### 2. Pure Vite Plugin Design

**DO:**
- Use native Vite Plugin interface
- Leverage Vite-specific features and hooks
- Optimize for Vite's architecture
- Focus on development experience

**DON'T:**
- Use cross-bundler abstractions
- Compromise for other bundlers
- Add unnecessary complexity

### 3. Modern Bundling Practices

**DO:**
- Bundle components as proper modules
- Use Bun's native bundling capabilities
- Optimize for tree shaking
- Minimize bundle sizes

**DON'T:**
- Use string-based bundling hacks
- Rely on complex generation scripts
- Create unnecessary build complexity

### 4. TypeScript Excellence

**DO:**
- Use strict TypeScript configuration
- Leverage Bun's native TS support
- Maintain excellent type safety
- Use modern TS features

**DON'T:**
- Use `any` types
- Compromise type safety
- Rely on loose configurations

## Project Structure

```
packages/core/
├── src/
│   ├── index.ts              # Pure Vite plugin entry
│   ├── Overlay.jsx           # React overlay component
│   ├── components/           # Overlay components
│   ├── hooks/               # React hooks
│   └── utils/               # Utilities
├── build.js                 # Bun build script
├── build-overlay.js         # Overlay bundling
├── package.json             # Bun-only scripts
└── dist/                    # Build output
    ├── index.mjs            # ESM build
    ├── index.cjs            # CJS build
    ├── index.d.ts           # TypeScript declarations
    └── overlay.bundle.js    # Bundled overlay
```

## Development Commands

### Core Development
```bash
# Start development with watch mode
bun run dev

# Build for production
bun run build

# Lint and format
bun run lint

# Test in playground
bun run play:react
```

### Advanced Workflows
```bash
# Build only the overlay
bun run build:overlay

# Watch overlay changes
bun run dev:overlay

# Performance benchmarking
bun run benchmark

# Bundle analysis
bun run analyze
```

## Performance Optimizations

### 1. Bun Package Management
- **Installation**: 20-30x faster than pnpm
- **Resolution**: Superior dependency handling
- **Caching**: Intelligent package caching

### 2. Bun Bundling
- **Speed**: 1.75x faster than esbuild
- **Size**: Optimized bundle outputs
- **Quality**: Better tree shaking

### 3. Pure Vite Integration
- **Startup**: Faster development server
- **HMR**: Optimized hot reload
- **Build**: Streamlined production builds

## Migration Benefits

### Performance Gains
- **Package installs**: 20-30x faster
- **Build times**: Significantly improved
- **Development startup**: Near-instantaneous
- **Hot reload**: Optimized performance

### Code Quality
- **Dependencies reduced**: Multiple legacy tools eliminated
- **Complexity reduced**: Unified toolchain approach
- **Maintainability**: Single-tool focus
- **Modern practices**: Latest ecosystem standards

### Developer Experience
- **Simplified workflow**: One tool for everything
- **Better debugging**: Native TypeScript support
- **Faster feedback**: Improved development cycle
- **Future-proof**: Modern toolchain alignment

## Testing Strategy

### Unit Testing with Bun
```bash
# Run tests with Bun's built-in runner
bun test

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

### Integration Testing
- Test plugin in real Vite projects
- Validate overlay functionality
- Ensure TypeScript integration
- Verify performance benchmarks

## Deployment Considerations

### NPM Publishing
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

### Bundle Optimization
- Minimize external dependencies
- Optimize for tree shaking
- Ensure proper externals
- Validate bundle sizes

## Troubleshooting

### Common Issues
1. **Bun not found**: Ensure Bun is properly installed
2. **Build failures**: Check Bun build configuration
3. **TypeScript errors**: Verify tsconfig.json settings
4. **Plugin issues**: Ensure pure Vite API usage

### Performance Debugging
- Use Bun's built-in profiling
- Analyze bundle outputs
- Monitor development server performance
- Benchmark against legacy tooling

## Future Roadmap

### Short Term
- Complete migration validation
- Performance optimization
- Documentation updates
- Community feedback integration

### Long Term
- Bun ecosystem expansion
- Advanced Vite integrations
- Performance monitoring
- Ecosystem contributions

## Contributing

When contributing to this Bun-powered project:

1. **Use Bun exclusively** for all operations
2. **Follow pure Vite patterns** - no cross-bundler code
3. **Maintain performance focus** - benchmark all changes
4. **Write modern TypeScript** - leverage latest features
5. **Test thoroughly** - ensure no regressions

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [Vite Plugin API](https://vite.dev/guide/api-plugin)
- [TypeScript Best Practices](https://typescript-eslint.io/docs/)
- [Modern JavaScript Patterns](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)

---

*This project represents the future of Vite plugin development - fast, modern, and uncompromising. Welcome to the Bun era!* 🚀