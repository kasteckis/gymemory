import {
    Box,
    Button,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";
import Head from "next/head";
import React, {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getParamsWithGuestCode} from "../../utils/params";
import {apiClient} from "../../utils/apiClient";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {ExerciseInterface} from "../../utils/interfaces/exercise";
import CreateExerciseDialog from "../../components/exercises/dialogs/CreateExerciseDialog";
import EditExerciseDialog from "../../components/exercises/dialogs/EditExerciseDialog";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmptyList from "../../components/typography/EmptyList";

export default function Exercises() {
    const router = useRouter();
    let { training } = router.query;
    training = training ? training.toString() : undefined;

    const [exercises, setExercises] = useState<ExerciseInterface[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseInterface | undefined>();
    const [createExerciseDialogOpen, setCreateExerciseDialogOpen] = useState<boolean>(false);
    const [editExerciseDialogOpen, setEditExerciseDialogOpen] = useState<boolean>(false);

    const getExercises = useCallback(async () => {
        if (!training) {
            return;
        }

        const params = getParamsWithGuestCode();

        if (!params['guest-code']) {
            await router.push('/login');
            return;
        }

        const exercisesResponse = await apiClient.get('/exercises/' + training, { params });

        setExercises(exercisesResponse.data);
    }, [setExercises, router, training])

    const handleDeleteButton = (exercise: ExerciseInterface) => async () => {
        const params = getParamsWithGuestCode();

        await apiClient.delete('/exercise/' + exercise.id, { params });
        await getExercises();
    }

    const handleEditButton = (exercise: ExerciseInterface) => () => {
        setSelectedExercise(exercise)
        setEditExerciseDialogOpen(true)
    }

    const handleOpenExercise = (exercise: ExerciseInterface) => () => {
        setSelectedExercise(exercise)
        setEditExerciseDialogOpen(true)
    }

    const handleCreateExercise = () => {
        setCreateExerciseDialogOpen(true);
    }

    const handleBackButton = async () => {
        await router.push('/trainings');
    }

    useEffect(() => {
        getExercises()
    }, [getExercises])

    return (
        <>
            <Head>
                <title>GyMemory | Exercises</title>
            </Head>
            <Container maxWidth="sm">
                <h1 style={{textAlign: 'center'}}>Exercises</h1>
                <Box sx={{display: 'flex'}}>
                    <Box textAlign={'left'} sx={{width: '50%'}}>
                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackButton}>
                            Back
                        </Button>
                    </Box>
                    <Box textAlign={'right'} sx={{width: '50%'}}>
                        <Button variant="outlined" endIcon={<AddIcon />} onClick={handleCreateExercise}>
                            Add Exercise
                        </Button>
                    </Box>
                </Box>
                {exercises.length === 0 ?
                    <EmptyList text={'Empty exercise list! You should add some!'} />
                    : undefined
                }
                <List>
                    {exercises.map(exercise => {
                        return (
                            <ListItem key={exercise.id} disablePadding secondaryAction={
                                <>
                                    <IconButton onClick={handleEditButton(exercise)} edge="end" aria-label="delete">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={handleDeleteButton(exercise)} edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }>
                                <ListItemButton onClick={handleOpenExercise(exercise)}>
                                    <ListItemText primary={exercise.name} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Container>
            {training ? <CreateExerciseDialog
                open={createExerciseDialogOpen}
                setOpen={setCreateExerciseDialogOpen}
                getExercises={getExercises}
                trainingId={training}
            /> : undefined}

            {selectedExercise ? <EditExerciseDialog
                open={editExerciseDialogOpen}
                setOpen={setEditExerciseDialogOpen}
                getExercises={getExercises}
                exercise={selectedExercise}
            /> : undefined}
        </>
    )
}
