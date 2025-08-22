## vite-plugin-react-inspect

<p align="center">
  <a href="https://www.npmjs.com/package/vite-plugin-react-inspect" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/v/vite-plugin-react-inspect" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/vite-plugin-react-inspect" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/dt/vite-plugin-react-inspect" alt="NPM Downloads" /></a>
  <a href="https://github.com/MartinBspheroid/vite-plugin-react-inspect/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/github/license/MartinBspheroid/vite-plugin-react-inspect" alt="License" /></a>
</p>

<p align="center">
<a href="https://stackblitz.com/edit/vitejs-vite-rbr2as?file=src%2FApp.tsx"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt=""></a>
</p>

## Introduction

A modern, high-performance Vite plugin that enables instant navigation to your local IDE by clicking any React element in the browser. Built with cutting-edge tooling for maximum developer productivity.

## Modern "Burn the Boats" Architecture

This plugin represents a complete rewrite using modern tooling with **zero legacy dependencies**:

### Performance Revolution
- **20-30x faster** installations (Bun vs pnpm)
- **1.75x faster** builds (Bun vs esbuild/tsup) 
- **Native bundling** - Bun's built-in bundler
- **Pure Vite API** - eliminated unplugin abstraction layer
- **25x faster** linting (Biome vs ESLint)

### Modern Toolchain
- **Package Manager**: Bun (pnpm eliminated)
- **Bundler**: Bun native (tsup eliminated)
- **Linter/Formatter**: Biome (ESLint/Prettier eliminated)
- **Plugin Framework**: Pure Vite API (unplugin eliminated)
- **Dependency Management**: Bun catalogs for version consistency

## Installation

```bash
# Install with Bun (recommended for maximum performance)
bun add vite-plugin-react-inspect -D

# Or with other package managers
npm install vite-plugin-react-inspect -D
pnpm add vite-plugin-react-inspect -D
yarn add vite-plugin-react-inspect -D
```

**Pro Tip**: Use Bun for 20-30x faster installation and development experience!

## Usage

### Vite Configuration

```ts
import React from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import Inspector from 'vite-plugin-react-inspect'

export default defineConfig({
  plugins: [
    Inspector({
      enabled: true,
      toggleComboKey: 'meta-shift', // Default shortcut
    }),
    React(),
  ],
})
```

> **Note**: Place the Inspector plugin **before** React plugin for optimal performance.

### Options

```ts
interface VitePluginInspectorOptions {
  /**
   * Default enable state
   * @default false
   */
  enabled?: boolean

  /**
   * Define a combo key to toggle inspector
   * @default 'control-shift' on windows, 'meta-shift' on other os
   *
   * any number of modifiers `control` `shift` `alt` `meta` followed by zero or one regular key, separated by -
   * examples: control-shift, control-o, control-alt-s  meta-x control-meta
   * Some keys have native behavior (e.g. alt-s opens history menu on firefox).
   * To avoid conflicts or accidentally typing into inputs, modifier only combinations are recommended.
   * You can also disable it by setting `false`.
   */
  toggleComboKey?: string | false

  /**
   * Toggle button visibility
   * @default 'active'
   */
  toggleButtonVisibility?: 'always' | 'active' | 'never'

  /**
   * Toggle button display position
   * @default top-right
   */
  toggleButtonPos?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

  /**
   * append an import to the module id ending with `appendTo` instead of adding a script into body
   * useful for frameworks that do not support transformIndexHtml hook (e.g. Nuxt3)
   *
   * WARNING: only set this if you know exactly what it does.
   */
  appendTo?: string | RegExp

  /**
   * Customize openInEditor host (e.g. http://localhost:3000)
   * @default false
   * @deprecated This option is deprecated and removed in 5.0. The plugin now automatically detects the correct host.
   */
  openInEditorHost?: string | false

  /**
   * lazy load inspector times (ms)
   * @default false
   */
  lazyLoad?: number | false

  /**
   * disable inspector on editor open
   * @default false
   */
  disableInspectorOnEditorOpen?: boolean

  /**
   * Target editor when open in editor
   *
   * @default process.env.LAUNCH_EDITOR ?? 'code' (Visual Studio Code)
   */
  launchEditor?: 'appcode' | 'atom' | 'atom-beta' | 'brackets' | 'clion' | 'code' | 'code-insiders' | 'codium' | 'emacs' | 'idea' | 'notepad++' | 'pycharm' | 'phpstorm' | 'rubymine' | 'sublime' | 'vim' | 'visualstudio' | 'webstorm' | 'rider' | 'cursor' | string

  /**
   * Disable animation/transition, will auto disable when `prefers-reduced-motion` is set
   * @default false
   */
  reduceMotion?: boolean
}
```

## Development with Modern Tooling

This project uses cutting-edge tooling for the best developer experience:

### Bun Development Commands

```bash
# Install dependencies (20-30x faster than npm/pnpm)
bun install

# Development mode
bun run dev

# Build for production
bun run build

# Lint and format with Biome (25x faster than ESLint)
bun run lint

# Auto-format code
bun run format

# Type checking
bun run check
```

### Example

