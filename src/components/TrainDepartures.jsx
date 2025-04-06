import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLiveDepartureTrains } from "../reducers/trainSlice";
import { fetchStations } from "../reducers/stationSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const TrainDepartures = ({ station }) => {
  const [trains, setTrains] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchLiveDepartureTrains(station.stationShortCode));
    dispatch(fetchStations());
  }, [station.stationShortCode, dispatch]);

  const liveDepartureTrains = useSelector(
    (state) => state.trains.liveDepartureTrains
  );
  const train_status = useSelector((state) => state.trains.status);
  const train_error = useSelector((state) => state.trains.error);
  const stations = useSelector((state) => state.stations.stations);
  useEffect(() => {
    const parsed = liveDepartureTrains.map((train) => {
      const { trainNumber, trainType, timeTableRows } = train;

      // Last stop is the last item in timeTableRows
      const lastStopRow = timeTableRows[timeTableRows.length - 1] || {};
      const finalStopCode = lastStopRow.stationShortCode || "N/A";
      const finalStopName = stations.find(
        (station) => station.stationShortCode === finalStopCode
      )?.stationName;
      const departureRow = timeTableRows.find(
        (row) =>
          row.stationShortCode === station.stationShortCode &&
          row.type === "DEPARTURE"
      );
      const departureTime = departureRow?.scheduledTime || "N/A";
      const trackNumber = departureRow?.commercialTrack || "N/A"; // Track number

      return {
        trainNumber,
        trainType,
        finalStopCode,
        finalStopName,
        departureTime,
        trackNumber, // Added track number
      };
    });

    setTrains(parsed);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Departures from Station {station.stationName} (
        {station.stationShortCode})
      </h2>
      {train_status === "loading" && (
        <div className="flex justify-center my-4">
          <CircularProgress />
        </div>
      )}

      {train_status === "failed" && (
        <Alert severity="error" className="my-4">
          <AlertTitle>Error</AlertTitle>
          {train_error}
        </Alert>
      )}

      {train_status === "succeeded" && (
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
                  <span className="text-sm text-gray-500">
                    Track {train.trackNumber || "-"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Destination:</strong> {train.finalStopCode} (
                  {train.finalStopName})
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Departure Time:</strong> {formattedTime}
                </p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  {train.trainType.toUpperCase()} {train.trainNumber} going to{" "}
                  {train.finalStopCode} ({train.finalStopName}) on track{" "}
                  {train.trackNumber} at {formattedTime}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainDepartures;