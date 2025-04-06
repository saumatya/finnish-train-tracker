import React, { useEffect, useState } from "react";

const TrainDetail = ({trainId}) => {
  if (trainId === undefined|| trainId === null) {
    return <div></div>;
  }
  const [stations, setStations] = useState([]);
  const [stationNames, setStationNames] = useState([]);
  let trainNumber;// hardcoded train number; remove later// hardcoded train number; remove later
  trainNumber = trainId; // Use the trainId prop passed to the component
  const apiUrl = `https://rata.digitraffic.fi/api/v1/trains/latest/${trainNumber}`; // API URL for the specific train number


  const fetchStationNames = async () => {
    alert(trainId);
    try {
      const response = await fetch("https://rata.digitraffic.fi/api/v1/metadata/stations");
      const data = await response.json();

      const stationMap = {};
      data.forEach(station => {
        let name = station.stationName.replace(/ asema$/, "");
        stationMap[station.stationShortCode] = name;
      });

      setStationNames(stationMap);
    } catch (error) {
      console.error("Error fetching station names:", error);
    }
  };

  const fetchTrainData = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const firstTrain = data[0];

        if (firstTrain.timeTableRows && Array.isArray(firstTrain.timeTableRows)) {
          const stationMap = {};

          firstTrain.timeTableRows
            .filter(row => row.trainStopping) // Only process stopping stations
            .forEach(row => {
              const { stationShortCode, type, actualTime, scheduledTime, commercialTrack } = row;

              if (!stationMap[stationShortCode]) {
                stationMap[stationShortCode] = {
                  stationShortCode,
                  arrival: null,
                  departure: null,
                  track: null
                };
              }

              if (type === "ARRIVAL") {
                stationMap[stationShortCode].arrival = {
                  actualTime,
                  scheduledTime,
                };
              } else if (type === "DEPARTURE") {
                stationMap[stationShortCode].departure = {
                  actualTime,
                  scheduledTime,
                };
              }
              if (commercialTrack) {
                  stationMap[stationShortCode].track = commercialTrack;
                }
            });

          setStations(Object.values(stationMap)); // Convert object to array for rendering
        }
      }
    } catch (error) {
      console.error("Error fetching train data:", error);
    }
  };

  useEffect(() => {

    fetchTrainData();
    fetchStationNames();
  }, []);// call once

  useEffect(() => {
    // alert(1);
    fetchTrainData();
  }, [trainId]);// call as change of train id

  

  const formatTimeToEET = (utcDate) => {
    if (!utcDate) return "—"; // Handle missing data
    const date = new Date(utcDate);
    return date.toLocaleTimeString("en-GB", {
      timeZone: "Europe/Helsinki",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    //   second: "2-digit",
    });
  };

  return (
    <div>
      <h2>Train Schedule (EET) IC {trainNumber}</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Station</th>
            <th>Arrival (Actual)</th>
            <th>Departure (Actual)</th>
            <th>Arrival (Scheduled)</th>
            <th>Departure (Scheduled)</th>
            <th>Track</th>

          </tr>
        </thead>
        <tbody>
          {stations.length > 0 ? (
            stations.map((station, index) => (
              <tr key={index}>
                {/* <td><strong>{station.stationShortCode}</strong></td> */}
                <td><strong>{stationNames[station.stationShortCode] || station.stationShortCode}</strong></td>
                <td>{formatTimeToEET(station.arrival?.actualTime)}</td>                
                <td>{formatTimeToEET(station.departure?.actualTime)}</td>
                <td>{formatTimeToEET(station.arrival?.scheduledTime)}</td>
                <td>{formatTimeToEET(station.departure?.scheduledTime)}</td>
                <td>{station.track || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Loading or no data available...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrainDetail;