import path from 'node:path'
import MagicString from 'magic-string'
import { parse as vueParse, transform as vueTransform } from '@vue/compiler-dom'
import { parse as babelParse, traverse as babelTraverse } from '@babel/core'
import vueJsxPlugin from '@vue/babel-plugin-jsx'
import typescriptPlugin from '@babel/plugin-transform-typescript'
import importMeta from '@babel/plugin-syntax-import-meta'
import decoratorsPlugin from '@babel/plugin-proposal-decorators'
import importAttributesPlugin from '@babel/plugin-syntax-import-attributes'
import { normalizePath } from 'vite'

const EXCLUDE_TAG = ['template', 'script', 'style']
const KEY_DATA_VUE = 'data-v-inspector'
const KEY_DATA_REACT = 'data-react-inspector'

interface CompileSFCTemplateOptions {
  code: string
  id: string
  type: 'template' | 'jsx'
  framework: 'vue' | 'react'
}
export async function compileSFCTemplate(
  { code, id, type, framework }: CompileSFCTemplateOptions,
) {
  const s = new MagicString(code)
  const relativePath = normalizePath(path.relative(process.cwd(), id))
  const keyData = framework === 'react' ? KEY_DATA_REACT : KEY_DATA_VUE
  
  const result = await new Promise((resolve) => {
    switch (type) {
      case 'template': {
        const ast = vueParse(code, { comments: true })
        vueTransform(ast, {
          nodeTransforms: [
            (node) => {
              if (node.type === 1) {
                if ((node.tagType === 0 || node.tagType === 1) && !EXCLUDE_TAG.includes(node.tag)) {
                  if (node.loc.source.includes(keyData))
                    return

                  const insertPosition = node.props.length ? Math.max(...node.props.map(i => i.loc.end.offset)) : node.loc.start.offset + node.tag.length + 1
                  const { line, column } = node.loc.start

                  const content = ` ${keyData}="${relativePath}:${line}:${column}"`

                  s.prependLeft(
                    insertPosition,
                    content,
                  )
                }
              }
            },
          ],
        })

        break
      }

      case 'jsx': {
        const plugins = [
          importMeta,
          [
            typescriptPlugin,
            { isTSX: true, allowExtensions: true },
          ],
          [
            decoratorsPlugin,
            { legacy: true },
          ],
          [
            importAttributesPlugin,
            { deprecatedAssertSyntax: true },
          ],
        ]
        
        // Add framework-specific JSX plugin
        if (framework === 'vue') {
          plugins.splice(1, 0, [vueJsxPlugin, {}])
        }
        // React JSX is handled by TypeScript plugin for TSX files, or by default transform for JSX

        const ast = babelParse(code, {
          babelrc: false,
          configFile: false,
          comments: true,
          plugins,
        })

        babelTraverse(ast, {
          enter({ node }) {
            if (node.type === 'JSXElement' && !EXCLUDE_TAG.includes(s.slice(node.openingElement.name.start, node.openingElement.name.end))) {
              if (node.openingElement.attributes.some(attr => attr.type !== 'JSXSpreadAttribute' && attr.name.name === keyData,
              ))
                return

              const insertPosition = node.openingElement.end - (node.openingElement.selfClosing ? 2 : 1)
              const { line, column } = node.loc.start

              const content = ` ${keyData}="${relativePath}:${line}:${column}"`

              s.prependLeft(
                insertPosition,
                content)
            }
          },
        })
        break
      }

      default:
        break
    }

    resolve(s.toString())
  })

  return result
}
