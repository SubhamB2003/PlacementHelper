/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Box, Button, FormControl, FormLabel, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes } from 'firebase/storage';
import { Formik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { successSound } from '../components/Audios';
import { storage } from '../firebase-config';
import Navbar from '../pages/Navbar';
import { setUser } from "../state/index";



const updatedSchema = yup.object().shape({
    userName: yup.string().required("username required"),
    profession: yup.string().required("profession required"),
    phoneNo: yup.string().min(10, "number must be 10 digit").max(10, "number must be 10 digit"),
    isPicture: yup.string(),
    gender: yup.string(),
    about: yup.string(),
    location: yup.string(),
    facebookId: yup.string(),
    instagramId: yup.string(),
    linkedinId: yup.string(),
    GithubId: yup.string()
})


function UpdateProfileWidget() {

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const userId = user._id;
    const isNonMobile = useMediaQuery("(min-width: 1000px)");

    const userUpdate = async (values) => {
        const options = {
            maxSizeMB: 3,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
            fileType: String
        }

        if (values.picture || user.isPicture === true) {
            values.isPicture = true;
        }
        else {
            values.isPicture = false;
        }

        const res = await axios.patch(`${process.env.REACT_APP_URL}/users/user/${userId}`, values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.status === 200) {
            if (values.picture) {
                const compressImage = await imageCompression(values.picture, options);
                const userPicture = new File([compressImage], values.picture.name, { type: compressImage.type });

                const imageRef = ref(storage, `public/users/${res.data._id}`);
                uploadBytes(imageRef, userPicture).then(() => {
                    successSound();
                    dispatch(setUser({ user: res.data }));

                    navigate(`/profile/${user._id}`);
                    window.location.reload();
                });
            } else {
                successSound();
                dispatch(setUser({ user: res.data }));
                navigate(`/profile/${user._id}`);
            }
        }

    }


    return (
        <>
            <Navbar />
            <Box width={isNonMobile ? "50%" : "90%"} m="2rem auto">
                <Formik
                    onSubmit={userUpdate}
                    initialValues={{
                        userName: user.userName,
                        phoneNo: user.phoneNo,
                        gender: user.gender,
                        profession: user.profession,
                        isPicture: user.isPicture,
                        location: user.location,
                        about: user.about,
                        facebookId: user.facebookId,
                        instagramId: user.instagramId,
                        linkedinId: user.linkedinId,
                        githubId: user.githubId
                    }}
                    validationSchema={updatedSchema}>
                    {({ values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": {
                                        gridColumn: isNonMobile ? undefined : "span 4"
                                    }
                                }}>
                                <Box sx={{ gridColumn: "span 4" }}>
                                    <FormLabel htmlFor="dropzone-file" sx={{ position: "relative", width: "100%" }}>
                                        <TextField type='file' id="dropzone-file"
                                            onChange={(e) => {
                                                setFieldValue("picture", e.target.files[0])
                                            }}
                                            sx={{ display: "none" }} />

                                        <Box display="flex" justifyContent="center">
                                            {user.isPicture && values.picture === undefined ?
                                                <img style={{ objectFit: "cover", borderRadius: "50%" }} width={100} height={100} alt="user"
                                                    src={`${process.env.REACT_APP_USER_UPLOADIMAGE_STARTURL}${userId}${process.env.REACT_APP_USER_UPLOADIMAGE_ENDURL}`} />
                                                :
                                                values?.picture ?
                                                    <img style={{ objectFit: "cover", borderRadius: "50%" }} width={100} height={100} alt="user"
                                                        src={URL.createObjectURL(values?.picture)} />
                                                    : <Avatar>{user.userName.charAt(0)}</Avatar>
                                            }
                                        </Box>
                                        <Typography textAlign="center" fontFamily="serif" mt={1} sx={{ color: "green" }}>
                                            {values?.picture &&
                                                <>
                                                    <span style={{ display: "none" }}>
                                                        {URL.createObjectURL(values?.picture)}
                                                    </span>
                                                    <span style={{ textAlign: "center" }}>
                                                        Successfully Changed Image
                                                    </span>
                                                </>
                                            }</Typography>
                                    </FormLabel>
                                </Box>

                                <TextField autoComplete='off' label="Username" name="userName"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.userName}
                                    error={Boolean(touched.userName) && Boolean(errors.userName)}
                                    helperText={touched.userName && errors.userName}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif" } }} />
                                <TextField autoComplete='off' label="Phone number" name="phoneNo"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.phoneNo}
                                    error={Boolean(touched.phoneNo) && Boolean(errors.phoneNo)}
                                    helperText={touched.phoneNo && errors.phoneNo}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif" } }} />
                                <FormControl sx={{ gridColumn: "span 2", fontFamily: "serif" }}>
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
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif" } }} />
                                <TextField autoComplete='off' label="Location" name="location"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.location}
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif" } }} />
                                <TextField autoComplete='off' label="About" name="about"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.about}
                                    error={Boolean(touched.about) && Boolean(errors.about)}
                                    helperText={touched.about && errors.about}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif" } }} />

                                <TextField autoComplete='off' label="Facebook ID" name="facebookId"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.facebookId}
                                    error={Boolean(touched.facebookId) && Boolean(errors.facebookId)}
                                    helperText={touched.facebookId && errors.facebookId}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif" } }} />
                                <TextField autoComplete='off' label="Instagram ID" name="instagramId"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.instagramId}
                                    error={Boolean(touched.instagramId) && Boolean(errors.instagramId)}
                                    helperText={touched.instagramId && errors.instagramId}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif" } }} />
                                <TextField autoComplete='off' label="Linkedin ID" name="linkedinId"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.linkedinId}
                                    error={Boolean(touched.linkedinId) && Boolean(errors.linkedinId)}
                                    helperText={touched.linkedinId && errors.linkedinId}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif" } }} />
                                <TextField autoComplete='off' label="Github ID" name="githubId"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.githubId}
                                    error={Boolean(touched.githubId) && Boolean(errors.githubId)}
                                    helperText={touched.githubId && errors.githubId}
                                    sx={{ gridColumn: "span 2", input: { fontFamily: "serif" } }} />
                            </Box>

                            <Box>
                                <Button
                                    fullWidth
                                    variant='outlined'
                                    type="submit"
                                    sx={{
                                        m: "2rem 0",
                                        p: "0.6rem 1rem",
                                        fontFamily: "serif",
                                        fontSize: "16px"
                                    }}
                                >
                                    Update
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </>
    )
}

export default UpdateProfileWidget;