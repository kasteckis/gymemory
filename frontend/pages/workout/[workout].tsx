import {
    Box,
    Button,
    Container, IconButton, List, ListItem, ListItemButton, ListItemText,
} from "@mui/material";
import Head from "next/head";
import React, {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {ExerciseInterface} from "../../utils/interfaces/exercise";
import {getParamsWithGuestCode} from "../../utils/params";
import {apiClient} from "../../utils/apiClient";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DoneIcon from '@mui/icons-material/Done';

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

    const handleFinishWorkout = async () => {
        const params = getParamsWithGuestCode()

        const values = {
            end_date_time: new Date(),
        }

        const response = await apiClient.put('/workout/' + workout, values, params)

        if (response.data) {
            await router.push(`/workout/${workout}/finish`)
        }
    }

    const finishExercise = (exercise: ExerciseInterface) => async () => {
        const params = getParamsWithGuestCode()

        const values = {
            completed: true,
        }

        const response = await apiClient.put(`/exercise/${exercise.id}/complete`, values, params)

        if (response.data) {
            getExercises()
        }
    }

    const startExerciseAgain = (exercise: ExerciseInterface) => async () => {
        const params = getParamsWithGuestCode()

        const values = {
            completed: false,
        }

        const response = await apiClient.put(`/exercise/${exercise.id}/complete`, values, params)

        if (response.data) {
            getExercises()
        }
    }

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
                            Back
                        </Button>
                    </Box>

                    <Box textAlign={'right'} sx={{width: '50%'}}>
                        <Button variant="outlined" endIcon={<DoneIcon />} onClick={handleFinishWorkout} disabled={
                            exercises.filter(exercise => !exercise.completed).length !== 0
                        }>
                            Complete
                        </Button>
                    </Box>
                </Box>
                <List>
                    {exercises.map(exercise => {
                        return (
                            <ListItem key={exercise.id} disablePadding secondaryAction={
                                <>
                                    {exercise.completed ?
                                        <IconButton edge="end" onClick={startExerciseAgain(exercise)}>
                                            <CheckBoxIcon />
                                        </IconButton>
                                        :
                                        <IconButton edge="end" onClick={finishExercise(exercise)}>
                                            <CheckBoxOutlineBlankIcon />
                                        </IconButton>
                                    }
                                </>
                            }>
                                <ListItemButton>
                                    <ListItemText primary={exercise.name} secondary={exercise.count} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Container>
        </>
    )
}
