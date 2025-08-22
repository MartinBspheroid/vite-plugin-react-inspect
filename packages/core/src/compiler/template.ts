import path from 'node:path'
import process from 'node:process'
import { parse as babelParse, traverse as babelTraverse } from '@babel/core'
import decoratorsPlugin from '@babel/plugin-proposal-decorators'
import importAttributesPlugin from '@babel/plugin-syntax-import-attributes'
import importMeta from '@babel/plugin-syntax-import-meta'
import typescriptPlugin from '@babel/plugin-transform-typescript'
import MagicString from 'magic-string'
import { normalizePath } from 'vite'

const EXCLUDE_TAG = ['script', 'style']
const KEY_DATA_REACT = 'data-react-inspector'

interface CompileSFCTemplateOptions {
  code: string
  id: string
  type: 'jsx'
  framework: 'react'
}
export async function compileSFCTemplate({ code, id }: CompileSFCTemplateOptions) {
  const s = new MagicString(code)
  const relativePath = normalizePath(path.relative(process.cwd(), id))
  const keyData = KEY_DATA_REACT

  const result = await new Promise(resolve => {
    const plugins = [
      importMeta,
      [typescriptPlugin, { isTSX: true, allowExtensions: true }],
      [decoratorsPlugin, { legacy: true }],
      [importAttributesPlugin, { deprecatedAssertSyntax: true }],
    ]

    // React JSX is handled by TypeScript plugin for TSX files

    const ast = babelParse(code, {
      babelrc: false,
      configFile: false,
      comments: true,
      plugins,
    })

    babelTraverse(ast, {
      enter({ node }) {
        if (
          node.type === 'JSXElement' &&
          !EXCLUDE_TAG.includes(
            s.slice(node.openingElement.name.start, node.openingElement.name.end)
          )
        ) {
          if (
            node.openingElement.attributes.some(
              attr => attr.type !== 'JSXSpreadAttribute' && attr.name.name === keyData
            )
          )
            return

          const insertPosition = node.openingElement.end - (node.openingElement.selfClosing ? 2 : 1)
          const { line, column } = node.loc.start

          const content = ` ${keyData}="${relativePath}:${line}:${column}"`

          s.prependLeft(insertPosition, content)
        }
      },
    })

    resolve(s.toString())
  })

  return result
}
