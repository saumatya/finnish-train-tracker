import { useState } from 'react'
import Sidebar from './components/Sidebar'
import SearchBox from './components/SearchBox'
import TrainTracker from './components/TrainTracker'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTrainId, setSelectedTrainId] = useState(null);

  const handleTrainSelect = (trainId) => {
    setSelectedTrainId(trainId);
    setIsSidebarOpen(true);
  };
  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4">
        <TrainTracker />
      </div>
    </div>
  )
}

export default App