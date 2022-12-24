import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction, useCallback, useState} from "react";
import {apiClient} from "../../../utils/apiClient";
import {getParamsWithGuestCode} from "../../../utils/params";
import * as yup from "yup";
import {useFormik} from "formik";

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

    const handleCreateExercise = async (values: CreateExerciseFormInterface) => {
        const params = getParamsWithGuestCode();

        // const data = {
        //     name: form.name,
        //     count: form.count,
        //     training_id: trainingId,
        // }

        await apiClient.post('/exercise', values, params);
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

    const validationSchema = yup.object({
        name: yup
            .string()
            .required('Training name is required'),
        count: yup
            .string()
            .required('Training count is required'),
        training_id: yup
            .number()
            .required('Training is is required'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            count: '',
            training_id: trainingId,
        },
        validationSchema: validationSchema,
        onSubmit: async (values: CreateExerciseFormInterface) => {
            handleCreateExercise(values);
        },
    });

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>Create Exercise</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="standard"
                        id="name"
                        name="name"
                        label="Exercise Name"
                        type='name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        fullWidth
                        variant="standard"
                        id="count"
                        name="count"
                        label="Exercise Count"
                        type='count'
                        value={formik.values.count}
                        onChange={formik.handleChange}
                        error={formik.touched.count && Boolean(formik.errors.count)}
                        helperText={formik.touched.count && formik.errors.count}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type={'submit'}>Create Exercise</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CreateExerciseDialog;
