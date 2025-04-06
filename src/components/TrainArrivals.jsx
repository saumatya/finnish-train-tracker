import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLiveArrivalTrains } from "../reducers/trainSlice";
import { fetchStations } from "../reducers/stationSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const TrainArrivals = ({ station }) => {
  const [trains, setTrains] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchLiveArrivalTrains(station.stationShortCode));
    dispatch(fetchStations());
  }, [station.stationShortCode, dispatch]);

  const liveArrivalTrains = useSelector(
    (state) => state.trains.liveArrivalTrains
  );
  const train_status = useSelector((state) => state.trains.status);
  const train_error = useSelector((state) => state.trains.error);
  const stations = useSelector((state) => state.stations.stations);
  useEffect(() => {
    const parsed = liveArrivalTrains.map((train) => {
      const { trainNumber, trainType, timeTableRows } = train;

      // Final stop is the first item in timeTableRows
      const finalStopRow = timeTableRows[0] || {};
      const originStopCode = finalStopRow.stationShortCode || "N/A";

      const originStopName = stations.find(
        (station) => station.stationShortCode === originStopCode
      )?.stationName;
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
        originStopName,
        trackNumber,
        arrivalTime,
      };
    });

    setTrains(parsed);
  }, [liveArrivalTrains]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Arrivals to Station {station.stationName} ({station.stationShortCode})
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
            const arrivalTime = new Date(train.arrivalTime);
            if (isNaN(arrivalTime)) return null;
            const formattedArrivalTime = arrivalTime.toLocaleTimeString(
              "fi-FI",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            );

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
                  <strong>Origin Station:</strong> {train.originStopName} (
                  {train.originStopCode})
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Arrival Time:</strong> {formattedArrivalTime}
                </p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  {train.trainType.toUpperCase()} {train.trainNumber} coming
                  from {train.originStopName} ({train.originStopCode}) on Track{" "}
                  {train.trackNumber} at {formattedArrivalTime}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainArrivals;