import React, { useEffect, useState } from "react";
import axios from "axios";


const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};


const getStatus = (scheduled, actual, cancelled) => {
  if (cancelled) return <span className="text-red-600 font-semibold">Cancelled</span>;
  if (!actual) return <span className="text-gray-600">Pending</span>;

  const diff = new Date(actual) - new Date(scheduled);
  if (Math.abs(diff) < 60000) return <span className="text-green-600">On time</span>;
  return <span className="text-yellow-600">Delayed</span>;
};

//get station name mappings
const fetchStationNames = async () => {
  try {
    const response = await fetch("https://rata.digitraffic.fi/api/v1/metadata/stations");
    const data = await response.json();

    const stationMap = {};
    data.forEach((station) => {
      const name = station.stationName.replace(/ asema$/, "");
      stationMap[station.stationShortCode] = name;
    });

    return stationMap;
  } catch (error) {
    console.error("Error fetching station names:", error);
    return {};
  }
};

//  Fetch live trains arriving at TPE
const fetchLiveTrains = async () => {
  try {
    //departing and arriving trains fetch together
    const response = await axios.get(
      "https://rata.digitraffic.fi/api/v1/live-trains/station/TPE?arrived_trains=5&arriving_trains=5&departed_trains=5&departing_trains=5&include_nonstopping=false"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching live train data:", error);
    return [];
  }
};

const StationDetail = () => {
  const [trains, setTrains] = useState([]);
  const [stationNames, setStationNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [trainData, stationMap] = await Promise.all([
        fetchLiveTrains(),
        fetchStationNames(),
      ]);
      setTrains(trainData);
      setStationNames(stationMap);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <p>Loading train data...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Train Information - Tampere (TPE)</h1>
      {trains.map((train) => {
        const arrival = train.timeTableRows.find(
          (row) => row.stationShortCode === "TPE" && row.type === "ARRIVAL"
        );
        const origin = train.timeTableRows[0]?.stationShortCode;

        return (
          <div key={train.trainNumber} className="border p-4 mb-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold">
              {train.trainType} {train.trainNumber} ({train.operatorShortCode.toUpperCase()})
            </h2>
            <p><strong>Status:</strong> {arrival && getStatus(arrival.scheduledTime, arrival.actualTime, arrival.cancelled)}</p>
            <p><strong>From:</strong> {stationNames[origin] || origin}</p>
            <p><strong>Scheduled Arrival:</strong> {arrival ? formatTime(arrival.scheduledTime) : "N/A"}</p>
            <p><strong>Actual Arrival:</strong> {arrival?.actualTime ? formatTime(arrival.actualTime) : "N/A"}</p>
            <p><strong>Track:</strong> {arrival?.commercialTrack || "N/A"}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StationDetail;