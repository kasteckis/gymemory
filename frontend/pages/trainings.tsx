import {Container, IconButton, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {apiClient} from "../utils/apiClient";
import {useRouter} from "next/router";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";

interface TrainingInterface {
    id: number,
    name: string,
}

export default function Trainings() {
    const router = useRouter();
    const [trainings, setTrainings] = useState<TrainingInterface[]>([]);

    const getTrainings = useCallback(async () => {
        const guestCode = localStorage.getItem('guest-code')

        if (!guestCode) {
            await router.push('/login');
            return;
        }

        const params = {
            "guest-code": guestCode,
        }

        const trainings = await apiClient.get('/trainings', { params });

        setTrainings(trainings.data);
    }, [setTrainings, router])

    const handleDeleteButton = (training: TrainingInterface) => () => {
        console.log(training);
    }

    const handleEditButton = (training: TrainingInterface) => () => {
        console.log('edit');
    }

    const handleOpenTraining = (training: TrainingInterface) => () => {
        console.log('open');
    }

    useEffect(() => {
        getTrainings()
    }, [getTrainings])

    return (
        <Container maxWidth="sm">
            <h1 style={{textAlign: 'center'}}>Trainings</h1>
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
    )
}
