import Head from 'next/head'
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import LoginDialogTransition from "../components/login/dialogs/LoginDialogTransition";
import {apiClient} from "../utils/apiClient";
import {useRouter} from "next/router";
import styles from '../components/register/register.module.css'
import * as yup from "yup";
import {useFormik} from "formik";
import {getParamsWithGuestCode} from "../utils/params";
import LoadingCircle from "../components/utils/LoadingCircle";

interface CreateGuestAccountResponse {
    uuid: string;
}

export default function Home() {
    const router = useRouter();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [disableDialogButtons, setDisableDialogButtons] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const validationSchema = yup.object({
        email: yup
            .string()
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string()
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await apiClient.post('/auth/login', values);

                localStorage.setItem('jwt', response.data.access_token)
                localStorage.setItem('username', response.data.username)
                await router.push('/trainings')
            } catch (e: any) {
                alert('Login failed!')
            }
        },
    });

    const handleContinueAsGuest = () => {
        if (localStorage.getItem('guest-code')) {
            router.push('/trainings');
            return;
        }

        setDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    const handleContinueAsGuestConfirmed = async () => {
        setDisableDialogButtons(true);
        const response = await apiClient.post<CreateGuestAccountResponse>('/guest');

        localStorage.setItem('guest-code', response.data.uuid);

        await router.push('/trainings');
    }

    const checkIfUserIsAlreadyLoggedIn = useCallback(async () => {
        const params = getParamsWithGuestCode();

        const response = await apiClient.get('/user', params)

        if (response.data.user) {
            await router.push('/trainings')
        } else {
            setLoading(false);
        }
    }, [router])

    useEffect(() => {
        checkIfUserIsAlreadyLoggedIn();
    }, [checkIfUserIsAlreadyLoggedIn])

    return (
        <>
            <Head>
                <title>Login | GyMemory</title>
                <meta name="description" content="Sign in to access all of the features on gymemory" />
            </Head>
            <Container maxWidth="md">
                <h1 style={{textAlign: 'center'}}>Login</h1>
                {loading ?
                    <LoadingCircle />
                :
                    <>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                variant="standard"
                                id="email"
                                name="email"
                                label="Email"
                                type='email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                fullWidth
                                variant="standard"
                                type="password"
                                id="password"
                                name="password"
                                label="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />

                            <Button className={styles.buttonLogin} type={'submit'} variant="contained">Login</Button>
                            <Button className={styles.buttonContinueGuest} onClick={handleContinueAsGuest} variant="contained">
                                Login as guest
                            </Button>
                            <Link href="/register" style={{textDecoration: 'none'}}>
                                <Button className={styles.buttonRegister} variant="contained">
                                    Register
                                </Button>
                            </Link>
                        </form>
                    </>
                }
            </Container>

            <Dialog
                open={dialogOpen}
                TransitionComponent={LoginDialogTransition}
                keepMounted
                onClose={handleCloseDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Are you sure you do not want to create an account?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        With guest account there is a chance you might lose your data after your device cache restarts! {' '}
                        <Link href={'/register'}>To create account, click here!</Link>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disableDialogButtons} onClick={handleCloseDialog}>Cancel</Button>
                    <Button disabled={disableDialogButtons} onClick={handleContinueAsGuestConfirmed}>Create Guest Account</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
