import type { Options } from './types'
import { createUnplugin } from 'unplugin'
import VitePluginInspector from 'vite-plugin-react-inspector'

export default createUnplugin<Options, true>((options) => {
  const plugins = VitePluginInspector(options) as any
  return [
    {
      name: 'unplugin-react-inspector',
      vite: plugins[0],
    },
    {
      name: 'unplugin-react-inspector:post',
      vite: plugins[1],
    },
  ]
})
