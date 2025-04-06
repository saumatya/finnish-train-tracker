import React, { useState } from 'react';
import { Button, ButtonGroup, Box, Paper } from '@mui/material';
import TrainArrivals from './TrainArrivals';
import TrainDepartures from './TrainDepartures';

const StationDetail = ({station}) => {
  const [selectedTab, setSelectedTab] = useState('arrivals');

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Paper elevation={3} className="p-4">
      <Box display="flex" justifyContent="center" mb={3}>
        <ButtonGroup variant="outlined">
          <Button
            variant={selectedTab === 'arrivals' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('arrivals')}
          >
            Arrivals
          </Button>
          <Button
            variant={selectedTab === 'departures' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('departures')}
          >
            Departures
          </Button>
        </ButtonGroup>
      </Box>

      <Box>
        {selectedTab === 'arrivals' && <TrainArrivals station={station} />}
        {selectedTab === 'departures' && <TrainDepartures station={station}  />}
      </Box>
    </Paper>
  );
};

export default StationDetail;