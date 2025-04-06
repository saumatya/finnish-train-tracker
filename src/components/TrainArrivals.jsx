import React, { useEffect, useState } from "react";

const TrainArrivals = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        //only arrivals at TPE
        const response = await fetch(
          "https://rata.digitraffic.fi/api/v1/live-trains/station/TPE?arrived_trains=5&arriving_trains=5&include_nonstopping=false"
        );
        if (!response.ok) throw new Error("Failed to fetch train data");
        const data = await response.json();

        const parsed = data.map((train) => {
          const { trainNumber, trainType, timeTableRows } = train;

          // Final stop is in the first item in timeTableRows
          const finalStopRow = timeTableRows[0] || {};
          const originStopCode = finalStopRow.stationShortCode || "N/A";
          let trackNumber = finalStopRow.commercialTrack || "N/A";

          //  arrivals at TPE
          const arrivalRow = timeTableRows.find(
            (row) =>
              row.stationShortCode === "TPE" && row.type === "ARRIVAL"
          );
          const arrivalTime = arrivalRow?.actualTime || arrivalRow?.scheduledTime || "N/A";
          if (arrivalRow) {
            trackNumber = arrivalRow.commercialTrack || "N/A";
          }
          return {
            trainNumber,
            trainType,
            originStopCode,
            trackNumber,
            arrivalTime,
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
      <h2 className="text-xl font-semibold mb-4">Arrivals to Station TPE</h2>
      
      <table className="w-full table-auto border border-gray-300">
  <thead>
    <tr className="bg-gray-200 text-left">
      <th className="p-2 border">Train</th>
      <th className="p-2 border">Origin Station</th>
      <th className="p-2 border">Track Number</th>
      <th className="p-2 border">Arrival Time</th>
      <th className="p-2 border">Information</th>
    </tr>
  </thead>
  <tbody>
    {trains.map((train, index) => {
      const arrivalTime = new Date(train.arrivalTime);
  
      if (isNaN(arrivalTime)) return null; // no arrivaltime for starting train 
      
      return (
        <tr key={index} className="border-t">
          <td className="p-2 border">{train.trainType} {train.trainNumber}</td>
          <td className="p-2 border">{train.originStopCode}</td>
          <td className="p-2 border">{train.trackNumber}</td>
          <td className="p-2 border">
            {arrivalTime.toLocaleTimeString("fi-FI", { hour: '2-digit', minute: '2-digit' })}
          </td>
          <td className="p-2 border">
            {train.trainType.toUpperCase()} {train.trainNumber} coming from {train.originStopCode} at track {train.trackNumber} at {arrivalTime.toLocaleTimeString("fi-FI", { hour: '2-digit', minute: '2-digit' })}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

    </div>
  );
};

export default TrainArrivals;