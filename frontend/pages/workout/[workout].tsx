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
import LoadingCircle from "../../components/utils/LoadingCircle";
import {WorkoutInterface} from "../../utils/interfaces/WorkoutInterface";
import EditExerciseDialog from "../../components/exercises/dialogs/EditExerciseDialog";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Exercises() {
    const router = useRouter();
    let {workout} = router.query;
    workout = workout ? workout.toString() : undefined;
    const [exercises, setExercises] = useState<ExerciseInterface[]>([]);
    const [currentWorkout, setCurrentWorkout] = useState<WorkoutInterface|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [timePassed, setTimePassed] = useState<string>('');
    const [selectedExercise, setSelectedExercise] = useState<ExerciseInterface | undefined>();
    const [editExerciseDialogOpen, setEditExerciseDialogOpen] = useState<boolean>(false);

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
        setLoading(false)
    }, [setExercises, workout])

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

    const getCurrentWorkout = useCallback(async () => {
        const params = getParamsWithGuestCode()

        const response = await apiClient.get('/workout', params)

        if (response.data) {
            setCurrentWorkout(response.data)
        }
    }, [])

    const handleOpenExercise = (exercise: ExerciseInterface) => () => {
        setSelectedExercise(exercise)
        setEditExerciseDialogOpen(true)
    }

    const handleFinishAllExercises = async () => {
        const params = getParamsWithGuestCode()

        const values = {}

        const response = await apiClient.post(`/workout/${workout}/complete`, values, params)
        if (response.data) {
            await getExercises();
        }
    }

    useEffect(() => {
        getCurrentWorkout()
        getExercises()
    }, [getCurrentWorkout, getExercises])

    useEffect(() => {
        setInterval(() => {

            if (currentWorkout) {
                const workoutStarted = new Date(currentWorkout.start_date_time)
                const now = new Date()

                // @ts-ignore
                const diffMs = (now - workoutStarted);

                const minutes = Math.floor(diffMs / 60000);
                const seconds = ((diffMs % 60000) / 1000).toFixed(0);
                // @ts-ignore
                const answer = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

                setTimePassed(answer)
            }
        }, 1000)
    }, [currentWorkout])

    return (
        <>
            <Head>
                <title>Current Workout | GyMemory</title>
            </Head>
            <Container maxWidth="md">
                <Box textAlign={'right'} sx={{display: 'flex'}}>
                    <div style={{width: '10%'}}></div>
                    <h1 style={{textAlign: 'center', width: '80%'}}>Trainings</h1>
                    <IconButton sx={{width: '10%'}} onClick={handleFinishAllExercises} disableRipple={true}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
                <h1 style={{textAlign: 'center'}}>Current Workout</h1>
                {loading ?
                    <LoadingCircle/>
                    :
                    <>
                        <h2 style={{textAlign: 'center'}}>Time passed: {timePassed}</h2>
                        <Box sx={{display: 'flex'}}>
                            <Box textAlign={'left'} sx={{width: '50%'}}>
                                <Button variant="outlined" startIcon={<ArrowBackIcon/>} onClick={handleBackButton}>
                                    Back
                                </Button>
                            </Box>

                            <Box textAlign={'right'} sx={{width: '50%'}}>
                                <Button variant="outlined" endIcon={<DoneIcon/>} onClick={handleFinishWorkout}
                                        disabled={
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
                                                    <CheckBoxIcon/>
                                                </IconButton>
                                                :
                                                <IconButton edge="end" onClick={finishExercise(exercise)}>
                                                    <CheckBoxOutlineBlankIcon/>
                                                </IconButton>
                                            }
                                        </>
                                    }>
                                        <ListItemButton onClick={handleOpenExercise(exercise)}>
                                            <ListItemText primary={exercise.name} secondary={exercise.count}/>
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </>
                }
            </Container>
            {selectedExercise && <EditExerciseDialog
                open={editExerciseDialogOpen}
                setOpen={setEditExerciseDialogOpen}
                getExercises={getExercises}
                exercise={selectedExercise}
            />}
        </>
    )
}
