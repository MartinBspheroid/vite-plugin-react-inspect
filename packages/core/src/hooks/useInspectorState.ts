import { useCallback, useState } from 'react'
import inspectorOptions from 'virtual:react-inspector-options'
import { createEmptyLinkParams } from '../utils/editor'
import type { Position } from '../utils/positioning'
import type { LinkParams } from '../utils/editor'

// @ts-expect-error - Virtual module

export interface InspectorState {
  enabled: boolean
  overlayVisible: boolean
  position: Position
  linkParams: LinkParams
}

export interface InspectorActions {
  setEnabled: (enabled: boolean) => void
  setOverlayVisible: (visible: boolean) => void
  setPosition: (position: Position) => void
  setLinkParams: (params: LinkParams) => void
  toggleEnabled: () => void
  enable: () => void
  disable: () => void
  closeOverlay: () => void
  updateLinkParams: (params: { position: Position; linkParams: LinkParams } | null) => void
}

export function useInspectorState(): [InspectorState, InspectorActions] {
  const [state, setState] = useState<InspectorState>({
    enabled: false,
    overlayVisible: false,
    position: { x: 0, y: 0, width: 0, height: 0 },
    linkParams: createEmptyLinkParams(),
  })

  const setEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, enabled }))
  }, [])

  const setOverlayVisible = useCallback((overlayVisible: boolean) => {
    setState(prev => ({ ...prev, overlayVisible }))
  }, [])

  const setPosition = useCallback((position: Position) => {
    setState(prev => ({ ...prev, position }))
  }, [])

  const setLinkParams = useCallback((linkParams: LinkParams) => {
    setState(prev => ({ ...prev, linkParams }))
  }, [])

  const toggleEnabled = useCallback(() => {
    setState(prev => ({
      ...prev,
      enabled: !prev.enabled,
      overlayVisible: false, // Close overlay when toggling
    }))
  }, [])

  const enable = useCallback(() => {
    setState(prev => prev.enabled ? prev : { ...prev, enabled: true })
  }, [])

  const disable = useCallback(() => {
    setState(prev => prev.enabled ? { ...prev, enabled: false } : prev)
  }, [])

  const closeOverlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      overlayVisible: false,
      linkParams: createEmptyLinkParams(),
    }))
  }, [])

  const updateLinkParams = useCallback((update: { position: Position; linkParams: LinkParams } | null) => {
    if (update) {
      setState(prev => ({
        ...prev,
        overlayVisible: true,
        position: update.position,
        linkParams: update.linkParams,
      }))
    }
    else {
      setState(prev => ({
        ...prev,
        overlayVisible: false,
        linkParams: createEmptyLinkParams(),
      }))
    }
  }, [])

  const actions: InspectorActions = {
    setEnabled,
    setOverlayVisible,
    setPosition,
    setLinkParams,
    toggleEnabled,
    enable,
    disable,
    closeOverlay,
    updateLinkParams,
  }

  return [state, actions]
}
