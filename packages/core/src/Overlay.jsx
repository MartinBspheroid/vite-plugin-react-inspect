import { useInspectorAPI } from './hooks/useInspectorAPI'
import { useInspectorConfig } from './hooks/useInspectorConfig'
import { useInspectorEvents } from './hooks/useInspectorEvents'
import { useInspectorState } from './hooks/useInspectorState'
import { KEY_IGNORE } from './utils/react-fiber'

function ReactInspectorOverlay() {
  // Consolidated state management
  const [state, actions] = useInspectorState()

  // Configuration and styling
  const config = useInspectorConfig()

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
