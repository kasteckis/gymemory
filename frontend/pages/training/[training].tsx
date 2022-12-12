import {Container} from "@mui/material";
import Head from "next/head";
import React from "react";

export default function Home() {
    return (
        <>
            <Head>
                <title>GyMemory | Exercises</title>
            </Head>
            <Container maxWidth="sm">
                <h1 style={{textAlign: 'center'}}>GyMemory - exercises todo!</h1>
            </Container>
        </>
    )
}
