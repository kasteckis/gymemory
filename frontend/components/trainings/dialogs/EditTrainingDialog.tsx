import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {apiClient} from "../../../utils/apiClient";
import {getParamsWithGuestCode} from "../../../utils/params";
import {TrainingInterface} from "../../../utils/interfaces/training";

interface CreateTrainingDialogProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    getTrainings: () => Promise<void>,
    training: TrainingInterface,
}

interface EditTrainingFormInterface {
    id: number,
    name: string,
}

const EditTrainingDialog = ({open, setOpen, getTrainings, training}: CreateTrainingDialogProps) => {
    const [form, setForm] = useState<EditTrainingFormInterface>(training);

    const handleClose = () => {
        setOpen(false);
    }

    const handleEditTraining = async () => {
        const params = getParamsWithGuestCode();

        const data = {
            name: form.name,
        }

        await apiClient.put('/training/' + training.id, data, { params });
        setOpen(false);
        await getTrainings();
    }

    const handleFormChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm({
                ...form,
                [event.target.name]: event.target.value,
            });
        },
        [form, setForm],
    );

    useEffect(() => {
        setForm(training);
    }, [training])

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Training</DialogTitle>
            <DialogContent>
                <TextField
                    value={form.name}
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Training Name"
                    fullWidth
                    variant="standard"
                    onChange={handleFormChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleEditTraining}>Update Training</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditTrainingDialog;
