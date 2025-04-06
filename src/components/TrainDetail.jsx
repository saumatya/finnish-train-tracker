import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTrainDetailsByNumber } from "../reducers/trainSlice";
import { fetchStations } from "../reducers/stationSlice";

const TrainDetail = ({ train }) => {
  const dispatch = useDispatch();
  const [trainStations, setTrainStations] = useState([]);
  const [stationNames, setStationNames] = useState([]);
  const trainNumber = train?.trainNumber;
  if (trainNumber === undefined || trainNumber === null) {
    return <div></div>;
  }
  useEffect(() => {
    dispatch(fetchStations());
    dispatch(fetchTrainDetailsByNumber(trainNumber));
  }, [trainNumber, dispatch]);

  const trainDetailsByNumber = useSelector((state) => state.trains.trainDetailsByNumber);
  const stations = useSelector((state) => state.stations.stations);
  useEffect(() => {
    const stationMap = {};
    stations.forEach((station) => {
      stationMap[station.stationShortCode] = station;
    });
    setStationNames(stationMap);
  }, [stations]);

  useEffect(() => {
    if (Array.isArray(trainDetailsByNumber) && trainDetailsByNumber.length > 0) {
      const firstTrain = trainDetailsByNumber[0];

      if (firstTrain.timeTableRows && Array.isArray(firstTrain.timeTableRows)) {
        const stationMap = {};
        firstTrain.timeTableRows
          .filter((row) => row.trainStopping)
          .forEach((row) => {
            const {
              stationShortCode,
              type,
              actualTime,
              scheduledTime,
              commercialTrack,
            } = row;

            if (!stationMap[stationShortCode]) {
              stationMap[stationShortCode] = {
                stationShortCode,
                arrival: null,
                departure: null,
                track: null
              };
            }

            if (type === "ARRIVAL") {
              stationMap[stationShortCode].arrival = { actualTime, scheduledTime };
            } else if (type === "DEPARTURE") {
              stationMap[stationShortCode].departure = { actualTime, scheduledTime };
            }

            if (commercialTrack) {
              stationMap[stationShortCode].track = commercialTrack;
            }
            stationMap[stationShortCode].trainNumber = firstTrain.trainNumber
            stationMap[stationShortCode].trainType = firstTrain.trainType
            stationMap[stationShortCode].operatorShortCode = firstTrain.operatorShortCode
            stationMap[stationShortCode].trainCategory = firstTrain.trainCategory
          });

        setTrainStations(Object.values(stationMap));
      }
    }
  }, [trainDetailsByNumber]);



  const formatTimeToEET = (utcDate) => {
    if (!utcDate) return "—"; // Handle missing data
    const date = new Date(utcDate);
    return date.toLocaleTimeString("en-FI", {
      timeZone: "Europe/Helsinki",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      //   second: "2-digit",
    });
  };


  return (
    <div className="p-4">
      {trainStations.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">Train Schedule (EET) {trainStations[0].trainType} {trainNumber}</h2>
          <div className="space-y-4">
            {trainStations.map((station, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row justify-between items-start bg-gray-100 p-4 rounded-lg shadow-md "
              >
                <div className="mb-2 md:mb-0">
                  <h3 className="text-lg font-semibold">
                    {stationNames[station.stationShortCode]?.stationName || station.stationShortCode}
                  </h3>
                  <div>
                    {station.arrival?.scheduledTime && station.departure?.scheduledTime
                      ? `${formatTimeToEET(station.arrival.scheduledTime)} - ${formatTimeToEET(station.departure.scheduledTime)}`
                      : station.arrival?.scheduledTime
                        ? formatTimeToEET(station.arrival.scheduledTime)
                        : station.departure?.scheduledTime
                          ? formatTimeToEET(station.departure.scheduledTime)
                          : "-"}
                  </div>
                </div>
                <div >
                  <div>
                    <strong>Track</strong>: {station.track ? station.track.replace(/^0+/, '') : "-"}
                  </div>
                </div>
              </div>
            ))}
          </div></>
      ) : (
        <div className="p-4 bg-gray-200 rounded-lg shadow-md">Loading or no data available...</div>
      )}
    </div>
  );
};

export default TrainDetail;