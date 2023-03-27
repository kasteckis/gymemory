import { Box, Button, Container, TextField } from '@mui/material';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { apiClient } from '../../../utils/apiClient';
import { getParamsWithGuestCode } from '../../../utils/params';

export default function Exercises() {
  const router = useRouter();
  let { training } = router.query;
  training = training ? training.toString() : undefined;

  const handleBackButton = async () => {
    await router.push('/trainings');
  };

  const validationSchema = yup.object({
    locker_number: yup.string().required('Locker number is required'),
  });

  const formik = useFormik({
    initialValues: {
      locker_number: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const fullValues = {
        training_id: training,
        start_date_time: new Date(),
        ...values,
      };

      const params = getParamsWithGuestCode();

      const response = await apiClient.post('/workout', fullValues, params);

      await router.push('/workout/' + response.data.id);
    },
  });

  useEffect(() => {}, []);

  return (
    <>
      <Head>
        <title>Exercises | GyMemory</title>
      </Head>
      <Container maxWidth="md">
        <h1 style={{ textAlign: 'center' }}>Start Workout</h1>
        <Box sx={{ display: 'flex' }}>
          <Box textAlign={'left'} sx={{ width: '50%' }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackButton}>
              Back
            </Button>
          </Box>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            variant="standard"
            id="locker_number"
            name="locker_number"
            label="Locker Number"
            value={formik.values.locker_number}
            onChange={formik.handleChange}
            error={formik.touched.locker_number && Boolean(formik.errors.locker_number)}
            helperText={formik.touched.locker_number && formik.errors.locker_number}
          />
          <Button color="primary" variant="contained" type="submit" sx={{ marginTop: '10px' }}>
            Start Workout
          </Button>
        </form>
      </Container>
    </>
  );
}
