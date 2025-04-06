import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLiveArrivalTrains } from "../reducers/trainSlice";
import { fetchStations } from "../reducers/stationSlice";

const TrainArrivals = ({ station }) => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchLiveArrivalTrains(station.stationShortCode));
    dispatch(fetchStations());
  }, [station.stationShortCode, dispatch]);

  const liveArrivalTrains = useSelector(
    (state) => state.trains.liveArrivalTrains
  );
  const stations = useSelector((state) => state.stations.stations);
  useEffect(() => {
    try {
      const parsed = liveArrivalTrains.map((train) => {
        const { trainNumber, trainType, timeTableRows } = train;

        // Final stop is the first item in timeTableRows
        const finalStopRow = timeTableRows[0] || {};
        const originStopCode = finalStopRow.stationShortCode || "N/A";
        let trackNumber = finalStopRow.commercialTrack || "N/A";

        // Find arrival at TPE
        const arrivalRow = timeTableRows.find(
          (row) =>
            row.stationShortCode === station.stationShortCode &&
            row.type === "ARRIVAL"
        );
        const arrivalTime =
          arrivalRow?.actualTime || arrivalRow?.scheduledTime || "N/A";
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
  }, [liveArrivalTrains]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Arrivals to Station {station.stationShortCode}
      </h2>
      <div className="grid gap-4">
        {trains.map((train, index) => {
          const arrivalTime = new Date(train.arrivalTime);
          if (isNaN(arrivalTime)) return null;
          const formattedArrivalTime = arrivalTime.toLocaleTimeString("fi-FI", {
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
                <span className="text-sm text-gray-500">
                  Track {train.trackNumber || "-"}
                </span>
              </div>
              <p className="text-sm text-gray-700">
                <strong>Origin Station:</strong> {train.originStopCode}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Arrival Time:</strong> {formattedArrivalTime}
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">
                {train.trainType.toUpperCase()} {train.trainNumber} coming from{" "}
                {train.originStopCode} on Track {train.trackNumber} at{" "}
                {formattedArrivalTime}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainArrivals;