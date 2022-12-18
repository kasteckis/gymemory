import {
    Box,
    Button,
    Container, TextField,
} from "@mui/material";
import Head from "next/head";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as yup from 'yup';
import {useFormik} from "formik";
import {apiClient} from "../../utils/apiClient";
import {getParamsWithGuestCode} from "../../utils/params";

export default function Exercises() {
    const router = useRouter();
    let { training } = router.query;
    training = training ? training.toString() : undefined;

    const handleBackButton = async () => {
        await router.push('/trainings');
    }

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

            const fullValues = {
                training_id: training,
                start_date_time: new Date(),
                ...values,
            }

            const params = getParamsWithGuestCode();

            const response = await apiClient.post('/workout', fullValues, params);

            console.log(response.data)
        },
    });

    useEffect(() => {

    }, [])

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
