import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { TrainingInterface } from '../../../utils/interfaces/training';
import { useRouter } from 'next/router';

interface StartWorkoutDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  training: TrainingInterface;
}

const StartWorkoutDialog = ({ open, setOpen, training }: StartWorkoutDialogProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();

  const handleStartWorkout = async () => {
    await router.push('/training/' + training.id + '/start');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Start Workout?</DialogTitle>
      <DialogContent>
        <Typography variant="body1" component="span">
          Are you sure you want to start workout - <b>{training.name}</b> ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleStartWorkout}>Start Workout</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StartWorkoutDialog;
