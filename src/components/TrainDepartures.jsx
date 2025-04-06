import React, { useEffect, useState } from "react";

const stationName="TPE"; // tampere hardcoded remove later
const TrainDepartures = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch(
          `https://rata.digitraffic.fi/api/v1/live-trains/station/${stationName}?departed_trains=5&departing_trains=5&include_nonstopping=false`
        );
        if (!response.ok) throw new Error("Failed to fetch train data");
        const data = await response.json();

        const parsed = data.map((train) => {
          const { trainNumber, trainType, timeTableRows } = train;

          // Last stop is the last item in timeTableRows
          const lastStopRow = timeTableRows[timeTableRows.length - 1] || {};
          const finalStopCode = lastStopRow.stationShortCode || "N/A";

          
          const departureRow = timeTableRows.find(
            (row) =>
              row.stationShortCode === stationName && row.type === "DEPARTURE"
          );
          const departureTime = departureRow?.scheduledTime || "N/A";
          const trackNumber = departureRow?.commercialTrack || "N/A"; // Track number

          return {
            trainNumber,
            trainType,
            finalStopCode,
            departureTime,
            trackNumber, // Added track number
          };
        });

        setTrains(parsed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Departures from Station {stationName}</h2>
      <div className="grid gap-4">
        {trains.map((train, index) => {
          const departureTime = new Date(train.departureTime);
          if (isNaN(departureTime)) return null;
  
          const formattedTime = departureTime.toLocaleTimeString("fi-FI", {
            hour: "2-digit",
            minute: "2-digit",
          });
  
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">
                  🚆 {train.trainType} {train.trainNumber}
                </h3>
                <span className="text-sm text-gray-500">Track {train.trackNumber || "-"}</span>
              </div>
              <p className="text-sm text-gray-700">
                <strong>Destination:</strong> {train.finalStopCode}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Departure Time:</strong> {formattedTime}
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">
                {train.trainType.toUpperCase()} {train.trainNumber} going to{" "}
                {train.finalStopCode} on track {train.trackNumber} at {formattedTime}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
  
};

export default TrainDepartures;