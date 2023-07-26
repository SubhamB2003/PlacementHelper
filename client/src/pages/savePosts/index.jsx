import { Box, useMediaQuery } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import MyPostWidget from '../../widgets/MyPostWidget';
import PostWidget from '../../widgets/PostWidget';
import UserWidget from '../../widgets/UserWidget';
import Navbar from '../Navbar';

function SavePosts() {

    const user = useSelector((state) => state.user);
    const saveposts = useSelector((state) => state.user.savePosts);
    const posts = useSelector((state) => state.posts);
    const isNonMobile = useMediaQuery("(min-width: 1000px)");


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
                    {posts.map((post) => (
                        saveposts.map((savepost) => (
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