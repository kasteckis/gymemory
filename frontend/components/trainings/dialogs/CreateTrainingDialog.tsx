import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction, useCallback, useState} from "react";
import {apiClient} from "../../../utils/apiClient";
import {getParamsWithGuestCode} from "../../../utils/params";

interface CreateTrainingDialogProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    getTrainings: () => Promise<void>,
}

interface CreateTrainingFormInterface {
    name: string,
}

const CreateTrainingDialog = ({open, setOpen, getTrainings}: CreateTrainingDialogProps) => {
    const defaultFormValue = {name: ''};
    const [form, setForm] = useState<CreateTrainingFormInterface>(defaultFormValue);

    const handleClose = () => {
        setOpen(false);
    }

    const handleCreateTraining = async () => {
        const params = getParamsWithGuestCode();

        const data = {
            name: form.name,
        }

        await apiClient.post('/training', data, params);
        setOpen(false);
        setForm(defaultFormValue);
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

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Training</DialogTitle>
            <DialogContent>
                <TextField
                    value={form.name}
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
                <Button onClick={handleCreateTraining}>Create Training</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateTrainingDialog;
