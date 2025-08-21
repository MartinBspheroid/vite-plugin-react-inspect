const KEY_DATA = 'data-react-inspector'
const KEY_IGNORE = 'data-react-inspector-ignore'
const KEY_PROPS_DATA = '__react_inspector'

export { KEY_DATA, KEY_IGNORE, KEY_PROPS_DATA }

export function getComponentData(el: Element): string | null {
  // For React, try to get data from fiber node
  const fiberNode = (el as any)?._reactInternalFiber ?? (el as any)?.__reactInternalInstance
  if (fiberNode?.return?.memoizedProps?.[KEY_PROPS_DATA])
    return fiberNode.return.memoizedProps[KEY_PROPS_DATA]

  return null
}

export function getData(el: Element): string | null {
  return (
    (el as any)?.__reactInternalInstance?.memoizedProps?.[KEY_PROPS_DATA]
    ?? getComponentData(el)
    ?? el?.getAttribute?.(KEY_DATA)
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

export function getTargetNode(event: Event): TargetNodeResult {
  const splitRE = /(.+):([\d]+):([\d]+)$/
  const path = (event as any).path ?? (event as any).composedPath()

  if (!path) {
    return {
      targetNode: null,
      params: null,
    }
  }

  const ignoreIndex = path.findIndex((node: Element) =>
    node?.hasAttribute?.(KEY_IGNORE),
  )

  const targetNode = path
    .slice(ignoreIndex + 1)
    .find((node: Element) => getData(node))

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
