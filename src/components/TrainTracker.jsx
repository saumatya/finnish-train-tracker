
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainLocations } from "../reducers/trainSlice";
import {  fetchStations } from "../reducers/stationSlice";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap, Tooltip } from "react-leaflet";
import ReactDOMServer from 'react-dom/server';
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@mui/material";
import L from "leaflet";
import "leaflet-minimap";
import SearchBox from "./SearchBox";
import StationPopup from "./StationPopup";
import StationDetail from "./StationDetail";
import TrainDetail from "./TrainDetail";
import TrainPopup from "./TrainPopup";
// Custom Icons
const trainIcon = new L.Icon({
  iconUrl: "/train-marker.png",
  iconSize: [35, 35],
});

const stationIcon = new L.Icon({
  iconUrl: "/station-marker.png",
  iconSize: [35, 35],
});

const MiniMapControl = () => {
  const map = useMap();
  useEffect(() => {
    const miniMapLayer = new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    const miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true }).addTo(map);
    return () => miniMap.remove();
  }, [map]);
  return null;
};

const TrainTracker = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTrainLocations());
    dispatch(fetchStations());
    const id = setInterval(() => dispatch(fetchTrainLocations()), 30000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [dispatch]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const trainLocations= useSelector((state) => state.trains.trainLocations);
  const stations= useSelector((state) => state.stations.stations);
  const [intervalId, setIntervalId] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);


  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      setCurrentDateTime(date.toLocaleString("fi-FI"));
    };

    updateDateTime(); // Initialize with the current date and time
    const interval = setInterval(updateDateTime, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const handleTrainDetails = (train) => {
    if (train && train.trainNumber !== undefined) {
      setSelectedTrain(train);
      setIsSidebarOpen(true);
    } else {
      console.error('Train or train.id is undefined');
    }
  }
  const handleStationDetails = (station) => {
    
    if (station && station.stationShortCode !== undefined) {
      setSelectedStation(station);
      setIsSidebarOpen(true);
    } else {
      console.error('Station or station.stationShortCode is undefined');
    }
  }
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedTrain(null);
  };
  const handleStationSelect = (station) => {
    setSelectedStation(station);
  };

  return (
    <div className="h-screen w-full p-4">
      <h1 className="text-xl font-bold mb-4">Live Train Tracker
        <span className="ml-4 text-sm text-gray-500">{currentDateTime}</span> {/* Display current date and time */}
      </h1>
      {/* Search Box Positioned Over Map */}
      <SearchBox
        onStationSelect={handleStationSelect}
      />
      {/* [60.1699, 24.9384] */}
      <MapContainer center={[63.8391421, 23.1336845]} zoom={10}
        className="z-0 relative h-screen"
        style={{ zIndex: 0 }} preferCanvas={true}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>
        <MiniMapControl />

        {/* Zoom map to selected station if one is selected */}
        <MapCenter selectedStation={selectedStation} />
        {trainLocations.map((train) => (
          <Marker key={train.trainNumber} position={[train.location.coordinates[1], train.location.coordinates[0]]} icon={trainIcon}>
            <Popup>
              <TrainPopup train={train} handleTrainDetails={handleTrainDetails} />
            </Popup>
          </Marker>
        ))}
        {stations.map((station, index) => (
          <Marker
            key={`${station.stationName}-${index}`}  // Makes key unique
            position={[station.latitude, station.longitude]}
            icon={stationIcon}
          >
            {/* <Marker key={station.stationUICCode} position={[station.latitude, station.longitude]} icon={stationIcon}> */}
            <Tooltip>{station.stationName}</Tooltip>
            <Popup>
              <StationPopup station={station} handleStationDetails={handleStationDetails} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>


      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {selectedTrain && (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Train Detail</h2>
              <button onClick={handleCloseSidebar} className="text-2xl">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
              <TrainDetail train={selectedTrain} />
            </div>
          </>)}{selectedStation && (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Station Detail</h2>
              <button onClick={handleCloseSidebar} className="text-2xl">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
              <StationDetail station={selectedStation}/>
            </div>
          </>)}
      </div>

      {/* Optional: Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        />
      )}
    </div>

  );
};
const MapCenter = ({ selectedStation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedStation) {
      map.setView(
        [selectedStation.latitude, selectedStation.longitude],
        10
      );
      const popupContent = ReactDOMServer.renderToStaticMarkup(
        <StationPopup station={selectedStation} />
      );
      const marker = L.marker([selectedStation.latitude, selectedStation.longitude]).addTo(map);
      marker.bindPopup(popupContent).openPopup();

    }
  }, [selectedStation, map]);

  return null;
};
export default TrainTracker;