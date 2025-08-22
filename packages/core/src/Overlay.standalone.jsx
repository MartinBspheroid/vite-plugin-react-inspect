import { InspectorButton } from './components/InspectorButton'
import { InspectorHighlight } from './components/InspectorHighlight'
import { InspectorOverlay } from './components/InspectorOverlay'
import { useInspectorAPI } from './hooks/useInspectorAPI'
import { useInspectorEvents } from './hooks/useInspectorEvents'
import { useInspectorState } from './hooks/useInspectorState'
import { calculateFloatPosition, calculateSizeIndicatorStyle } from './utils/positioning'
import { KEY_IGNORE } from './utils/react-fiber'

// Default configuration for standalone bundle that matches useInspectorConfig structure
const DEFAULT_CONFIG = {
  base: '/',
  toggleCombo: ['meta', 'shift'],
  disableInspectorOnEditorOpen: false,
  animation: true,

  containerVisible: enabled => enabled,

  containerPosition: {
    top: '10px',
    right: '10px',
  },

  bannerPosition: {
    top: '50px',
    right: '-130px',
  },

  floatsStyle: (position, floatsElement) => calculateFloatPosition(position, floatsElement),

  sizeIndicatorStyle: position => calculateSizeIndicatorStyle(position),
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
        .react-inspector-animated {
          transition: all 0.1s ease-in;
        }
        @media (prefers-reduced-motion) {
          .react-inspector-animated {
            transition: none !important;
          }
        }
        `}
      </style>
    </div>
  )
}

export default ReactInspectorOverlay
