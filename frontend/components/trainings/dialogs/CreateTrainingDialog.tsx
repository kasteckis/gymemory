import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { apiClient } from '../../../utils/apiClient';
import { getParamsWithGuestCode } from '../../../utils/params';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface CreateTrainingDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getTrainings: () => Promise<void>;
}

interface CreateTrainingFormInterface {
  name: string;
}

const CreateTrainingDialog = ({ open, setOpen, getTrainings }: CreateTrainingDialogProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateTraining = async (values: CreateTrainingFormInterface) => {
    const params = getParamsWithGuestCode();

    await apiClient.post('/training', values, params);
    setOpen(false);
    await getTrainings();
  };

  const validationSchema = yup.object({
    name: yup.string().required('Training name is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      handleCreateTraining(values);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Create Training</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="standard"
            id="name"
            name="name"
            label="Training Name"
            type="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type={'submit'}>Create Training</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTrainingDialog;
