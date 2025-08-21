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
        <a href="https://github.com/MartinBspheroid/vite-plugin-react-inspect">
          This project is heavily based on the original Vue inspector work 💗 .
        </a>
      </div>
    </div>
  )
}

export default App
