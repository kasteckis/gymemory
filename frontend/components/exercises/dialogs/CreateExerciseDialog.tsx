import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction, useCallback, useState} from "react";
import {apiClient} from "../../../utils/apiClient";
import {getParamsWithGuestCode} from "../../../utils/params";

interface CreateExerciseDialogProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    getExercises: () => Promise<void>,
    trainingId: string,
}

interface CreateExerciseFormInterface {
    name: string,
    count: string,
}

const CreateExerciseDialog = ({open, setOpen, getExercises, trainingId}: CreateExerciseDialogProps) => {
    const defaultFormValue = {name: '', count: ''};
    const [form, setForm] = useState<CreateExerciseFormInterface>(defaultFormValue);

    const handleClose = () => {
        setOpen(false);
    }

    const handleCreateExercise = async () => {
        const params = getParamsWithGuestCode();

        const data = {
            name: form.name,
            count: form.count,
            training_id: trainingId,
        }

        await apiClient.post('/exercise', data, { params });
        setOpen(false);
        setForm(defaultFormValue);
        await getExercises();
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
            <DialogTitle>Create Exercise</DialogTitle>
            <DialogContent>
                <TextField
                    value={form.name}
                    margin="dense"
                    name="name"
                    label="Exercise Name"
                    fullWidth
                    variant="standard"
                    onChange={handleFormChange}
                />
                <TextField
                    value={form.count}
                    margin="dense"
                    name="count"
                    label="Exercise Count"
                    fullWidth
                    variant="standard"
                    onChange={handleFormChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreateExercise}>Create Exercise</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateExerciseDialog;
