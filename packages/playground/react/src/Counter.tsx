import React, { memo } from 'react'

interface CounterProps {
  count: number
  onIncrement: () => void
}

const Counter: React.FC<CounterProps> = memo(({ count, onIncrement }) => {
  return (
    <div className="counter-component">
      <h3>Counter Example</h3>
      <p>Current count: {count}</p>
      <button onClick={onIncrement}>
        Increment
      </button>
    </div>
  )
})

Counter.displayName = 'Counter'

export default Counter