- [React Playground](https://github.com/MartinBspheroid/vite-plugin-react-inspect/tree/main/packages/playground/react)

## Supported editors

| Value | Editor | Linux | Windows | OSX |
|--------|------|:------:|:------:|:------:|
| `appcode` | [AppCode](https://www.jetbrains.com/objc/) |  |  |✓|
| `atom` | [Atom](https://atom.io/) |✓|✓|✓|
| `atom-beta` | [Atom Beta](https://atom.io/beta) |  |  |✓|
| `brackets` | [Brackets](http://brackets.io/) |✓|✓|✓|
| `clion` | [Clion](https://www.jetbrains.com/clion/) |  |✓|✓|
| `code` | [Visual Studio Code](https://code.visualstudio.com/) |✓|✓|✓|
| `code-insiders` | [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/) |✓|✓|✓|
| `codium` | [VSCodium](https://github.com/VSCodium/vscodium) |✓|✓|✓|
| `emacs` | [Emacs](https://www.gnu.org/software/emacs/) |✓| | |
| `idea` | [IDEA](https://www.jetbrains.com/idea/) |✓|✓|✓|
| `notepad++` | [Notepad++](https://notepad-plus-plus.org/download/v7.5.4.html) | |✓| |
| `pycharm` | [PyCharm](https://www.jetbrains.com/pycharm/) |✓|✓|✓|
| `phpstorm` | [PhpStorm](https://www.jetbrains.com/phpstorm/) |✓|✓|✓|
| `rubymine` | [RubyMine](https://www.jetbrains.com/ruby/) |✓|✓|✓|
| `sublime` | [Sublime Text](https://www.sublimetext.com/) |✓|✓|✓|
| `vim` | [Vim](http://www.vim.org/) |✓| | |
| `visualstudio` | [Visual Studio](https://www.visualstudio.com/vs/) | | |✓|
| `webstorm` | [WebStorm](https://www.jetbrains.com/webstorm/) |✓|✓|✓|
| `rider` | [Rider](https://www.jetbrains.com/rider/) |✓|✓|✓|
| `cursor` | [Cursor](https://www.cursor.com/) |✓|✓|✓|

## Configuration IDE / Editor

**We recommend using the `launchEditor` option configuration to specify the IDE** (Please ensure that the editor's environment variables are correctly configured beforehand.)

It uses an **environment variable** named **`LAUNCH_EDITOR`** to specify an IDE application, but if you do not set this variable, it will try to open a common IDE that you have open or installed once it is certified.

For example, if you want it always open VS Code when inspection clicked, set `export LAUNCH_EDITOR=code` in your shell.

### VS Code

- install VS Code command line tools, [see the official docs](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line)
  ![install-vscode-cli](./public/install-vscode-cli.png)

- set env to shell, like `.bashrc` or `.zshrc`

  ```bash
  export LAUNCH_EDITOR=code
  ```

<br />

### VS Code with WSL (Windows)

- add the configuration in the `settings.json`

- restart the VS Code (All Windows should be closed to take effect)

```json
{
  // other config...

  "terminal.integrated.env.linux": {
    "EDITOR": "code"
  }
}
```

### WebStorm

- just set env with an absolute path to shell, like `.bashrc` or `.zshrc` (only MacOS)

  ```bash
  export LAUNCH_EDITOR='/Applications/WebStorm.app/Contents/MacOS/webstorm'
  ```

**OR**

- install WebStorm command line tools

- then set env to shell, like `.bashrc` or `.zshrc`

  ```bash
  export LAUNCH_EDITOR=webstorm
  ```

<br />

### PhpStorm

- just set env with an absolute path to shell, like `.bashrc` or `.zshrc` (only MacOS)

  ```bash
  export LAUNCH_EDITOR='/Applications/PhpStorm.app/Contents/MacOS/phpstorm'
  ```

**OR**

- install PhpStorm command line tools

- then set env to shell, like `.bashrc` or `.zshrc`

  ```bash
  export LAUNCH_EDITOR=phpstorm
  ```

<br />

### Vim

Yes! you can also use vim if you want, just set env to shell

```bash
export LAUNCH_EDITOR=vim
```

<br />

## Important Notes

- **Development Only**: This plugin only works in development mode for security reasons
- **Modern Architecture**: Requires modern tooling (Bun recommended) for best performance
- **Template Engines**: Currently supports JSX/TSX only, not template engines like Pug
- **Breaking Changes**: v2.0+ uses modern Bun ecosystem - see migration guide if upgrading from v1.x

## Programmatic Usage

You can also use control inspector programmatically, by accessing the `__REACT_INSPECTOR__` global variable.

```ts
import type { ReactInspectorClient } from 'vite-plugin-react-inspect'

const inspector: ReactInspectorClient = window.__REACT_INSPECTOR__

if (inspector) {
  // Enable inspector
  inspector.enable()
  
  // Disable inspector
  inspector.disable()
  
  // Toggle inspector state
  inspector.toggleEnabled()
  
  // Check if enabled
  console.log(inspector.enabled) // boolean
}
```

## Migration Benefits

This plugin represents the future of Vite plugin development with measurable performance improvements:

### Performance Benchmarks
- **Installation**: 20-30x faster with Bun vs pnpm/npm
- **Build Times**: 1.75x faster with Bun native bundler vs tsup/esbuild
- **Linting**: 25x faster with Biome vs ESLint/Prettier
- **Bundle Size**: Reduced due to eliminated unplugin abstraction
- **Development Server**: Faster startup with pure Vite API integration

### Code Quality Improvements
- **Zero legacy dependencies**: Eliminated pnpm, tsup, unplugin, ESLint
- **Modern TypeScript**: Strict type safety throughout
- **Unified toolchain**: Single-tool approach reduces complexity
- **Consistent versioning**: Bun catalogs prevent version mismatches

## Credits

This modern rewrite is heavily based on [vite-plugin-vue-inspector](https://github.com/webfansplz/vite-plugin-vue-inspector) by webfansplz, adapted and modernized for React.

Also inspired by:
- [react-dev-inspector](https://github.com/zthxxx/react-dev-inspector) for React-specific implementations
- [vite-plugin-svelte-inspector](https://github.com/sveltejs/vite-plugin-svelte/tree/main/packages/vite-plugin-svelte-inspector) for implementation patterns

## License

[MIT LICENSE](./LICENSE)
