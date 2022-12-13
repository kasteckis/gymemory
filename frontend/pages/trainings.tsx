import {Box, Button, Container, IconButton, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {apiClient} from "../utils/apiClient";
import {useRouter} from "next/router";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateTrainingDialog from "../components/trainings/dialogs/CreateTrainingDialog";
import {getParamsWithGuestCode} from "../utils/params";
import {TrainingInterface} from "../utils/interfaces/training";
import EditTrainingDialog from "../components/trainings/dialogs/EditTrainingDialog";
import Head from "next/head";
import DeleteTrainingDialog from "../components/trainings/dialogs/DeleteTrainingDialog";
import logout from "../utils/logout";

export default function Trainings() {
    const router = useRouter();
    const [trainings, setTrainings] = useState<TrainingInterface[]>([]);
    const [selectedTraining, setSelectedTraining] = useState<TrainingInterface | undefined>();
    const [createTrainingDialogOpen, setCreateTrainingDialogOpen] = useState<boolean>(false);
    const [editTrainingDialogOpen, setEditTrainingDialogOpen] = useState<boolean>(false);
    const [deleteTrainingDialogOpen, setDeleteTrainingDialogOpen] = useState<boolean>(false);

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
        setSelectedTraining(training)
        setDeleteTrainingDialogOpen(true)
    }

    const handleEditButton = (training: TrainingInterface) => () => {
        setSelectedTraining(training)
        setEditTrainingDialogOpen(true)
    }

    const handleOpenTraining = (training: TrainingInterface) => async () => {
        await router.push('/training/' + training.id)
    }

    const handleCreateTraining = () => {
        setCreateTrainingDialogOpen(true);
    }

    const handleLogout = async () => {
        logout()
        await router.push('/login')
    }

    useEffect(() => {
        getTrainings()
    }, [getTrainings])

    return (
        <>
            <Head>
                <title>GyMemory | Trainings</title>
            </Head>
            <Container maxWidth="sm">
                <h1 style={{textAlign: 'center'}}>Trainings</h1>
                <Box sx={{display: 'flex'}}>
                    <Box textAlign={'left'} sx={{width: '50%'}}>
                        <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                    <Box textAlign={'right'} sx={{width: '50%'}}>
                        <Button variant="outlined" endIcon={<AddIcon />} onClick={handleCreateTraining}>
                            Add Training
                        </Button>
                    </Box>
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
            {selectedTraining ? <EditTrainingDialog
                open={editTrainingDialogOpen}
                setOpen={setEditTrainingDialogOpen}
                getTrainings={getTrainings}
                training={selectedTraining}
            /> : undefined}
            {selectedTraining ? <DeleteTrainingDialog
                open={deleteTrainingDialogOpen}
                setOpen={setDeleteTrainingDialogOpen}
                getTrainings={getTrainings}
                training={selectedTraining}
            /> : undefined}
        </>
    )
}
