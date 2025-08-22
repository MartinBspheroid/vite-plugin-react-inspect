import { useInspectorAPI } from './hooks/useInspectorAPI'
import { useInspectorEvents } from './hooks/useInspectorEvents'
import { useInspectorState } from './hooks/useInspectorState'
import { KEY_IGNORE } from './utils/react-fiber'

// Default configuration for standalone bundle
const DEFAULT_CONFIG = {
  base: '/',
  toggleCombo: ['meta', 'shift'],
  disableInspectorOnEditorOpen: false,
  animation: true,
  reduceMotion: false,
  enabled: false,
  toggleButtonVisibility: 'active',
  toggleButtonPos: 'top-right',
  appendTo: '',
  lazyLoad: false,
  launchEditor: 'code',
  containerVisible: enabled => enabled,
  sizeIndicatorStyle: position => ({
    position: 'fixed',
    left: position.x - 50,
    top: position.y - 10,
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: 999999,
    pointerEvents: 'none',
  }),
}

function ReactInspectorOverlay() {
  // Consolidated state management
  const [state, actions] = useInspectorState()

  // Configuration and styling
  const config = DEFAULT_CONFIG

  // Event handling
  const { openInEditor } = useInspectorEvents(state, actions, config)

  // Global API
  useInspectorAPI(state, actions, openInEditor)

  // Computed styles
  const containerVisible = config.containerVisible(state.enabled)
  const sizeIndicatorStyle = config.sizeIndicatorStyle(state.position)

  return (
    <div {...{ [KEY_IGNORE]: 'true' }}>
      {/* Toggle Button */}
      {containerVisible && (
        <InspectorButton
          enabled={state.enabled}
          position={config.toggleButtonPos}
          onToggle={actions.toggleEnabled}
          visible={config.toggleButtonVisibility}
        />
      )}

      {/* Size Indicator */}
      {state.enabled && (
        <div style={sizeIndicatorStyle}>
          {state.position.x} ×{state.position.y}
        </div>
      )}

      {/* Inspector Overlay */}
      {state.enabled && (
        <InspectorOverlay
          position={state.position}
          onMove={actions.updatePosition}
          onOpenEditor={openInEditor}
          onToggle={actions.toggleEnabled}
        />
      )}

      {/* Element Highlight */}
      {state.enabled && state.position.x > 0 && state.position.y > 0 && (
        <InspectorHighlight position={state.position} />
      )}
    </div>
  )
}

export default ReactInspectorOverlay
