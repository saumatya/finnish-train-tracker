import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Autocomplete,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
} from "@mui/material";
import { fetchStations } from "../reducers/stationSlice";

const SearchBox = ({ onStationSelect }) => {
  const dispatch = useDispatch();
  const stations = useSelector((state) => state.stations.stations);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchStations()).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = stations.filter((station) =>
        station.stationName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStations(filtered);
    } else {
      setFilteredStations([]);
    }
  }, [searchQuery, stations]);

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setSearchQuery(station?.stationName);
    onStationSelect(station);
  };

  return (
    <Box
      sx={{
        width: 350,
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <Autocomplete
        freeSolo
        options={filteredStations}
        getOptionLabel={(option) => option.stationName}
        value={selectedStation || null}
        onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)}
        onChange={(event, newValue) => handleStationSelect(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={searchQuery ? "" : "Search for a station"}
            variant="outlined"
            fullWidth
            size="medium"
            InputLabelProps={{ shrink: false }}
            InputProps={{
              ...params.InputProps,
              sx: {
                borderRadius: 4, 
                "& fieldset": {
                  borderRadius: 4,
                },
              },
            }}
          />
        )}
        renderOption={(props, option, index) => (
          <ListItem key={index} {...props} button>
            <ListItemText primary={option.stationName} />
          </ListItem>
        )}
        loading={loading}
        noOptionsText="No stations found"
        isOptionEqualToValue={(option, value) =>
          option.stationShortCode === value.stationShortCode
        }
      />

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Hide the selected station text after selection to keep searchbox clean */}
      {selectedStation && false && (
        <Box sx={{ mt: 2 }}>
          <p>
            <strong>Selected Station:</strong> {selectedStation.stationName}
          </p>
        </Box>
      )}
    </Box>
  );
};

export default SearchBox;