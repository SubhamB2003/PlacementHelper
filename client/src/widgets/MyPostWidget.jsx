import { AttachFileOutlined, DeleteOutline, GifBoxOutlined, ImageOutlined, MicOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Divider, IconButton, InputBase, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes } from "firebase/storage";
import React, { useState } from 'react';
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from 'react-redux';
import { successSound } from '../components/Audios';
import Flexbetween from '../components/Flexbetween';
import UserImage from '../components/UserImage';
import WidgetWrapper from '../components/WidgetWrapper';
import { storage } from '../firebase-config';
import { setPosts } from '../state';

function MyPostWidget() {

    let isPicture = false;
    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [image, setImage] = useState(null);
    const [picture, setPicture] = useState(false);
    const [description, setDescription] = useState("");

    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const mediumMain = palette.neutral.mediumMain;
    const isNonMobile = useMediaQuery("(min-width: 1000px)");

    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const handlePost = async () => {
        const options = {
            maxSizeMB: 3,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
            fileType: String
        }

        if (image !== null && picture) {
            isPicture = true;
        }

        const userId = user._id;
        const res = await axios.post(`${process.env.REACT_APP_URL}/posts/post`, { userId, description, isPicture }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.status === 200) {
            if (image !== null) {
                const compressImage = await imageCompression(image, options);
                const userPicture = new File([compressImage], image.name, { type: compressImage.type });

                const imageRef = ref(storage, `public/posts/${res.data.currPostId}`);
                uploadBytes(imageRef, userPicture).then(() => {
                    successSound();
                    const posts = res.data.post;
                    dispatch(setPosts({ posts }));
                    setPicture(false);
                    setDescription("");
                    setImage(null);
                });
            } else {
                successSound();
                const posts = res.data.post;
                dispatch(setPosts({ posts }));
                setPicture(false);
                setDescription("");
                setImage(null);
            }
        }
    }


    return (
        <WidgetWrapper>
            <Flexbetween gap={isNonMobile ? "1.5rem" : "0.5rem"}>
                {user.isPicture ? <UserImage userPictureId={user._id} size={60} />
                    : <Avatar>{user.userName.charAt(0)?.toUpperCase()}</Avatar>}
                <InputBase
                    placeholder="What's on your mood..."
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                    sx={{
                        width: "100%", padding: `${isNonMobile ? "0.8rem 2rem" : "0.4rem 1rem"}`,
                        height: "3.5rem",
                        border: "1px solid gray",
                        borderRadius: "2rem", input: {
                            fontSize: "18px",
                            fontFamily: "serif",
                            color: main
                        }
                    }}
                />
            </Flexbetween>
            {picture && (
                <Box border={`1px solid ${medium}`}
                    borderRadius="5px" mt="1rem">
                    <Dropzone
                        acceptedFiles=".jpg, .jpeg, .png"
                        multiple={false}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <Flexbetween>
                                <Box
                                    {...getRootProps()}
                                    border={`1px dashed ${medium}`}
                                    borderRadius="5px" m={isNonMobile ? "1rem" : "0.6rem"}
                                    p="0.2rem"
                                    width="100%" height="20%" overflow="scroll">
                                    <input {...getInputProps()} />
                                    <input {...getInputProps()} />
                                    {!image ? (
                                        <p style={{ fontFamily: "serif", textAlign: "center" }}>Add Image Here</p>
                                    ) : (
                                        <Typography fontFamily="serif" textAlign="center">{image.name}</Typography>
                                    )}
                                </Box>
                                {image && (
                                    <IconButton onClick={() => setImage(null)} sx={{ marginRight: "0.5rem" }}>
                                        <DeleteOutline fontSize='large' />
                                    </IconButton>
                                )}
                            </Flexbetween>
                        )}
                    </Dropzone>
                </Box>
            )}

            <Divider sx={{ margin: "1.25rem 0" }} />

            <Flexbetween>
                <Flexbetween gap="0.25rem" onClick={() => setPicture((img) => !img)}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography fontFamily="serif" sx={{ color: mediumMain, cursor: "pointer" }}>Image</Typography>
                </Flexbetween>

                {isNonMobile && (
                    <>
                        <Tooltip title="Updated soon">
                            <Flexbetween gap="0.25rem">
                                <GifBoxOutlined sx={{ color: mediumMain }} />
                                <Typography fontFamily="serif" color={mediumMain}>Clip</Typography>
                            </Flexbetween>
                        </Tooltip>

                        <Tooltip title="Updated soon">
                            <Flexbetween gap="0.25rem">
                                <AttachFileOutlined sx={{ color: mediumMain }} />
                                <Typography fontFamily="serif" color={mediumMain}>Attachment</Typography>
                            </Flexbetween>
                        </Tooltip>

                        <Tooltip title="Updated soon">
                            <Flexbetween gap="0.25rem">
                                <MicOutlined sx={{ color: mediumMain }} />
                                <Typography fontFamily="serif" color={mediumMain}>Audio</Typography>
                            </Flexbetween>
                        </Tooltip>
                    </>
                )}

                <Button disabled={!description}
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: "blueviolet",
                        borderRadius: "3rem",
                        fontFamily: "serif",
                        fontWeight: "600",
                        ":hover": { backgroundColor: "blueviolet" }
                    }}>
                    POST
                </Button>
            </Flexbetween>
        </WidgetWrapper>
    )
}


export default MyPostWidget