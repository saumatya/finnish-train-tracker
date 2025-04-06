import React from "react";
import { Card, CardContent } from "@mui/material";

const StationPopup = ({ station, handleStationDetails }) => {
  return (
    <Card>
      <CardContent>
        <p>
          🏢 <strong>Station:</strong> {station.stationName}
        </p>
        <p>
          📌 <strong>Code:</strong> {station.stationShortCode}
        </p>
        <p>
          🌍 <strong>Country:</strong> {station.countryCode}
        </p>
        <button
          onClick={() => handleStationDetails(station)}
          className="text-blue-600 underline mt-2"
        >
          View Details
        </button>
      </CardContent>
    </Card>
  );
};

export default StationPopup;