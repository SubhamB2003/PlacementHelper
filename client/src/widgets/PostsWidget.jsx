/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Box, Divider, Tooltip, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, setSortOrder, setUserSortOrder } from '../state';
import PostWidget from './PostWidget';

function PostsWidget({ userId, isProfile = false }) {

    const { palette } = useTheme();
    const main = palette.neutral.main;

    const dispatch = useDispatch();
    let posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);
    const sortOrder = useSelector((state) => state.sortOrder);
    const userSortOrder = useSelector((state) => state.userSortOrder);

    const getPosts = async () => {
        const res = await axios.get(`${process.env.REACT_APP_URL}/posts/${sortOrder}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            const Data = res.data;
            dispatch(setPosts({ posts: Data }));
            dispatch(setSortOrder());
        }
    };

    const getUserPosts = async () => {
        const res = await axios.get(`${process.env.REACT_APP_URL}/posts/${userSortOrder}/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            const Data = res.data;
            dispatch(setPosts({ posts: Data }));
            dispatch(setUserSortOrder());
        }
    }


    useEffect(() => {
        if (isProfile) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, []);

    return (
        <Box>
            <Box m="1rem 0" display="flex" justifyContent="space-between" alignItems="center">
                <Divider sx={{ width: "90%" }} />
                <Tooltip title={isProfile ? userSortOrder === "ASCENDING" ? "DESCENDING" : "ASCENDING"
                    : sortOrder === "ASCENDING" ? "DESCENDING" : "ASCENDING"} placement='left'>
                    <Box display="flex" alignItems="center" sx={{ cursor: "pointer" }} onClick={() => isProfile ? getUserPosts() : getPosts()}>
                        {isProfile ? userSortOrder === "ASCENDING" ? <ArrowDownward fontSize='small' mx="0.8rem" /> : <ArrowUpward fontSize='small' mx="0.8rem" />
                            : sortOrder === "ASCENDING" ? <ArrowDownward fontSize='small' mx="0.8rem" /> : <ArrowUpward fontSize='small' mx="0.8rem" />}
                        <Typography fontFamily="serif" fontSize="1rem" color={main}>Sort</Typography>
                    </Box>
                </Tooltip>
            </Box>
            {posts?.map((post) => (
                <PostWidget key={post._id} post={post} />
            ))}
        </Box>
    )
}

export default PostsWidget