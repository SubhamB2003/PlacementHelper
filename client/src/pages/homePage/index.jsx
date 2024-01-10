import { Box, useMediaQuery } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import AdvertWidget from '../../widgets/AdvertWidget';
import MyPostWidget from "../../widgets/MyPostWidget";
import PostsWidget from "../../widgets/PostsWidget";
import UserWidget from "../../widgets/UserWidget";
import Navbar from '../Navbar';



function HomePage() {

    const user = useSelector((state) => state.user);
    const userId = user._id;
    const isNonMobile = useMediaQuery("(min-width: 1100px)");

    return (
        <Box>
            <Navbar />
            <Box width="100%" padding="2rem 6%"
                display={isNonMobile ? "flex" : "block"}
                justifyContent="space-between">
                <Box flexBasis={isNonMobile && "28%"}>
                    <UserWidget user={user} />
                </Box>
                <Box flexBasis={isNonMobile && "40%"}
                    mt={!isNonMobile && "2rem"}>
                    <MyPostWidget />
                    <Box m="2rem 0" />
                    <PostsWidget userId={userId} />
                </Box>
                {isNonMobile && (
                    <Box flexBasis={isNonMobile && "28%"}>
                        <AdvertWidget />
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default HomePage;