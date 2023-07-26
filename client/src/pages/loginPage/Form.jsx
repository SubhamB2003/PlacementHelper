import { Visibility, VisibilityOff } from '@mui/icons-material';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import axios from "axios";
import imageCompression from 'browser-image-compression';
import { Formik } from 'formik';
import React, { useState } from 'react';
import Dropzone from "react-dropzone";
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
    phoneNo: yup.string().required("phone number required").min(10, "number must be 10 digit").max(10, "number must be 10 digit"),
    location: yup.string().required("location required"),
    profession: yup.string().required("profession required"),
    gender: yup.string().required("gender required"),
    picture: yup.string().required("picture required"),
    graduateYear: yup.string().required("graduate year required"),
    about: yup.string(),
    facebookId: yup.string(),
    instagramId: yup.string(),
    linkedinId: yup.string(),
    githubId: yup.string(),
});


// const initialLoginValues = {
//     email: "",
//     password: ""
// };

const initialRegisterValues = {
    userName: "",
    email: "",
    password: "",
    phoneNo: "",
    profession: "",
    gender: "Male",
    picture: "",
    location: "",
    graduateYear: "2023",
    about: "",
    facebookId: "",
    instagramId: "",
    linkedinId: "",
    githubId: ""
};


function Form() {

    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const [visible, setVisible] = useState(false);

    const Years = ["2030", "2029", "2028", "2027", "2026", "2025", " 2024", "2023", "2022", "2021", "2020", "2019", "2018",
        "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003",
        "2002", "2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990"];

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
        const formData = new FormData();
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }
        const compressImage = await imageCompression(values.picture, options);
        const userPicture = new File([compressImage], values.picture.name);

        for (let value in values) {
            if (value !== "picture") {
                formData.append(value, values[value]);
            }
        }
        formData.append("picture", userPicture);
        formData.append("picturePath", values.picture.name);

        const savedUserRes = await axios.post(`${process.env.REACT_APP_URL}/auth/register`, formData).catch((err) => {
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
                setFieldValue,
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
                                <TextField autoComplete='off' label="Phone number" name="phoneNo"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.phoneNo}
                                    error={Boolean(touched.phoneNo) && Boolean(errors.phoneNo)}
                                    helperText={touched.phoneNo && errors.phoneNo}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />
                                <FormControl sx={{ gridColumn: "span 2" }}>
                                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                    <Select label="Gender"
                                        labelId="demo-simple-select-label" id="demo-simple-select"
                                        name="gender" onBlur={handleBlur} onChange={handleChange}
                                        value={values.gender}
                                        error={Boolean(touched.gender) && Boolean(errors.gender)}
                                        helpertext={touched.gender && errors.gender}
                                    >
                                        <MenuItem value="Male" sx={{ fontFamily: "serif" }}>Male</MenuItem>
                                        <MenuItem value="Female" sx={{ fontFamily: "serif" }}>Female</MenuItem>
                                        <MenuItem value="Other" sx={{ fontFamily: "serif" }}>Others</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField autoComplete='off' label="Profession" name="profession"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.profession}
                                    error={Boolean(touched.profession) && Boolean(errors.profession)}
                                    helperText={touched.profession && errors.profession}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />

                                <Box
                                    gridColumn="span 4"
                                    border={`1px solid ${palette.neutral.medium}`}
                                    borderRadius="5px"
                                    p="1rem"
                                    required
                                >
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onDrop={(acceptedFiles) =>
                                            setFieldValue("picture", acceptedFiles[0])
                                        }
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <Box
                                                {...getRootProps()}
                                                border={`2px dashed ${palette.primary.main}`}
                                                p="0.5rem"
                                                sx={{ "&:hover": { cursor: "pointer" } }}
                                            >
                                                <input {...getInputProps()} />
                                                {!values.picture ? (
                                                    <p>Add Picture Here*</p>
                                                ) : (
                                                    <Flexbetween>
                                                        <Typography>{values.picture.name}</Typography>
                                                        <EditOutlinedIcon />
                                                    </Flexbetween>
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                </Box>

                                <TextField autoComplete='off' label="Location" name="location"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.location}
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />
                                <TextField autoComplete='off' label="About" name="about"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.about}
                                    error={Boolean(touched.about) && Boolean(errors.about)}
                                    helperText={touched.about && errors.about}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />

                                <TextField autoComplete='off' label="Facebook ID" name="facebookId"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.facebookId}
                                    error={Boolean(touched.facebookId) && Boolean(errors.facebookId)}
                                    helperText={touched.facebookId && errors.facebookId}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />
                                <TextField autoComplete='off' label="Instagram ID" name="instagramId"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.instagramId}
                                    error={Boolean(touched.instagramId) && Boolean(errors.instagramId)}
                                    helperText={touched.instagramId && errors.instagramId}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />
                                <TextField autoComplete='off' label="Linkedin ID" name="linkedinId"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.linkedinId}
                                    error={Boolean(touched.linkedinId) && Boolean(errors.linkedinId)}
                                    helperText={touched.linkedinId && errors.linkedinId}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />
                                <TextField autoComplete='off' label="Github ID" name="githubId"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.githubId}
                                    error={Boolean(touched.githubId) && Boolean(errors.githubId)}
                                    helperText={touched.githubId && errors.githubId}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif", fontSize: "16px" } }} />
                                <FormControl sx={{ gridColumn: "span 2", fontFamily: "serif" }}>
                                    <InputLabel id="demo-simple-select-label">Graduate Year</InputLabel>
                                    <Select label="Graduate Year"
                                        labelId="demo-simple-select-label" id="demo-simple-select"
                                        name="graduateYear" onBlur={handleBlur} onChange={handleChange}
                                        value={values.graduateYear}
                                        error={Boolean(touched.graduateYear) && Boolean(errors.graduateYear)}
                                        helpertext={touched.graduateYear && errors.graduateYear}
                                    >
                                        {Years.map((year, i) => (
                                            <MenuItem key={i} value={year} sx={{ fontFamily: "serif" }}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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