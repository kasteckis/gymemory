import Head from 'next/head'
import {Button, Container, TextField} from "@mui/material";
import axios from "axios";
import {apiClient} from "../utils/apiClient";

export default function Home() {

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await apiClient.post('/register', {
            name: 'test',
            email: 'test',
            password: 'test',
        });
        console.log(response.data)
    }

    return (
        <>
            <Head>
                <title>GyMemory | Register</title>
                <meta name="description" content="Sign up to access all of the features on gymemory" />
            </Head>
            <Container maxWidth="sm">
                <h1 style={{textAlign: 'center'}}>Register</h1>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Name" variant="standard" />
                    <TextField fullWidth label="Email" variant="standard" />
                    <TextField fullWidth label="Password" variant="standard" type={'password'} />
                    <Button type={'submit'} onClick={handleSubmit} style={{marginTop: '10px'}} variant="contained">Register</Button>
                </form>
            </Container>
        </>
    )
}
