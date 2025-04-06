import React, { useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainDetailsByNumber } from "../reducers/trainSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const TrainPopup = ({ train, handleTrainDetails }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchTrainDetailsByNumber(train.trainNumber));
  }, [train.trainNumber, dispatch]);

  const trainDetailsByNumber = useSelector(
    (state) => state.trains.trainDetailsByNumber
  );
  const train_status = useSelector((state) => state.trains.status);
  const train_error = useSelector((state) => state.trains.error); // Corrected: it should be 'error', not 'status'

  return (
    <Card className="w-full" sx={{ minWidth: 200 }}>
      {/* Loading State */}
      {train_status === "loading" && (
        <div className="flex justify-center my-4">
          <CircularProgress />
        </div>
      )}

      {/* Error State */}
      {train_status === "failed" && (
        <Alert severity="error" className="my-4">
          <AlertTitle>Error</AlertTitle>
          {train_error}
        </Alert>
      )}

      {/* Success State */}
      {train_status === "succeeded" && trainDetailsByNumber.length > 0 && (
        <CardContent>
          <p>
            🚂 <strong>Train:</strong> {trainDetailsByNumber[0].trainType} {train.trainNumber}
          </p>
          <p>
            ⚡ <strong>Speed:</strong> {train.speed} km/h
          </p>
          <p>
            📅 <strong>Category:</strong> {trainDetailsByNumber[0].trainCategory}
          </p>
          <p>
            🏢 <strong>Operator:</strong> {trainDetailsByNumber[0].operatorShortCode}
          </p>
          <button
            onClick={() => handleTrainDetails(train)}
            className="text-blue-600 underline mt-2"
          >
            View Details
          </button>
        </CardContent>
      )}
    </Card>
  );
};

export default TrainPopup;