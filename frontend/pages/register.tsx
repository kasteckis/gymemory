import Head from 'next/head'
import {Button, Container, TextField} from "@mui/material";
import {apiClient} from "../utils/apiClient";
import * as yup from 'yup';
import {useFormik} from "formik";
import {useRouter} from "next/router";

export default function Register() {

    const router = useRouter();

    const validationSchema = yup.object({
        name: yup
            .string()
            .required('Name is required'),
        email: yup
            .string()
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string()
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Password is required'),
        repeatPassword: yup.string()
            .test('passwords-match', 'Passwords must match', function(value){
                return this.parent.password === value
            })
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            repeatPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const response = await apiClient.post('/register', values);

            if (response.data.error) {
                alert(response.data.msg)
            } else {
                localStorage.setItem('jwt', response.data.access_token)
                localStorage.setItem('username', response.data.username)
                await router.push('/trainings')
            }
        },
    });

    return (
        <>
            <Head>
                <title>GyMemory | Register</title>
                <meta name="description" content="Sign up to access all of the features on gymemory" />
            </Head>
            <Container maxWidth="md">
                <h1 style={{textAlign: 'center'}}>Register</h1>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        variant="standard"
                        id="name"
                        name="name"
                        label="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
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
                    <TextField
                        fullWidth
                        variant="standard"
                        type="password"
                        id="repeatPassword"
                        name="repeatPassword"
                        label="Repeat Password"
                        value={formik.values.repeatPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)}
                        helperText={formik.touched.repeatPassword && formik.errors.repeatPassword}
                    />
                    <Button type={'submit'} style={{marginTop: '10px'}} variant="contained">Register</Button>
                </form>
            </Container>
        </>
    )
}
