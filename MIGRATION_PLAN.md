# Migration Plan: Replace tsup/unplugin with Bun for Vite Plugin

## Overview

This document outlines a comprehensive plan to modernize the vite-plugin-react-inspector build system by replacing tsup and unplugin with Bun as the primary bundler and package manager. The goal is to simplify the build process, improve performance, and reduce dependencies while maintaining all existing functionality.

## Current State Analysis

### Current Build Pipeline
- **Package Manager**: pnpm with workspace configuration
- **Bundler**: tsup (esbuild-based) with dual ESM/CJS output
- **Plugin Framework**: unplugin for cross-bundler compatibility
- **Complex Build Process**: 
  - `prebuild` script generates bundled-sources.ts
  - tsup bundles with noExternal for bundled-sources
  - Virtual modules serve Overlay.jsx and dependencies as strings

### Key Dependencies to Remove
- `tsup` - TypeScript bundler
- `unplugin` - Cross-bundler plugin framework
- `pnpm` - Package manager
- Complex prebuild script system

## Migration Strategy

### Phase 1: Package Manager Migration (Low Risk)

Replace pnpm with Bun package manager for faster installs and native TypeScript support.

**Actions:**
1. Remove `pnpm-lock.yaml`
2. Run `bun install` to generate `bun.lockb`
3. Update root and core package.json scripts:

```json
{
  "scripts": {
    "play:react": "bun run --filter=./packages/playground/react dev",
    "dev": "bun run --filter=./packages/core dev",
    "build": "bun run --filter=./packages/{core,unplugin} build",
    "release": "bun run build && changeset && changeset version && changeset publish"
  }
}
```

**Expected Benefits:**
- 20-30x faster package installation
- Native TypeScript/JSX support
- Better monorepo workspace handling
- Simplified dependency management

### Phase 2: Bundler Replacement (Medium Risk)

Replace tsup with Bun's native bundler for better performance and simpler configuration.

**Actions:**

1. **Remove tsup configuration:**
   - Delete `packages/core/tsup.config.ts`
   - Remove tsup from devDependencies

2. **Create Bun build configuration:**

```javascript
// packages/core/build.js
import { $ } from 'bun';

// Build main plugin
await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: 'dist',
  target: 'node',
  format: 'esm',
  minify: true,
  external: ['vite', 'react', 'react-dom'],
  naming: '[dir]/[name].mjs'
});

// Build CJS version for compatibility
await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: 'dist',
  target: 'node', 
  format: 'cjs',
  minify: true,
  external: ['vite', 'react', 'react-dom'],
  naming: '[dir]/[name].cjs'
});

// Generate TypeScript declarations
await $`tsc --emitDeclarationOnly --outDir dist`;

console.log('✅ Build complete');
```

3. **Update package.json:**

```json
{
  "scripts": {
    "prebuild": "bun run build:overlay",
    "build": "bun run build.js",
    "dev": "bun run build:overlay && bun run build.js --watch",
    "build:overlay": "bun build src/Overlay.jsx --outfile src/overlay-bundle.js --format esm --minify --bundle --external react --external react-dom"
  }
}
```

### Phase 3: Simplify Overlay Bundling (High Impact)

Replace the complex string-based bundled-sources system with direct file bundling.

**Current Problem:**
- Overlay.jsx and dependencies are read as strings
- Complex prebuild script generates bundled-sources.ts
- Virtual modules serve these strings at runtime

**New Approach:**

1. **Bundle Overlay.jsx directly:**

```javascript
// Build bundled overlay as single file
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

2. **Update virtual module system:**

```typescript
// src/index.ts - Updated load hook
async load(id) {
  if (id === 'virtual:react-inspector-options') {
    return `export default ${JSON.stringify({ ...normalizedOptions, base: config.base })}`;
  }
  else if (id.startsWith('virtual:react-inspector-path:')) {
    const virtualPath = id.replace('virtual:react-inspector-path:', '');
    
    if (virtualPath === 'load.js') {
      // Serve the bundled overlay directly
      const overlayPath = path.join(__dirname, '../dist/overlay.bundle.js');
      return await fs.promises.readFile(overlayPath, 'utf-8');
    }
  }
}
```

### Phase 4: Remove unplugin (Medium Risk)

Convert to native Vite plugin API, removing cross-bundler abstractions.

**Actions:**

1. **Simplify plugin structure:**

```typescript
// src/index.ts - Native Vite plugin
import type { Plugin } from 'vite';

