const KEY_DATA = 'data-react-inspector'
const KEY_IGNORE = 'data-react-inspector-ignore'
const KEY_PROPS_DATA = '__react_inspector'

export { KEY_DATA, KEY_IGNORE, KEY_PROPS_DATA }

// Re-export from positioning utils
export { getElementRect } from './positioning'

interface ReactFiberElement extends Element {
  _reactInternalFiber?: ReactFiberNode
  __reactInternalInstance?: ReactFiberNode
}

interface ReactFiberNode {
  return?: {
    memoizedProps?: Record<string, unknown>
  }
}

export function getComponentData(el: Element): string | null {
  // For React, try to get data from fiber node
  const reactElement = el as ReactFiberElement
  const fiberNode = reactElement._reactInternalFiber ?? reactElement.__reactInternalInstance
  if (fiberNode?.return?.memoizedProps?.[KEY_PROPS_DATA])
    return fiberNode.return.memoizedProps[KEY_PROPS_DATA]

  return null
}

export function getData(el: Element): string | null {
  return (
    (el as ReactFiberElement)?.__reactInternalInstance?.return?.memoizedProps?.[KEY_PROPS_DATA] ??
    getComponentData(el) ??
    el?.getAttribute?.(KEY_DATA)
  )
}

export interface TargetNodeResult {
  targetNode: Element | null
  params: {
    file: string
    line: string
    column: string
    title: string
  } | null
}

interface ExtendedEvent extends Event {
  path?: EventTarget[]
  composedPath?: () => EventTarget[]
}

export function getTargetNode(event: Event): TargetNodeResult {
  const splitRE = /(.+):(\d+):(\d+)$/
  const extendedEvent = event as ExtendedEvent
  const path = extendedEvent.path ?? extendedEvent.composedPath?.()

  if (!path) {
    return {
      targetNode: null,
      params: null,
    }
  }

  const ignoreIndex = path.findIndex((node: Element) => node?.hasAttribute?.(KEY_IGNORE))

  const targetNode = path.slice(ignoreIndex + 1).find((node: Element) => getData(node))

  if (!targetNode) {
    return {
      targetNode: null,
      params: null,
    }
  }

  const match = getData(targetNode)?.match(splitRE)
  const [_, file, line, column] = match || []

  return {
    targetNode,
    params: match
      ? {
          file,
          line,
          column,
          title: file,
        }
      : null,
  }
}
