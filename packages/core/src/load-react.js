/* eslint-disable new-cap */

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from 'virtual:react-inspector-path:Overlay.jsx'
// @ts-ignore
import inspectorOptions from 'virtual:react-inspector-options'

const CONTAINER_ID = 'react-inspector-container'

function createInspectorContainer() {
  if (document.getElementById(CONTAINER_ID) != null)
    throw new Error('reactInspectorContainer element already exists')

  const el = document.createElement('div')
  el.setAttribute('id', CONTAINER_ID)
  document.getElementsByTagName('body')[0].appendChild(el)
  return el
}

function load() {
  const isClient = typeof window !== 'undefined'
  if (!isClient)
    return
  
  const container = createInspectorContainer()
  const root = ReactDOM.createRoot(container)
  
  root.render(React.createElement(App))
}

if (inspectorOptions.lazyLoad)
  setTimeout(load, inspectorOptions.lazyLoad)
else
  load()