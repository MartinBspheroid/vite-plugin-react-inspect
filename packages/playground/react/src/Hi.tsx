import type React from 'react'

interface HiProps {
  name?: string
}

const Hi: React.FC<HiProps> = ({ name = 'React Inspector' }) => {
  return (
    <div className="hi-component">
      <h1>
        Hello
        {name}!
      </h1>
      <p>This is a React component that can be inspected.</p>
    </div>
  )
}

export default Hi
