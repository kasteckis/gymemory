import {Box, Button, Container, IconButton, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {apiClient} from "../utils/apiClient";
import {useRouter} from "next/router";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import CreateTrainingDialog from "../components/trainings/dialogs/CreateTrainingDialog";
import {getParamsWithGuestCode} from "../utils/params";
import {TrainingInterface} from "../utils/interfaces/training";
import EditTrainingDialog from "../components/trainings/dialogs/EditTrainingDialog";

export default function Trainings() {
    const router = useRouter();
    const [trainings, setTrainings] = useState<TrainingInterface[]>([]);
    const [selectedTraining, setSelectedTraining] = useState<TrainingInterface | undefined>();
    const [createTrainingDialogOpen, setCreateTrainingDialogOpen] = useState<boolean>(false);
    const [editTrainingDialogOpen, setEditTrainingDialogOpen] = useState<boolean>(false);

    const getTrainings = useCallback(async () => {
        const params = getParamsWithGuestCode();

        if (!params['guest-code']) {
            await router.push('/login');
            return;
        }

        const trainings = await apiClient.get('/trainings', { params });

        setTrainings(trainings.data);
    }, [setTrainings, router])

    const handleDeleteButton = (training: TrainingInterface) => async () => {
        const params = getParamsWithGuestCode();

        await apiClient.delete('/training/' + training.id, { params })
        await getTrainings();
    }

    const handleEditButton = (training: TrainingInterface) => () => {
        setSelectedTraining(training)
        setEditTrainingDialogOpen(true)
    }

    const handleOpenTraining = (training: TrainingInterface) => () => {
        console.log('open');
    }

    const handleCreateTraining = () => {
        setCreateTrainingDialogOpen(true);
    }

    useEffect(() => {
        getTrainings()
    }, [getTrainings])

    return (
        <>
            <Container maxWidth="sm">
                <h1 style={{textAlign: 'center'}}>Trainings</h1>
                <Box textAlign={'right'}>
                    <Button variant="outlined" endIcon={<AddIcon />} onClick={handleCreateTraining}>
                        Add Training
                    </Button>
                </Box>
                <List>
                    {trainings.map(training => {
                        return (
                            <ListItem key={training.id} disablePadding secondaryAction={
                                <>
                                    <IconButton onClick={handleEditButton(training)} edge="end" aria-label="delete">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={handleDeleteButton(training)} edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }>
                                <ListItemButton onClick={handleOpenTraining(training)}>
                                    <ListItemText primary={training.name} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Container>
            <CreateTrainingDialog open={createTrainingDialogOpen} setOpen={setCreateTrainingDialogOpen} getTrainings={getTrainings} />
            <EditTrainingDialog open={editTrainingDialogOpen} setOpen={setEditTrainingDialogOpen} getTrainings={getTrainings} training={selectedTraining} />
        </>
    )
}
