import React, { useEffect, useState } from "react";

const stationName="TPE"; // tampere hardcoded remove later
const TrainDepartures = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        //only departures at TPE
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
      <table className="w-full table-auto border border-gray-300">
  <thead>
    <tr className="bg-gray-200 text-left">
      <th className="p-2 border">Train</th>
      <th className="p-2 border">Last Station</th>
      <th className="p-2 border">Departure Time</th>
      <th className="p-2 border">Track Number</th>
      <th className="p-2 border">Information</th>
    </tr>
  </thead>
  <tbody>
    {trains.map((train, index) => {
      const departureTime = new Date(train.departureTime);
     
      if (isNaN(departureTime)) return null; // no departure time for ending train journey
      
      return (
        <tr key={index} className="border-t">
          <td className="p-2 border">{train.trainType} {train.trainNumber}</td>
          <td className="p-2 border">{train.finalStopCode}</td>
          <td className="p-2 border">
            {departureTime.toLocaleTimeString("fi-FI", { hour: '2-digit', minute: '2-digit' })}
          </td>
          <td className="p-2 border">{train.trackNumber}</td>
          <td className="p-2 border">
            {train.trainType.toUpperCase()} {train.trainNumber} going to {train.finalStopCode} on track {train.trackNumber} at {departureTime.toLocaleTimeString("fi-FI", { hour: '2-digit', minute: '2-digit' })}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

    </div>
  );
};

export default TrainDepartures;