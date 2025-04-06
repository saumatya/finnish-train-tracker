import React from 'react';
import { Card, CardContent } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrainByNumber } from '../reducers/trainSlice';

const TrainPopup = ({ train, handleTrainDetails }) => {
  const dispatch = useDispatch();
    useEffect(() => {
      dispatch(fetchTrainByNumber(train.trainNumber));
    }, [train.trainNumber, dispatch]);

    const trainByNumber = useSelector((state) => state.trains.trainByNumber);
    
  return (
    <Card>
      {trainByNumber.length > 0 && <CardContent>
        <p>Train: {trainByNumber[0].trainType} {train.trainNumber}</p>
        <p>Speed: {train.speed} km/h</p>
        <p>Category: {trainByNumber[0].trainCategory}</p>
        <p>Operator: {trainByNumber[0].operatorShortCode}</p>
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