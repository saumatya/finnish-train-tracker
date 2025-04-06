import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainLocations } from "../reducers/trainSlice";
import { fetchStations } from "../reducers/stationSlice";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-minimap";
import SearchBox from "./SearchBox";
import StationPopup from "./StationPopup";
import StationDetail from "./StationDetail";
import TrainDetail from "./TrainDetail";
import TrainPopup from "./TrainPopup";
import MapCenter from "./MapCenter";

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
    const miniMapLayer = new L.TileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
    const miniMap = new L.Control.MiniMap(miniMapLayer, {
      toggleDisplay: true,
    }).addTo(map);
    return () => miniMap.remove();
  }, [map]);
  return null;
};

const TrainTracker = () => {
  const dispatch = useDispatch();
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const trainLocations = useSelector((state) => state.trains.trainLocations);
  const stations = useSelector((state) => state.stations.stations);

  useEffect(() => {
    dispatch(fetchTrainLocations());
    dispatch(fetchStations());
    const id = setInterval(() => dispatch(fetchTrainLocations()), 30000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [dispatch]);

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      setCurrentDateTime(date.toLocaleString("fi-FI"));
    };
    updateDateTime(); 
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  const handleTrainDetails = (train) => {
    if (train && train.trainNumber !== undefined) {
      setSelectedTrain(train);
      setIsSidebarOpen(true);
    }
  };

  const handleStationDetails = (station) => {
    if (station && station.stationShortCode !== undefined) {
      setSelectedStation(station);
      setIsSidebarOpen(true);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedTrain(null);
    setSelectedStation(null);
  };

  return (
    <div className="h-screen w-full p-4 bg-gray-100 relative flex flex-col">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Live Train Tracker
        <span className="ml-4 text-sm text-gray-500">{currentDateTime}</span>
      </h1>
      <div className="relative h-full flex-grow">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <SearchBox onStationSelect={setSelectedStation} />
        </div>

        <MapContainer
          center={[63.8391421, 23.1336845]}
          zoom={10}
          className="z-0 relative h-full rounded-xl shadow-lg"
          preferCanvas={true}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
            </LayersControl.BaseLayer>
          </LayersControl>
          <MiniMapControl />
          <MapCenter selectedStation={selectedStation} zoomLevel={12} />

          {trainLocations.map((train) => (
            <Marker
              key={train.trainNumber}
              position={[
                train.location.coordinates[1],
                train.location.coordinates[0],
              ]}
              icon={trainIcon}
            >
              <Popup>
                <TrainPopup
                  train={train}
                  handleTrainDetails={handleTrainDetails}
                />
              </Popup>
            </Marker>
          ))}
          {stations.map((station) => (
            <Marker
              key={station.stationShortCode}
              position={[station.latitude, station.longitude]}
              icon={stationIcon}
            >
              <Tooltip>{station.stationName}</Tooltip>
              <Popup>
                <StationPopup
                  station={station}
                  handleStationDetails={handleStationDetails}
                />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } rounded-l-xl`}
      >
        {selectedTrain && (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-700">
                Train Detail
              </h2>
              <button
                onClick={handleCloseSidebar}
                className="text-2xl text-gray-600 hover:text-gray-900"
              >
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-160px)]">
              <TrainDetail train={selectedTrain} />
            </div>
          </>
        )}
        {selectedStation && (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-700">
                Station Detail
              </h2>
              <button
                onClick={handleCloseSidebar}
                className="text-2xl text-gray-600 hover:text-gray-900"
              >
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-160px)]">
              <StationDetail station={selectedStation} />
            </div>
          </>
        )}
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

export default TrainTracker;