export function viteReactInspector(options: VitePluginInspectorOptions = {}): Plugin {
  const normalizedOptions = { ...DEFAULT_INSPECTOR_OPTIONS, ...options };
  let config: ResolvedConfig;

  return {
    name: 'vite-plugin-react-inspector',
    enforce: 'pre',
    apply: 'serve', // Only apply in development
    
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    resolveId(id) {
      if (id.startsWith('virtual:react-inspector')) return id;
    },

    load(id) {
      // Virtual module handling
    },

    transform(code, id) {
      // React component transformation
    },

    configureServer(server) {
      // Development server configuration
    },

    transformIndexHtml(html) {
      // HTML injection
    }
  };
}

export default viteReactInspector;
```

2. **Update exports:**

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

3. **Remove unplugin dependency and related code**

## Implementation Timeline

### Week 1: Phase 1 (Package Manager)
- ✅ Low risk, immediate performance benefits
- Migrate to Bun package manager
- Update CI/CD scripts
- Test workspace functionality

### Week 2: Phase 2 (Bundler)
- Replace tsup with Bun build
- Maintain dual ESM/CJS output
- Verify plugin functionality

### Week 3: Phase 3 (Overlay Bundling)
- Implement direct Overlay.jsx bundling
- Update virtual module system
- Test in playground applications

### Week 4: Phase 4 (Remove unplugin)
- Convert to native Vite plugin
- Remove cross-bundler code
- Final testing and documentation

## Expected Outcomes

### Performance Improvements
- **Package Installation**: 20-30x faster with Bun vs pnpm
- **Build Speed**: 1.75x faster bundling vs tsup/esbuild
- **Development**: Faster hot reload and rebuild times
- **Bundle Size**: Potentially smaller without unplugin overhead

### Complexity Reduction
- **Dependencies Removed**: tsup, unplugin, complex prebuild scripts
- **Configuration Simplified**: Single build script vs multiple configs
- **Maintenance**: Fewer tools to maintain and update

### Modern Toolchain Benefits
- **Future-Proof**: Bun is actively developed with 2024-2025 best practices
- **TypeScript-First**: Native TS support without additional transpilation
- **Single Tool**: Bun handles package management, building, and running

## Risk Mitigation

### High-Risk Areas
1. **Virtual Module System**: Critical for plugin functionality
2. **Overlay Bundling**: Must maintain React component functionality
3. **Plugin API Changes**: Ensure backward compatibility

### Mitigation Strategies
1. **Incremental Migration**: Phase-by-phase approach with rollback points
2. **Comprehensive Testing**: Test each phase in playground applications
3. **Backup Plan**: Keep existing build system until new one is verified
4. **Documentation**: Update README and development guides

## Success Criteria

- [ ] Faster development workflow (install + build times)
- [ ] Simplified build configuration (single build script)
- [ ] Reduced dependencies (remove tsup, unplugin)
- [ ] Maintained plugin functionality (all features work)
- [ ] Improved developer experience (fewer tools to learn)
- [ ] Bundle size maintained or reduced
- [ ] TypeScript support maintained or improved

## Rollback Plan

If issues arise during migration:

1. **Phase 1 Rollback**: Restore pnpm-lock.yaml, reinstall with pnpm
2. **Phase 2 Rollback**: Restore tsup.config.ts, update package.json scripts
3. **Phase 3 Rollback**: Restore generate-bundled-sources.js script
4. **Phase 4 Rollback**: Restore unplugin dependency and cross-bundler code

Each phase can be rolled back independently while maintaining a working build system.

---

*This migration plan targets modern 2024-2025 JavaScript tooling practices while maintaining the existing functionality and improving performance.*