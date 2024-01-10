/* eslint-disable react-hooks/exhaustive-deps */
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, InputAdornment, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from "yup";
import { successSound } from '../../components/Audios';



const initialPassword = {
    password: "",
    confirmPassword: ""
}

const validationSchema = yup.object().shape({
    password: yup.string().required("password required").min(5, "password must be greater then 5 character"),
    confirmPassword: yup.string().required('Confirm Password is required').oneOf([yup.ref('password'), null], 'Passwords not match'),
});

function UpdatePassword() {

    const navigate = useNavigate();
    const { palette } = useTheme();
    const { token } = useParams();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tokenCheck, setTokenCheck] = useState(false);
    const isNonMobile = useMediaQuery("(min-width: 800px)");

    const handleFormSubmit = async (values, onSubmitProps) => {
        const password = values.password;
        const Data = { token, password };
        await axios.patch(`${process.env.REACT_APP_URL}/users/user/update/password`, Data)
            .then((res) => {
                if (res.status === 200) {
                    navigate("/");
                    successSound();
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log("Data :", error.response.data);
                }
            });
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(true);
        }, 2000);

        const verifyToken = async () => {
            await axios.get(`${process.env.REACT_APP_URL}/users/user/verifytoken/${token}`)
                .then((res) => {
                    setTokenCheck(false);
                    console.log(res);
                })
                .catch((error) => {
                    if (error.response) {
                        console.log(error.response.data.message);
                        if (error.response.data.message === "jwt expired") {
                            setTokenCheck(true);
                        }
                    }
                });
        }

        verifyToken();
    }, []);

    return (
        <>
            {loading ? (
                <Box>
                    <Box p="1rem 6%" textAlign="center" backgroundColor={palette.background.alt}>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Typography fontFamily="serif" fontWeight="bold" fontSize={32} color="deepskyblue">
                                Placement Helper
                            </Typography>
                        </Link>
                    </Box>
                    {tokenCheck ? (
                        <Box width={isNonMobile ? "80%" : "90%"}
                            backgroundColor={palette.background.alt}
                            p="2rem" m="2rem auto" borderRadius="1.5rem">
                            <Typography
                                fontWeight="600" variant="h3" textAlign="center"
                                fontFamily="serif" sx={{ mb: "1.5rem" }}
                            >Link Expired</Typography>

                            <Box display="flex" flexDirection={!isNonMobile && 'column'} justifyContent="space-around" alignItems="center">
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <img src={require("../../assets/CodePen-404-Page.gif")} alt="" style={{ width: `${isNonMobile ? "72%" : "85%"}` }} />
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <Box width={isNonMobile ? "80%" : "90%"}
                            backgroundColor={palette.background.alt}
                            p="2rem" m="2rem auto" borderRadius="1.5rem">
                            <Typography
                                fontWeight="600" variant="h3" textAlign="center"
                                fontFamily="serif" sx={{ mb: "1.5rem" }}
                            >Change Password</Typography>

                            <Box display="flex" flexDirection={!isNonMobile && 'column'} justifyContent="space-around" alignItems="center">
                                <Box sx={{ display: "flex", justifyContent: "center" }} style={{ width: `${isNonMobile ? "50%" : "80%"}` }} >
                                    <img src={require("../../assets/forgotPwd.png")} alt="" style={{ width: `${isNonMobile ? "100%" : "80%"}` }} />
                                </Box>
                                <Formik
                                    onSubmit={handleFormSubmit}
                                    initialValues={initialPassword}
                                    validationSchema={validationSchema}>
                                    {({ values,
                                        errors,
                                        touched,
                                        handleBlur,
                                        handleChange,
                                        handleSubmit }) => (

                                        <Box display="flex" flexDirection="column" width={isNonMobile ? "50%" : "90%"} mt={2}>
                                            <form onSubmit={handleSubmit}>
                                                <TextField autoComplete='off' label="Password" name="password" type={visible ? "text" : "password"}
                                                    onBlur={handleBlur} onChange={handleChange}
                                                    value={values.password}
                                                    error={Boolean(touched.password) && Boolean(errors.password)}
                                                    helperText={touched.password && errors.password} fullWidth
                                                    sx={{ input: { fontFamily: "serif", fontSize: "16px" } }} InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end" onClick={() => setVisible((visibility) => !visibility)} sx={{ cursor: "pointer" }}>
                                                                {visible ? <Visibility sx={{ right: "0", top: "0" }} /> : <VisibilityOff sx={{ right: "0", top: "0" }} />}
                                                            </InputAdornment>
                                                        )
                                                    }} />
                                                <TextField autoComplete='off' label="Confirm Password" name="confirmPassword" type={visible ? "text" : "password"}
                                                    onBlur={handleBlur} onChange={handleChange}
                                                    value={values.confirmPassword}
                                                    error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword)}
                                                    helperText={touched.confirmPassword && errors.confirmPassword} fullWidth
                                                    sx={{ m: "2rem 0 0 0", input: { fontFamily: "serif", fontSize: "16px" } }} InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end" onClick={() => setVisible((visibility) => !visibility)} sx={{ cursor: "pointer" }}>
                                                                {visible ? <Visibility sx={{ right: "0", top: "0" }} /> : <VisibilityOff sx={{ right: "0", top: "0" }} />}
                                                            </InputAdornment>
                                                        )
                                                    }} />
                                                <Button fullWidth variant='outlined' type="submit"
                                                    sx={{ m: "2rem 0", padding: "0.8rem 0.6rem", fontFamily: "serif", fontSize: "15px" }}>Send
                                                </Button>
                                            </form>
                                        </Box>
                                    )}
                                </Formik>
                            </Box>
                        </Box>
                    )
                    }
                </Box >
            ) : (
                <div id="spinner" className="center-loader">
                    <figure className="loader">
                        <div className="dot white"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </figure>
                </div>
            )}
        </>
    )
}

export default UpdatePassword