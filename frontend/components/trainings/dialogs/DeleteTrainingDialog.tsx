import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import React, {Dispatch, SetStateAction, useState} from "react";
import {TrainingInterface} from "../../../utils/interfaces/training";
import {getParamsWithGuestCode} from "../../../utils/params";
import {apiClient} from "../../../utils/apiClient";

interface DeleteTrainingDialogProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    getTrainings: () => Promise<void>,
    training: TrainingInterface,
}

const DeleteTrainingDialog = ({open, setOpen, getTrainings, training}: DeleteTrainingDialogProps) => {
    const handleClose = () => {
        setOpen(false);
    }

    const handleDeleteTraining = async () => {
        const params = getParamsWithGuestCode();

        await apiClient.delete('/training/' + training.id, { params });
        setOpen(false);
        await getTrainings();
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete Training</DialogTitle>
            <DialogContent>
                <Typography variant="body1" component="span">
                    Are you sure you want to delete <b>{training.name}</b> ?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDeleteTraining}>Delete Training</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteTrainingDialog;
