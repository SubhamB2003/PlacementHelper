import { DeleteOutline, EditOutlined, MoreHoriz, SaveOutlined } from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPosts, setSavePosts, setUser } from '../state';
import { successSound } from "./Audios";
import Flexbetween from './Flexbetween';
import UserImage from './UserImage';



function Friend({ postUserId, name, createdAt, userPicturePath, postId, updatePostData, description }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user._id);
    const [open, setOpen] = useState();
    const isSave = user.savePosts.includes(postId);

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const neutralLight = palette.neutral.light;


    const handlePostRemove = async (postId) => {
        const res = await axios.delete(`${process.env.REACT_APP_URL}/posts/${postId}/removepost`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const posts = res.data;
        dispatch(setPosts({ posts }));
        successSound();
    }

    const handleSavePost = async (postId) => {
        const res = await axios.patch(`${process.env.REACT_APP_URL}/users/${userId}/${postId}`);
        dispatch(setSavePosts(res.data));
        dispatch(setUser({ user: res.data }));
        successSound();
    }


    return (
        <Flexbetween>
            <Flexbetween gap="1rem" sx={{ cursor: "pointer" }}>
                <UserImage image={userPicturePath} size={55} />
                <Box onClick={() => {
                    navigate(`/profile/${postUserId}`);
                    navigate(0);
                }}>
                    <Typography color={main} fontFamily="serif" variant="h4">{name}</Typography>
                    <Typography color={medium} fontFamily="serif" fontSize="0.85rem">{new Date(createdAt).toLocaleString()}</Typography>
                </Box>
            </Flexbetween>
            <Box marginRight={1}>
                <Tooltip title="setting" placement='left'>
                    <IconButton onClick={() => setOpen((on) => !on)}>
                        <MoreHoriz fontSize="25px" />
                    </IconButton>
                </Tooltip>
                {open && (
                    <Box
                        position="absolute"
                        backgroundColor={neutralLight}
                        borderRadius="4px"
                        sx={{
                            vertical: 'top',
                        }}
                    >
                        {postUserId === userId && (
                            <>
                                <Box display="flex" justifyItems="center" padding="0.5rem 0.6rem" sx={{ cursor: "pointer" }}
                                    onClick={() => updatePostData(postId, description)}>
                                    <EditOutlined fontSize="small" sx={{ marginRight: "10px", color: main }} />
                                    <Typography fontFamily="serif" fontWeight="500" fontSize="0.9rem" color={main}>Edit</Typography>
                                </Box>

                                <Divider />

                                <Box display="flex" justifyItems="center" padding="0.5rem 0.6rem" sx={{ cursor: "pointer" }}
                                    onClick={() => handlePostRemove(postId)}>
                                    <DeleteOutline fontSize="small" sx={{ marginRight: "10px", color: main }} />
                                    <Typography fontFamily="serif" fontWeight="500" fontSize="0.9rem" color={main}>Delete</Typography>
                                </Box>
                            </>
                        )}
                        {postUserId !== userId && (
                            <Box display="flex" justifyItems="center" padding="0.6rem 0.6rem" sx={{ cursor: "pointer" }}
                                onClick={() => handleSavePost(postId)}>
                                <SaveOutlined fontSize="small" sx={{ marginRight: "10px", color: main }} />
                                <Typography fontFamily="serif" fontWeight="500" fontSize="0.9rem" color={main}>
                                    {isSave ? "Unsave" : "Save"}
                                </Typography>
                            </Box>
                        )}
                    </Box >
                )
                }
            </Box >
        </Flexbetween >
    )
}

export default Friend