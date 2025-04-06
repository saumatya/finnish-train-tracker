import React, { useEffect, useState } from "react";

const SearchBox = () => {
  const [stations, setStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null); 
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("https://rata.digitraffic.fi/api/v1/metadata/stations"); 
        if (!response.ok) throw new Error("Failed to fetch stations");
        const data = await response.json();
        setStations(data); 
        setFilteredStations(data); 
      } catch (err) {
        console.error("Error fetching stations:", err.message);
      }
    };

    fetchStations();
  }, []);

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
    setSelectedStation(station.stationShortCode); 
    setSearchQuery(station.stationName); 
  };

  const getStationDetails = async (stationShortCode) => {
    try {
      const response = await fetch(
        `https://rata.digitraffic.fi/api/v1/metadata/stations/${stationShortCode}` 
      );
      if (!response.ok) throw new Error("Failed to fetch station details");
      const data = await response.json();
      console.log("Station Details:", data); 
    } catch (err) {
      console.error("Error fetching station details:", err.message);
    }
  };

  useEffect(() => {
    if (selectedStation) {
      getStationDetails(selectedStation); 
    }
  }, [selectedStation]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Train Search</h2>

      {/* Search Box */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for a station or train"
        className="p-2 border border-gray-300 mb-4 w-full"
      />

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

      {selectedStation && (
        <div className="mt-4">
          <p>Selected Station ShortCode: {selectedStation}</p> 
        </div>
      )}
    </div>
  );
};

export default SearchBox;