import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import StationPopup from "./StationPopup"; // Assuming StationPopup is the correct component import

const MapCenter = ({ selectedStation, zoomLevel = 13 }) => {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (selectedStation) {
      // Remove the existing marker if any
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Set map center and zoom level to selected station
      map.setView([selectedStation.latitude, selectedStation.longitude], zoomLevel);

      // Create a new marker for the selected station
      const newMarker = L.marker([
        selectedStation.latitude,
        selectedStation.longitude,
      ]).addTo(map);

      // Create popup content using ReactDOMServer
      const popupContent = ReactDOMServer.renderToStaticMarkup(
        <StationPopup station={selectedStation} />
      );
      
      // Bind popup to the marker and open it
      newMarker.bindPopup(popupContent).openPopup();

      // Store the marker reference for cleanup
      markerRef.current = newMarker;

      // Remove the marker when the popup is closed
      newMarker.on("popupclose", () => {
        map.removeLayer(newMarker);
        markerRef.current = null;
      });
    }
  }, [selectedStation, map, zoomLevel]);

  return null;
};

export default MapCenter;