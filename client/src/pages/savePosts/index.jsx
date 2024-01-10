/* eslint-disable react-hooks/exhaustive-deps */
import { Box, useMediaQuery } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../state';
import MyPostWidget from '../../widgets/MyPostWidget';
import PostWidget from '../../widgets/PostWidget';
import UserWidget from '../../widgets/UserWidget';
import Navbar from '../Navbar';

function SavePosts() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);
    const saveposts = useSelector((state) => state.user.savePosts);

    const isNonMobile = useMediaQuery("(min-width: 1000px)");

    const getAllPosts = async () => {
        const res = await axios.get(`${process.env.REACT_APP_URL}/posts`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            dispatch(setPosts({ posts: res.data }))
        }
    }

    useEffect(() => {
        getAllPosts();
    }, [])

    return (
        <Box>
            <Navbar />
            <Box width="100%" padding="2rem 6%"
                display={isNonMobile ? "flex" : "block"}
                gap="2rem" justifyContent="center"
            >
                <Box flexBasis={isNonMobile && "26%"}>
                    <UserWidget user={user} />
                    <Box m="2rem 0" />
                </Box>

                <Box flexBasis={isNonMobile && "38%"}
                    mt={!isNonMobile && "2rem"}
                >
                    <MyPostWidget />
                    <Box m="2rem 0" />
                    {posts?.map((post) => (
                        saveposts?.map((savepost) => (
                            post._id === savepost && (
                                <PostWidget key={post._id} post={post} />
                            )
                        ))
                    ))}
                </Box>
            </Box>
        </Box >
    )
}

export default SavePosts;