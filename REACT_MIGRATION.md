# React-Only Inspector Plugin

## Overview

This project has been successfully converted from a dual Vue/React inspector plugin to a **React-only** inspector plugin. All Vue-specific code, dependencies, and examples have been removed.

## What Was Removed

### 1. Vue-Specific Files
- `packages/core/src/Overlay.vue` - Vue overlay component
- `packages/core/src/load.js` - Vue loader
- All Vue playground examples (`packages/playground/vue2`, `packages/playground/vue3`, `packages/playground/nuxt`)

### 2. Vue Dependencies
- `@vue/babel-plugin-jsx`
- `@vue/compiler-dom`
- Vue peer dependencies
- Vue-specific imports and logic

### 3. Framework Configuration
- Removed `framework` option (was `'vue' | 'react'`)
- Removed `vue` version option
- Removed `cleanHtml` option (Vue 3 specific)

### 4. Vue-Specific Logic
- Vue template compilation
- Vue SFC support
- Vue JSX plugin integration
- Vue-specific virtual modules (`virtual:vue-inspector-*`)

## What Remains (React-Only)

### Core Features
- **React JSX/TSX Support**: Full support for `.jsx`, `.tsx`, `.js`, and `.ts` files containing JSX
- **Click-to-Source**: Accurate navigation to React component source files
- **Visual Inspector**: Real-time component highlighting and inspection overlay
- **Keyboard Shortcuts**: Toggle inspector with `Ctrl+Shift` (Windows) / `Cmd+Shift` (Mac)
- **IDE Integration**: Support for VS Code, WebStorm, PhpStorm, Cursor, and 15+ other editors

### Package Structure
```
packages/
├── core/                    # vite-plugin-react-inspector
│   ├── src/
│   │   ├── Overlay.jsx     # React overlay component
│   │   ├── load-react.js   # React loader
│   │   ├── compiler/       # JSX compilation
│   │   └── index.ts        # Main plugin (React-only)
│   └── package.json        # React dependencies only
├── unplugin/               # unplugin-react-inspector
│   └── src/                # Universal plugin wrapper
└── playground/
    └── react/              # React playground example
```

### Usage

```typescript
import react from '@vitejs/plugin-react'
// vite.config.ts
import { defineConfig } from 'vite'
import Inspector from 'vite-plugin-react-inspector'

export default defineConfig({
  plugins: [
    react(),
    Inspector({
      enabled: true // React-only, no framework option needed
    })
  ]
})
```

### Key Changes Made

1. **Package Names**:
   - `vite-plugin-vue-inspector` → `vite-plugin-react-inspector`
   - `unplugin-vue-inspector` → `unplugin-react-inspector`

2. **Global Variables**:
   - `window.__VUE_INSPECTOR__` → `window.__REACT_INSPECTOR__`

3. **Data Attributes**:
   - `data-v-inspector` → `data-react-inspector`

4. **Virtual Modules**:
   - `virtual:vue-inspector-*` → `virtual:react-inspector-*`

5. **Interface Names**:
   - `VueInspectorClient` → `ReactInspectorClient`

## Benefits of React-Only Approach

- **Reduced Bundle Size**: Eliminated all Vue dependencies and logic
- **Simplified Configuration**: No framework selection needed
- **Better Performance**: Removed dual-framework overhead
- **Cleaner Codebase**: Single-purpose, focused implementation
- **Easier Maintenance**: Less complexity, fewer edge cases

## Compatibility

- **React Versions**: Supports React ≥16.8.0 (hooks required)
- **Vite Versions**: Compatible with Vite 3, 4, 5, 6, and 7
- **TypeScript**: Full TypeScript support for `.tsx` files
- **JavaScript**: Full support for `.jsx` files

The plugin is now a streamlined, React-focused developer tool that provides the same powerful click-to-source debugging experience that was previously available for Vue developers.
