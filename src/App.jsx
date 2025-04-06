import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TrainTracker from './components/TrainTracker'
import TrainDetail from './components/TrainDetail'
import TrainArrivals from './components/TrainArrivals'
import TrainDepartures from './components/TrainDepartures'
import StationDetail from './components/StationDetail'
import SearchBox from './components/SearchBox'

function App() {
  return (
    <div className="flex h-screen">
      <SearchBox />
      <TrainTracker />
      <TrainDetail />
      <StationDetail />
      <TrainArrivals/>
      <TrainDepartures/>

    </div>
  )
}

export default App
