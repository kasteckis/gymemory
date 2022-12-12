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
import React, {useState} from "react";
import Link from "next/link";
import LoginDialogTransition from "../components/login/dialogs/LoginDialogTransition";
import {apiClient} from "../utils/apiClient";
import {useRouter} from "next/router";

interface CreateGuestAccountResponse {
    uuid: string;
}

export default function Home() {
    const router = useRouter();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [disableDialogButtons, setDisableDialogButtons] = useState<boolean>(false);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        alert('Login is not yet implemented! Come back later!'); // Todo implement actual login
    }

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

    return (
        <>
            <Head>
                <title>GyMemory | Login</title>
                <meta name="description" content="Sign in to access all of the features on gymemory" />
            </Head>
            <Container maxWidth="sm">
                <h1 style={{textAlign: 'center'}}>Login</h1>
                <form onSubmit={handleLogin}>
                    <TextField fullWidth label="Email" variant="standard" />
                    <TextField fullWidth label="Password" variant="standard" type={'password'} />

                    <Button type={'submit'} onClick={handleLogin} style={{marginTop: '10px'}} variant="contained">Login</Button>
                    <Button onClick={handleContinueAsGuest} style={{marginTop: '10px', marginLeft: '10px'}} variant="contained">
                        Login as guest
                    </Button>
                </form>
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
