import React, { useState } from 'react';
import TrainDetail from './TrainDetail';  
import TrainArrivals from './TrainArrivals'; 
import TrainDepartures from './TrainDepartures';  
import SearchBox from './SearchBox';
import TrainTracker from './TrainTracker';
import "../styles/mystyles.css";


const Sidebar = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-navigation">
        <button onClick={() => handleComponentChange('trainDetail')}>Train Details</button>
        <button onClick={() => handleComponentChange('trainArrivals')}>Train Arrivals</button>
        <button onClick={() => handleComponentChange('trainDepartures')}>Train Departures</button>
      </div>
      
      <div className="content">
        {selectedComponent === 'trainDetail' && <TrainDetail />}
        {selectedComponent === 'trainArrivals' && <TrainArrivals />}
        {selectedComponent === 'trainDepartures' && <TrainDepartures />}
      </div>
    </div>
  );
};

export default Sidebar;