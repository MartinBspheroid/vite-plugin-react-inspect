import { useCallback, useEffect } from 'react'
import { getElementRect, getTargetNode } from '../utils/react-fiber'
import { createKeydownHandler } from '../utils/keyboard'
import { createOpenInEditorHandler, createOpenInEditorUrl } from '../utils/editor'
import type { InspectorActions, InspectorState } from './useInspectorState'
import type { InspectorConfig } from './useInspectorConfig'

export function useInspectorEvents(
  state: InspectorState,
  actions: InspectorActions,
  config: InspectorConfig,
) {
  // Create editor handler
  const openInEditor = useCallback(() => {
    return createOpenInEditorHandler(config.base, config.disableInspectorOnEditorOpen, actions.disable)
  }, [config.base, config.disableInspectorOnEditorOpen, actions.disable])()

  // Mouse move handler - show overlay on hover
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { targetNode, params } = getTargetNode(e)

    if (targetNode && params) {
      const position = getElementRect(targetNode)
      actions.updateLinkParams({ position, linkParams: params })
    }
    else {
      actions.closeOverlay()
    }
  }, [actions])

  // Click handler - open in editor
  const handleClick = useCallback((e: MouseEvent) => {
    const { targetNode, params } = getTargetNode(e)

    if (!targetNode || !params)
      return

    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()

    const { file, line, column } = params
    actions.setOverlayVisible(false)
    actions.setEnabled(false)

    const url = createOpenInEditorUrl(config.base, file, line, column)
    openInEditor(url)
  }, [actions, config.base, openInEditor])

  // Keyboard handler - toggle inspector
  const handleKeydown = useCallback(() => {
    return createKeydownHandler(config.toggleCombo, actions.toggleEnabled)
  }, [config.toggleCombo, actions.toggleEnabled])()

  // Window resize handler - close overlay
  const handleResize = useCallback(() => {
    actions.closeOverlay()
  }, [actions])

  // Setup/cleanup event listeners when enabled state changes
  useEffect(() => {
    if (!state.enabled)
      return

    document.body.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('click', handleClick, true)
    window.addEventListener('resize', handleResize)

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('click', handleClick, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [state.enabled, handleMouseMove, handleClick, handleResize])

  // Setup/cleanup keyboard listener
  useEffect(() => {
    if (!config.toggleCombo)
      return

    document.body.addEventListener('keydown', handleKeydown)
    return () => document.body.removeEventListener('keydown', handleKeydown)
  }, [config.toggleCombo, handleKeydown])

  // Return handlers for external use (if needed)
  return {
    openInEditor,
    handleMouseMove,
    handleClick,
    handleKeydown,
    handleResize,
  }
}
