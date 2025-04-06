
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainLocations, fetchStations } from "../reducers/trainSlice";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap,Tooltip  } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@mui/material";
import L from "leaflet";
import "leaflet-minimap";
import TrainDetail from "./TrainDetail";
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
  const [selectedTrainId, setSelectedTrainId] = useState(null);
  const dispatch = useDispatch();
  const { trains, stations, loading, error } = useSelector((state) => state.trains);
  const [intervalId, setIntervalId] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");

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
    const interval = setInterval(updateDateTime, 1000); 

    return () => clearInterval(interval);
  }, []);

  return ( 
    <div className="h-screen w-full p-4">
      <h1 className="text-xl font-bold mb-4">Live Train Tracker
      <span className="ml-4 text-sm text-gray-500">{currentDateTime}</span> 

      </h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* [60.1699, 24.9384] */}
      <MapContainer center={[63.8391421, 23.1336845]} zoom={9} className="h-4/5 w-full" preferCanvas={true}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>
        <MiniMapControl />
        {trains.map((train) => (
          <Marker key={train.trainNumber} position={[train.location.coordinates[1], train.location.coordinates[0]]} icon={trainIcon}>
            <Popup>
              <Card>
                <CardContent>
                  <p>Train ID: {train.trainNumber}</p>
                  <p>Speed: {train.speed} km/h</p>
                  <p>Destination: {train.departureDate}</p>
                  <button 
                      onClick={() => {
                        setTimeout(() => {
                          if (train && train.trainNumber!== undefined) {
                            setSelectedTrainId(train.trainNumber);
                          } else {
                            console.error('Train or train.id is undefined');
                          }
                        }, 5000); 
                      }}
                      className="text-blue-600 underline mt-2"
                    >
                      View Details
                </button>
                </CardContent>
              </Card>
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
              <Card>
                <CardContent>
                  <p>🏢 <strong>Station:</strong> {station.stationName}</p>
                  <p>📌 <strong>Code:</strong> {station.stationShortCode}</p>
                  <p>🌍 <strong>Country:</strong> {station.countryCode}</p>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>


      <TrainDetail trainId={selectedTrainId} />

    </div>
  );
};

export default TrainTracker;