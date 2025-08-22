import { useEffect, useRef, useState } from 'react'
import { calculateFloatPosition } from '../utils/positioning'

export function InspectorOverlay({ linkParams, position, animation }) {
  const floatsRef = useRef(null)
  const [floatsStyle, setFloatsStyle] = useState({ left: '0px', top: '0px' })

  // Calculate position dynamically when position or ref changes
  useEffect(() => {
    if (position && floatsRef.current) {
      const style = calculateFloatPosition(position, floatsRef.current)
      setFloatsStyle(style)
    }
  }, [position])

  if (!linkParams || !linkParams.file) return null

  return (
    <div
      ref={floatsRef}
      className={`react-inspector-floats ${animation ? 'react-inspector-animated' : ''}`}
      style={{
        ...floatsStyle,
        zIndex: 2147483647,
        position: 'fixed',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        fontFamily: 'Arial, Helvetica, sans-serif',
        padding: '5px 8px',
        borderRadius: '4px',
        textAlign: 'left',
        color: '#e9e9e9',
        fontSize: '14px',
        backgroundColor: '#429bb8ff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div>
        {linkParams.title}:{linkParams.line}:{linkParams.column}
      </div>
    </div>
  )
}
