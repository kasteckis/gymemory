import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../utils/apiClient';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateTrainingDialog from '../components/trainings/dialogs/CreateTrainingDialog';
import { getParamsWithGuestCode } from '../utils/params';
import { TrainingInterface } from '../utils/interfaces/training';
import EditTrainingDialog from '../components/trainings/dialogs/EditTrainingDialog';
import Head from 'next/head';
import DeleteTrainingDialog from '../components/trainings/dialogs/DeleteTrainingDialog';
import logout from '../utils/logout';
import EmptyList from '../components/typography/EmptyList';
import LoadingCircle from '../components/utils/LoadingCircle';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeType } from '../utils/interfaces/ThemeType';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StartWorkoutDialog from '../components/trainings/dialogs/StartWorkoutDialog';
import { WorkoutInterface } from '../utils/interfaces/WorkoutInterface';
import Link from 'next/link';

export default function Trainings() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [trainings, setTrainings] = useState<TrainingInterface[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<TrainingInterface | undefined>();
  const [createTrainingDialogOpen, setCreateTrainingDialogOpen] = useState<boolean>(false);
  const [editTrainingDialogOpen, setEditTrainingDialogOpen] = useState<boolean>(false);
  const [deleteTrainingDialogOpen, setDeleteTrainingDialogOpen] = useState<boolean>(false);
  const [startWorkoutDialogOpen, setStartWorkoutDialogOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutInterface | null>(null);

  const getTrainings = useCallback(async () => {
    const params = getParamsWithGuestCode();

    if (!params.params['guest-code'] && !params.headers.Authorization) {
      await router.push('/login');
      return;
    }

    const trainings = await apiClient.get('/trainings', params);

    setTrainings(trainings.data);
    setLoading(false);
  }, [setTrainings, router]);

  const getCurrentWorkout = useCallback(async () => {
    const params = getParamsWithGuestCode();

    const response = await apiClient.get('/workout', params);

    if (response.data) {
      setCurrentWorkout(response.data);
    }
  }, []);

  const handleDeleteButton = (training: TrainingInterface) => async () => {
    setSelectedTraining(training);
    setDeleteTrainingDialogOpen(true);
  };

  const handleEditButton = (training: TrainingInterface) => () => {
    setSelectedTraining(training);
    setEditTrainingDialogOpen(true);
  };

  const handleOpenTraining = (training: TrainingInterface) => async () => {
    await router.push('/training/' + training.id);
  };

  const handleCreateTraining = () => {
    setCreateTrainingDialogOpen(true);
  };

  const handleLogout = async () => {
    logout();
    await router.push('/login');
  };

  const handleThemeChange = () => {
    const currentTheme = localStorage.getItem('theme') as ThemeType;

    if (currentTheme) {
      localStorage.setItem('theme', currentTheme === 'dark' ? 'light' : 'dark');
    } else {
      localStorage.setItem('theme', 'dark');
    }

    location.reload();
  };

  const handleStartExercise = (training: TrainingInterface) => async () => {
    setSelectedTraining(training);
    setStartWorkoutDialogOpen(true);
  };

  useEffect(() => {
    getTrainings();
    getCurrentWorkout();

    const username = localStorage.getItem('username');

    if (localStorage.getItem('guest-code')) {
      setUsername('Guest');
    } else if (username) {
      setUsername(username);
    }
  }, [getCurrentWorkout, getTrainings, setUsername]);

  return (
    <>
      <Head>
        <title>Trainings | GyMemory</title>
      </Head>
      <Container maxWidth="md">
        <Box textAlign={'right'} sx={{ display: 'flex' }}>
          <div style={{ width: '10%' }}></div>
          <h1 style={{ textAlign: 'center', width: '80%' }}>Trainings</h1>
          <IconButton sx={{ width: '10%' }} onClick={handleThemeChange} disableRipple={true}>
            <Brightness7Icon />
          </IconButton>
        </Box>
        <h3 style={{ textAlign: 'center' }}>Sup, {username} !</h3>
        {currentWorkout ? (
          <h3 style={{ textAlign: 'center' }}>
            You have active workout!{' '}
            <Link href={`/workout/${currentWorkout.id}`}>Click here to continue!</Link>
          </h3>
        ) : undefined}
        <Box sx={{ display: 'flex' }}>
          <Box textAlign={'left'} sx={{ width: '50%' }}>
            <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
          <Box textAlign={'right'} sx={{ width: '50%' }}>
            <Button variant="outlined" endIcon={<AddIcon />} onClick={handleCreateTraining}>
              Add Training
            </Button>
          </Box>
        </Box>

        {loading ? (
          <LoadingCircle />
        ) : (
          <>
            {trainings.length === 0 ? (
              <EmptyList text={'Empty training list! You should add some!'} />
            ) : undefined}
            <List>
              {trainings.map((training) => {
                return (
                  <ListItem
                    key={training.id}
                    disablePadding
                    secondaryAction={
                      <>
                        <IconButton onClick={handleEditButton(training)} edge="end">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={handleDeleteButton(training)}
                          edge="end"
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={handleStartExercise(training)}
                          disabled={training.exercises === 0}
                          edge="end"
                        >
                          <PlayCircleFilledIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemButton onClick={handleOpenTraining(training)}>
                      <ListItemText primary={training.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </Container>
      <CreateTrainingDialog
        open={createTrainingDialogOpen}
        setOpen={setCreateTrainingDialogOpen}
        getTrainings={getTrainings}
      />
      {selectedTraining ? (
        <EditTrainingDialog
          open={editTrainingDialogOpen}
          setOpen={setEditTrainingDialogOpen}
          getTrainings={getTrainings}
          training={selectedTraining}
        />
      ) : undefined}
      {selectedTraining ? (
        <DeleteTrainingDialog
          open={deleteTrainingDialogOpen}
          setOpen={setDeleteTrainingDialogOpen}
          getTrainings={getTrainings}
          training={selectedTraining}
        />
      ) : undefined}
      {selectedTraining ? (
        <StartWorkoutDialog
          open={startWorkoutDialogOpen}
          setOpen={setStartWorkoutDialogOpen}
          training={selectedTraining}
        />
      ) : undefined}
    </>
  );
}
