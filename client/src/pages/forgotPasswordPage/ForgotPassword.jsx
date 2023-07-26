/* eslint-disable react-hooks/exhaustive-deps */
import emailjs from "@emailjs/browser";
import { InfoOutlined } from "@mui/icons-material";
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { successSound } from "../../components/Audios";


function ForgotPassword() {

    const { palette } = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState("");
    const [msg, setMsg] = useState(false);
    const isNonMobile = useMediaQuery("(min-width: 900px)");
    const [pageType, setPageType] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email) {
            const GetUser = async () => {
                await axios.get(`${process.env.REACT_APP_URL}/users/user/${email}`)
                    .then((res) => {
                        setToken(res.data);
                        setMsg(true);
                        successSound();
                        setPageType(false);
                    }).catch((err) => {
                        setPageType(false);
                    })
            }
            GetUser();
        }
    }

    const SendMail = async () => {
        const template_params = {
            user_name: "Admin",
            user_email: email,
            message: `https://placement-helper-alumini.netlify.app/` + token
        }
        emailjs.send(`${process.env.REACT_APP_SERVICEID}`, `${process.env.REACT_APP_TEMPLATEID}`, template_params, `${process.env.REACT_APP_USERID}`);
    }

    useEffect(() => {
        if (token !== '' && email !== '') {
            SendMail();
        }
    }, [token]);

    return (
        <Box>
            <Box p="1rem 6%" textAlign="center" backgroundColor={palette.background.alt}>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <Typography fontFamily="serif" fontWeight="bold" fontSize={32} color="deepskyblue">
                        Placement Helper
                    </Typography>
                </Link>
            </Box>
            <Box width={isNonMobile ? "80%" : "90%"}
                backgroundColor={palette.background.alt}
                p="2rem" m="2rem auto" borderRadius="1.5rem">
                <Typography
                    fontWeight="600" variant="h3" textAlign="center"
                    fontFamily="serif" sx={{ mb: "1.5rem" }}
                >Forgot Password</Typography>
                <Box display="flex" flexDirection={!isNonMobile && 'column'} justifyContent="space-around" alignItems="center">
                    <Box>
                        <img src={require("../../assets/confirmPwd.webp")} alt="" style={{ width: "95%" }} />
                    </Box>
                    <Box width={isNonMobile ? "35%" : "90%"} mt={2}>
                        {pageType ? (
                            <form onSubmit={handleSubmit}>
                                <TextField label="Email" name="email" autoComplete='off' value={email} onChange={(e) => setEmail(e.target.value)}
                                    fullWidth sx={{ input: { fontFamily: "serif", fontSize: "16px" } }} />
                                <Box display="flex" pt={1}>
                                    <InfoOutlined fontSize="small" sx={{ marginRight: "0.5rem" }} />
                                    <Typography color="gray" fontFamily="serif" fontSize="0.8rem">Enter your placement helper account email</Typography>
                                </Box>
                                <Button fullWidth variant='outlined' type="submit"
                                    sx={{ m: "2rem 0", padding: "0.8rem 0.6rem", fontFamily: "serif", fontSize: "15px" }}>Send
                                </Button>
                            </form>
                        ) : (
                            <Box> {
                                msg ? (
                                    <>
                                        <Typography fontFamily="serif" fontSize="1.2rem" sx={{ color: "green" }}>Forgot password link send to your email</Typography>
                                        <Typography fontFamily="serif" fontSize="1rem">Go to <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/")}>Login</span></Typography>
                                    </>
                                ) : (
                                    <>
                                        <Typography fontFamily="serif" fontSize="1.2rem" sx={{ color: "red" }}>Does not found any account which are connected to enter email</Typography>
                                        <Typography fontFamily="serif" fontSize="1rem">Go to <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/")}>Login</span></Typography>
                                    </>
                                )
                            } </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}


export default ForgotPassword;