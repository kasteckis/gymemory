import { Button, Container } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { WorkoutInterface } from '../../../utils/interfaces/WorkoutInterface';
import { apiClient } from '../../../utils/apiClient';
import { getParamsWithGuestCode } from '../../../utils/params';
import LoadingCircle from '../../../components/utils/LoadingCircle';
import Head from 'next/head';

export default function Finish() {
  const router = useRouter();

  let { workout } = router.query;
  workout = workout ? workout.toString() : undefined;

  const [workoutEntity, setWorkoutEntity] = useState<WorkoutInterface | null>();

  const getWorkoutEntity = useCallback(async () => {
    if (workout) {
      const params = getParamsWithGuestCode();

      const response = await apiClient.get('/workout/' + workout, params);

      setWorkoutEntity(response.data);
    }
  }, [workout]);

  const handleGoBackToTrainings = async () => {
    await router.push('/trainings');
  };

  useEffect(() => {
    getWorkoutEntity();
  }, [getWorkoutEntity]);

  const getWorkoutLength = () => {
    if (workoutEntity) {
      const date1 = new Date(workoutEntity.start_date_time);
      const date2 = new Date(workoutEntity.end_date_time);
      // @ts-ignore
      const diffTime = Math.abs(date2 - date1);
      return Math.ceil(diffTime / (1000 * 60)) + ' minutes';
    }

    return '';
  };

  return (
    <>
      <Head>
        <title>Workout Summary | GyMemory</title>
      </Head>
      <Container maxWidth="md">
        <h1 style={{ textAlign: 'center' }}>Your workout finished!</h1>
        {workoutEntity ? (
          <div style={{ textAlign: 'center' }}>
            <h2>
              Your locker number:{' '}
              <span style={{ color: 'red' }}>{workoutEntity.locker_number}</span>
            </h2>
            <h2>Summary</h2>
            <h3>• Your workout lasted - {getWorkoutLength()}</h3>
            <Button variant="contained" onClick={handleGoBackToTrainings}>
              Go back to trainings
            </Button>
          </div>
        ) : (
          <LoadingCircle />
        )}
      </Container>
    </>
  );
}
