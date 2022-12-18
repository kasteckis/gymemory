import {
    Box,
    Button,
    Container, TextField,
} from "@mui/material";
import Head from "next/head";
import React, {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as yup from 'yup';
import {useFormik} from "formik";
import {ExerciseInterface} from "../../utils/interfaces/exercise";
import {getParamsWithGuestCode} from "../../utils/params";
import {apiClient} from "../../utils/apiClient";

export default function Exercises() {
    const router = useRouter();
    let { workout } = router.query;
    workout = workout ? workout.toString() : undefined;
    const [exercises, setExercises] = useState<ExerciseInterface[]>([]);

    const handleBackButton = async () => {
        await router.push('/trainings');
    }

    const getExercises = useCallback(async () => {
        if (!workout) {
            return;
        }

        const params = getParamsWithGuestCode();

        const exercisesResponse = await apiClient.get('/exercises-by-workout/' + workout, params);

        setExercises(exercisesResponse.data)
    }, [setExercises, router, workout])

    useEffect(() => {
        getExercises()
    }, [])

    const validationSchema = yup.object({
        locker_number: yup
            .string()
            .required('Locker number is required'),
    });

    const formik = useFormik({
        initialValues: {
            locker_number: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            console.log('aaa')
        },
    });

    return (
        <>
            <Head>
                <title>GyMemory | Current Workout</title>
            </Head>
            <Container maxWidth="md">
                <h1 style={{textAlign: 'center'}}>Current Workout</h1>
                <Box sx={{display: 'flex'}}>
                    <Box textAlign={'left'} sx={{width: '50%'}}>
                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackButton}>
                            Back to trainings
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    )
}
