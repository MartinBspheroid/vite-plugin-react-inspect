export function InspectorHighlight({
  sizeIndicatorStyle,
  animation,
}) {
  return (
    <div
      className={`react-inspector-size-indicator ${
        animation ? 'react-inspector-animated' : ''
      }`}
      style={{
        ...sizeIndicatorStyle,
        zIndex: 2147483646,
        position: 'fixed',
        backgroundColor: '#09a7f625',
        border: '1px solid #009dff50',
        borderRadius: '5px',
        pointerEvents: 'none',
        transition: animation ? 'all 0.1s ease-in' : 'none',
      }}
    />
  )
}
