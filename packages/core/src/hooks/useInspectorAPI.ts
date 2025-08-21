import { useCallback, useEffect } from 'react'
import type { InspectorActions, InspectorState } from './useInspectorState'

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

export function useInspectorAPI(
  state: InspectorState,
  actions: InspectorActions,
  openInEditor: (url: URL) => void,
) {
  // Callback stubs for programmatic replacement
  const onEnabled = useCallback(() => {
    // to be replaced programmatically
  }, [])

  const onDisabled = useCallback(() => {
    // to be replaced programmatically
  }, [])

  const onUpdated = useCallback(() => {
    // to be replaced programmatically
  }, [])

  // Setup global API
  useEffect(() => {
    window.__REACT_INSPECTOR__ = {
      enabled: state.enabled,
      position: {
        x: state.position.x,
        y: state.position.y,
      },
      linkParams: {
        file: state.linkParams.file,
        line: state.linkParams.line,
        column: state.linkParams.column,
      },
      enable: actions.enable,
      disable: actions.disable,
      toggleEnabled: actions.toggleEnabled,
      onEnabled,
      onDisabled,
      openInEditor,
      onUpdated,
    }
  }, [
    state.enabled,
    state.position,
    state.linkParams,
    actions.enable,
    actions.disable,
    actions.toggleEnabled,
    onEnabled,
    onDisabled,
    openInEditor,
    onUpdated,
  ])

  // Call lifecycle callbacks
  useEffect(() => {
    if (state.enabled)
      onEnabled()
    else
      onDisabled()
  }, [state.enabled, onEnabled, onDisabled])

  // Return callbacks for external use
  return {
    onEnabled,
    onDisabled,
    onUpdated,
  }
}
