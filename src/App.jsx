import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TrainTracker from './components/TrainTracker'
import TrainDetail from './components/TrainDetail'

function App() {
  return (
    <div className="flex h-screen">
      <TrainTracker />
      <TrainDetail />
    </div>
  )
}

export default App
