import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { dim } from 'kolorist'
import type { PluginOption, ResolvedConfig } from 'vite'
import { normalizePath } from 'vite'
import { compileSFCTemplate } from './compiler'
import { idToFile, parseRequest } from './utils'

export interface ReactInspectorClient {
  enabled: boolean
  position: {
    x: number
    y: number
  }
  linkParams: {
    file: string
    line: number
    column: number
  }

  enable: () => void
  disable: () => void
  toggleEnabled: () => void
  onEnabled: () => void
  onDisabled: () => void

  openInEditor: (url: URL) => void
  onUpdated: () => void
}

export interface VitePluginInspectorOptions {
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
   * Target editor when open in editor (v5.1.0+)
   *
   * @default process.env.LAUNCH_EDITOR ?? code (Visual Studio Code)
   */
  launchEditor?:
    | 'appcode'
    | 'atom'
    | 'atom-beta'
    | 'brackets'
    | 'clion'
    | 'code'
    | 'code-insiders'
    | 'codium'
    | 'emacs'
    | 'idea'
    | 'notepad++'
    | 'pycharm'
    | 'phpstorm'
    | 'rubymine'
    | 'sublime'
    | 'vim'
    | 'visualstudio'
    | 'webstorm'
    | 'rider'
    | 'cursor'
    | string

  /**
   * Disable animation/transition, will auto disable when `prefers-reduced-motion` is set
   * @default false
   */
  reduceMotion?: boolean
}

const toggleComboKeysMap = {
  control: process.platform === 'darwin' ? 'Control(^)' : 'Ctrl(^)',
  meta: 'Command(⌘)',
  shift: 'Shift(⇧)',
}

function getInspectorPath() {
  const pluginPath = normalizePath(path.dirname(fileURLToPath(import.meta.url)))
  return pluginPath.replace(/\/dist$/, '/src')
}

export function normalizeComboKeyPrint(toggleComboKey: string) {
  return toggleComboKey
    .split('-')
    .map(key => toggleComboKeysMap[key] || key[0].toUpperCase() + key.slice(1))
    .join(dim('+'))
}

export const DEFAULT_INSPECTOR_OPTIONS: VitePluginInspectorOptions = {
  enabled: false,
  toggleComboKey: process.platform === 'darwin' ? 'meta-shift' : 'control-shift',
  toggleButtonVisibility: 'active',
  toggleButtonPos: 'top-right',
  appendTo: '',
  lazyLoad: false,
  launchEditor: process.env.LAUNCH_EDITOR ?? 'code',
  reduceMotion: false,
} as const

function VitePluginInspector(
  options: VitePluginInspectorOptions = DEFAULT_INSPECTOR_OPTIONS
): PluginOption {
  const inspectorPath = getInspectorPath()
  const normalizedOptions = {
    ...DEFAULT_INSPECTOR_OPTIONS,
    ...options,
  }
  let config: ResolvedConfig

  const { appendTo } = normalizedOptions

  if (normalizedOptions.launchEditor) process.env.LAUNCH_EDITOR = normalizedOptions.launchEditor

  return [
    {
      name: 'vite-plugin-react-inspector',
      enforce: 'pre',
      apply(_, { command }) {
        // apply only on serve and not for test
        return command === 'serve' && process.env.NODE_ENV !== 'test'
      },
      async resolveId(importee: string) {
        if (importee.startsWith('virtual:react-inspector-options')) return importee
        if (importee.startsWith('virtual:react-inspector-path:'))
          return importee.replace('virtual:react-inspector-path:', `${inspectorPath}/`)
      },

      async load(id) {
        if (id === 'virtual:react-inspector-options') {
          return `export default ${JSON.stringify({ ...normalizedOptions, base: config.base })}`
        }
        if (id.startsWith(inspectorPath)) {
          const { query } = parseRequest(id)
          if (query.type) return
          // read file ourselves to avoid getting shut out by vites fs.allow check
          let file = idToFile(id)

          // Handle React-specific file routing - use load-react.js
          if (file.endsWith('/load.js')) file = file.replace('/load.js', '/load-react.js')

          if (fs.existsSync(file)) return await fs.promises.readFile(file, 'utf-8')
          throw new Error(`Inspector: File not found: ${file}`)
        }
      },
      async transform(code, id) {
        const { filename } = parseRequest(id)

        const isReactComponent =
          filename.endsWith('.jsx') ||
          filename.endsWith('.tsx') ||
          (filename.endsWith('.js') && code.includes('jsx')) ||
          (filename.endsWith('.ts') && code.includes('jsx'))

        if (isReactComponent) {
          const transformedCode = await compileSFCTemplate({
            code,
            id: filename,
            type: 'jsx',
            framework: 'react',
          })
          return { code: transformedCode as string }
        }

        if (!appendTo) return

        const virtualPath = 'virtual:react-inspector-path:load.js'
        if (
          (typeof appendTo === 'string' && filename.endsWith(appendTo)) ||
          (appendTo instanceof RegExp && appendTo.test(filename))
        ) {
          return { code: `${code}\nimport '${virtualPath}'` }
        }
      },
      configureServer(server) {
        const _printUrls = server.printUrls
        const { toggleComboKey } = normalizedOptions

        if (toggleComboKey) {
          server.printUrls = () => {
            // const keys = normalizeComboKeyPrint(toggleComboKey)
            _printUrls()
            // console.log(`  ${green('➜')}  ${bold('React Inspector')}: ${green(`Press ${yellow(keys)} in App to toggle the Inspector`)}\n`)
          }
        }
      },
      transformIndexHtml(html) {
        if (appendTo) return
        const virtualPath = 'virtual:react-inspector-path:load.js'
        return {
          html,
          tags: [
            {
              tag: 'script',
              injectTo: 'head',
              attrs: {
                type: 'module',
                src: `${config.base || '/'}@id/${virtualPath}`,
              },
            },
          ],
        }
      },
      configResolved(resolvedConfig) {
        config = resolvedConfig
      },
    },
  ]
}
export default VitePluginInspector
