/* eslint-disable react-hooks/exhaustive-deps */
import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MyPostWidget from '../../widgets/MyPostWidget';
import PostsWidget from '../../widgets/PostsWidget';
import UserWidget from '../../widgets/UserWidget';
import Navbar from '../Navbar';


function ProfilePage({ newUser = false }) {

    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const token = useSelector((state) => state.token);
    const isNonMobile = useMediaQuery("(min-width: 1000px)");


    const getUser = async () => {
        const res = await axios.get(`${process.env.REACT_APP_URL}/users/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            setUser(res.data);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <Box>
            <Navbar />
            <Box width="100%" padding="2rem 6%"
                display={isNonMobile ? "flex" : "block"}
                gap="2rem" justifyContent="center"
            >
                <Box flexBasis={isNonMobile && "28%"}>
                    <UserWidget user={user} />
                    <Box m="2rem 0" />
                </Box>

                <Box flexBasis={isNonMobile && "42%"} mt={!isNonMobile && "2rem"}>
                    <MyPostWidget />
                    <Box m="2rem 0" />
                    <PostsWidget userId={userId} isProfile />
                </Box>
            </Box>
        </Box>
    )
}

export default ProfilePage