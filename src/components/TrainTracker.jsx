import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainLocations, fetchStations } from "../reducers/trainSlice";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@mui/material";
import L from "leaflet";
import "leaflet-minimap";

// Custom Icons
const trainIcon = new L.Icon({
  iconUrl: "/train-marker.png",
  iconSize: [25, 25],
});

const stationIcon = new L.Icon({
  iconUrl: "/station-marker.png",
  iconSize: [20, 20],
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
  const { trains, stations, loading, error } = useSelector((state) => state.trains);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    dispatch(fetchTrainLocations());
    dispatch(fetchStations());
    const id = setInterval(() => dispatch(fetchTrainLocations()), 30000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div className="h-screen w-full p-4">
      <h1 className="text-xl font-bold mb-4">Live Train Tracker</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <MapContainer center={[60.1699, 24.9384]} zoom={7} className="h-4/5 w-full" preferCanvas={true}>
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
          <Marker key={train.id} position={[train.latitude, train.longitude]} icon={trainIcon}>
            <Popup>
              <Card>
                <CardContent>
                  <p>Train ID: {train.id}</p>
                  <p>Speed: {train.speed} km/h</p>
                  <p>Destination: {train.destination}</p>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}
        {stations.map((station) => (
          <Marker key={station.stationUICCode} position={[station.latitude, station.longitude]} icon={stationIcon}>
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
    </div>
  );
};

export default TrainTracker;