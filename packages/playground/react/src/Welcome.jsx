import React from 'react'

const Welcome = () => {
  return (
    <div className="welcome-component">
      <h2>Welcome to React Inspector!</h2>
      <p>Click on any element to jump to its source code.</p>
      <ul>
        <li>Press Ctrl+Shift (or Cmd+Shift on Mac) to toggle inspector</li>
        <li>Hover over elements to see the overlay</li>
        <li>Click to open in your editor</li>
      </ul>
    </div>
  )
}

export default Welcome