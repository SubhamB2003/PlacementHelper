import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, InputAdornment, TextField, Typography, useMediaQuery } from '@mui/material';
import axios from "axios";
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { successSound } from '../../components/Audios';
import Flexbetween from "../../components/Flexbetween";
import { setLogin } from "../../state/index";


const loginSchema = yup.object().shape({
    email: yup.string().email("email required").required("email must be required"),
    password: yup.string().required("password must be required").min(5, "password must be greater then 5 character")
});

const registerSchema = yup.object().shape({
    userName: yup.string().required("username required"),
    email: yup.string().email("Invalid email").required("email required"),
    password: yup.string().required("password required").min(5, "password must be greater then 5 character"),
    profession: yup.string().required("profession required"),
    about: yup.string(),
});


const initialRegisterValues = {
    userName: "",
    email: "",
    password: "",
    profession: "",
    about: "",
};


function Form() {

    const [pageType, setPageType] = useState("login");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const [visible, setVisible] = useState(false);

    const login = async (values, onSubmitProps) => {

        const loggedIn = await axios.post(`${process.env.REACT_APP_URL}/auth/login`, values).catch((err) => {
            window.alert("Invalid authentication");
        });

        if (loggedIn) {
            successSound();
            dispatch(
                setLogin({
                    user: loggedIn.data.user,
                    token: loggedIn.data.token
                })
            )
        }
        navigate("/")
    }

    const register = async (values, onSubmitProps) => {

        const savedUserRes = await axios.post(`${process.env.REACT_APP_URL}/auth/register`, values).catch((err) => {
            window.alert("Fill the mandatory fields");
        })
        if (savedUserRes) {
            successSound();
            setPageType("login");
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialRegisterValues}
            validationSchema={isLogin ? loginSchema : registerSchema}>
            {({ values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                resetForm }) => (
                <form onSubmit={handleSubmit} >
                    <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": {
                                gridColumn: isNonMobile ? undefined : "span 4"
                            },
                            fontFamily: "serif"
                        }}>
                        <TextField label="Email" name="email"
                            autoComplete='off'
                            onBlur={handleBlur} onChange={handleChange}
                            value={values.email}
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />
                        <TextField autoComplete='off' label="Password" name="password" type={visible ? "text" : "password"}
                            onBlur={handleBlur} onChange={handleChange}
                            value={values.password}
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" onClick={() => setVisible((visibility) => !visibility)} sx={{ cursor: "pointer" }}>
                                        {visible ? <Visibility sx={{ right: "0", top: "0" }} /> : <VisibilityOff sx={{ right: "0", top: "0" }} />}
                                    </InputAdornment>
                                )
                            }} />
                        {isRegister && (
                            <>
                                <TextField autoComplete='off' label="Username" name="userName"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.userName}
                                    error={Boolean(touched.userName) && Boolean(errors.userName)}
                                    helperText={touched.userName && errors.userName}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />
                                <TextField autoComplete='off' label="Profession" name="profession"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.profession}
                                    error={Boolean(touched.profession) && Boolean(errors.profession)}
                                    helperText={touched.profession && errors.profession}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />
                                <TextField autoComplete='off' label="About" name="about"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.about}
                                    error={Boolean(touched.about) && Boolean(errors.about)}
                                    helperText={touched.about && errors.about}
                                    sx={{ gridColumn: "span 4", input: { fontFamily: "serif", fontSize: "16px" } }} />
                            </>
                        )}
                    </Box>

                    <Box>
                        <Button
                            fullWidth
                            variant='outlined'
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                padding: "1rem 0.6rem",
                                fontFamily: "serif",
                                fontSize: "15px"
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                    </Box>
                    <Flexbetween>
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
                                resetForm();
                            }}
                            fontFamily="serif"
                            fontSize={17}
                            color="Highlight"
                            sx={{ cursor: "pointer" }}
                        >
                            {isLogin
                                ? "Don't have an account? Sign Up here."
                                : "Already have an account? Login here."}
                        </Typography>
                        {isLogin ? (
                            <Typography fontFamily="serif" fontSize={17} color="Highlight" textAlign="end"
                                sx={{ cursor: "pointer" }} onClick={() => navigate("/forgotpassword")}>Forget Password</Typography>
                        ) : (
                            <Typography fontFamily="serif" fontSize={17} color="Highlight" textAlign="end"
                                sx={{ cursor: "pointer" }}>Terms and conditions</Typography>)}
                    </Flexbetween>
                </form>
            )}
        </Formik>
    )
}

export default Form