import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainLocations } from "../reducers/trainSlice";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@mui/material";

const TrainTracker = () => {
  const dispatch = useDispatch();
  const { trains, loading, error } = useSelector((state) => state.trains);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    dispatch(fetchTrainLocations());
    const id = setInterval(() => {
      dispatch(fetchTrainLocations());
    }, 30000); // Auto-update every 30 seconds
    setIntervalId(id);

    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div className="h-screen w-full p-4">
      <h1 className="text-xl font-bold mb-4">Live Train Tracker</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <MapContainer center={[60.1699, 24.9384]} zoom={7} className="h-4/5 w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {trains.map((train) => (
          <Marker key={train.id} position={[train.latitude, train.longitude]}>
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
      </MapContainer>
    </div>
  );
};

export default TrainTracker;