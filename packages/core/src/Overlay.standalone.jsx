import { useInspectorAPI } from './hooks/useInspectorAPI'
import { useInspectorEvents } from './hooks/useInspectorEvents'
import { useInspectorState } from './hooks/useInspectorState'
import { InspectorButton } from './components/InspectorButton'
import { InspectorHighlight } from './components/InspectorHighlight'
import { InspectorOverlay } from './components/InspectorOverlay'
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
  containerPosition: {
    top: '10px',
    right: '10px'
  },
  bannerPosition: {
    top: '50px',
    right: '-130px'
  },
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
          containerPosition={config.containerPosition}
          bannerPosition={config.bannerPosition}
        />
      )}

      {/* Overlay and Highlight */}
      {state.overlayVisible && state.linkParams && (
        <>
          <InspectorOverlay
            linkParams={state.linkParams}
            position={state.position}
            animation={config.animation}
          />
          <InspectorHighlight
            sizeIndicatorStyle={sizeIndicatorStyle}
            animation={config.animation}
          />
        </>
      )}

      {/* Global Styles */}
      <style>
        {`
        .react-inspector-container:hover .react-inspector-banner {
          display: block !important;
        }
        .react-inspector-container--disabled:hover .react-inspector-banner {
          display: none !important;
        }
        `}
      </style>
    </div>
  )
}

export default ReactInspectorOverlay
