import { useState } from 'react'
import Counter from './Counter'
import Hi from './Hi'
import Welcome from './Welcome'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <div className="content">
        <Hi />
        <Welcome />
        <Counter count={count} onIncrement={() => setCount(count + 1)} />
        <p>Vite + React so awesome 🔥 .</p>
        <a href="https://github.com/webfansplz/vite-plugin-vue-inspector">
          Give me a star if it helps you 💗 .
        </a>
      </div>
    </div>
  )
}

export default App
