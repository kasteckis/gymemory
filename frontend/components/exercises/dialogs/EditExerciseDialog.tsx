import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {apiClient} from "../../../utils/apiClient";
import {getParamsWithGuestCode} from "../../../utils/params";
import {ExerciseInterface} from "../../../utils/interfaces/exercise";

interface CreateExerciseDialogProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    getExercises: () => Promise<void>,
    exercise: ExerciseInterface,
}

interface EditExerciseFormInterface {
    id: number,
    name: string,
    count: string,
}

const EditExerciseDialog = ({open, setOpen, getExercises, exercise}: CreateExerciseDialogProps) => {
    const [form, setForm] = useState<EditExerciseFormInterface>(exercise);

    const handleClose = () => {
        setOpen(false);
    }

    const handleEditExercise = async (event: any) => {
        event.preventDefault();

        const params = getParamsWithGuestCode();

        const data = {
            name: form.name,
            count: form.count,
        }

        await apiClient.put('/exercise/' + exercise.id, data, params);
        setOpen(false);
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

    useEffect(() => {
        setForm(exercise);
    }, [exercise])

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleEditExercise}>
                <DialogTitle>Edit Exercise</DialogTitle>
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
                    <Button type={'submit'} onClick={handleEditExercise}>Update Exercise</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default EditExerciseDialog;
