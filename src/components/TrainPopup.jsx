import React from 'react';
import { Card, CardContent } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrainDetailsByNumber } from '../reducers/trainSlice';

const TrainPopup = ({ train, handleTrainDetails }) => {
  const dispatch = useDispatch();
    useEffect(() => {
      dispatch(fetchTrainDetailsByNumber(train.trainNumber));
    }, [train.trainNumber, dispatch]);

    const trainDetailsByNumber = useSelector((state) => state.trains.trainDetailsByNumber);
    
  return (
    <Card>
      {trainDetailsByNumber.length > 0 && <CardContent>
        <p>Train: {trainDetailsByNumber[0].trainType} {train.trainNumber}</p>
        <p>Speed: {train.speed} km/h</p>
        <p>Category: {trainDetailsByNumber[0].trainCategory}</p>
        <p>Operator: {trainDetailsByNumber[0].operatorShortCode}</p>
        <button
          onClick={() => handleTrainDetails(train)}
          className="text-blue-600 underline mt-2"
        >
          View Details
        </button>
      </CardContent>}
    </Card>
  );
};

export default TrainPopup;