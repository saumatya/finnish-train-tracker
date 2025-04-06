import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import Input from '@mui/joy/Input';
import { fetchStations } from "../reducers/stationSlice";

const SearchBox = ({ onStationSelect }) => {
  const dispatch = useDispatch();
  // const [stations, setStations] = useState([]);
  const stations=useSelector((state) => state.stations.stations);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    dispatch(fetchStations())
  }, [dispatch]);

  useEffect(() => {
    const filtered = stations.filter((station) =>
      station.stationName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStations(filtered);
  }, [searchQuery, stations]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setSearchQuery(station.stationName);
    onStationSelect(station);
  };

  return (
    <div className="p-4">
      {/* Search Box */}
      <Input
        placeholder="Search for a station"
        value={searchQuery}
        onChange={handleSearchChange}
        className="p-2 border border-gray-300 mb-4 w-full"
      />

      {/* Dropdown for Station Names */}
      {searchQuery && (
        <ul className="border border-gray-300 max-h-60 overflow-y-auto p-2">
          {filteredStations.map((station) => (
            <li
              key={station.stationShortCode}
              onClick={() => handleStationSelect(station)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {station.stationName}
            </li>
          ))}
        </ul>
      )}

      {/* Display Selected Station */}
      {selectedStation && (
        <div className="mt-4">
          <p>Selected Station: {selectedStation.stationName}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBox;