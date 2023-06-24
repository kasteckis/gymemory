import React, { Dispatch, SetStateAction } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { getParamsWithGuestCode } from '../../../utils/params';
import { apiClient } from '../../../utils/apiClient';
import { ExerciseInterface } from '../../../utils/interfaces/exercise';

interface DeleteExerciseDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getExercises: () => Promise<void>;
  exercise: ExerciseInterface;
}

const DeleteExerciseDialog = ({
                                open,
                                setOpen,
                                getExercises,
                                exercise,
                              }: DeleteExerciseDialogProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteExercise = async () => {
    const params = getParamsWithGuestCode();

    await apiClient.delete('/exercise/' + exercise.id, params);
    setOpen(false);
    await getExercises();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Exercise</DialogTitle>
      <DialogContent>
        <Typography variant='body1' component='span'>
          Are you sure you want to delete <b>{exercise.name}</b> ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeleteExercise}>Delete Exercise</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteExerciseDialog;
