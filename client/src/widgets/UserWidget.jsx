/* eslint-disable react-hooks/exhaustive-deps */
import {
    EmailOutlined, Facebook, FemaleOutlined, GitHub, Instagram, LinkedIn, LocationOnOutlined, MaleOutlined, ManageAccountsOutlined,
    Person2Outlined,
    PhoneAndroidOutlined, SchoolOutlined, TransgenderOutlined
} from '@mui/icons-material';
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Flexbetween from '../components/Flexbetween';
import UserImage from "../components/UserImage";
import WidgetWrapper from "../components/WidgetWrapper";

function UserWidget({ user }) {

    const navigate = useNavigate();
    const userId = useSelector((state) => state.user._id);

    const { palette } = useTheme();
    const main = palette.neutral.main;
    if (!user) return null;

    const char = user.userName.charAt(0).toUpperCase();
    const name = char + user.userName.substring(1, user.userName.length);


    return (
        <WidgetWrapper>
            <Flexbetween
                gap="0.5rem"
                pb="1.1rem">
                <Flexbetween gap="1rem" sx={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${user._id}`)}>
                    <UserImage image={user.picturePath} size={60} dpZoom />
                    <Box>
                        <Typography variant='h4' fontWeight="500" fontFamily="serif" color={main}>{name}</Typography>
                        <Typography variant='h6' fontWeight="500" fontFamily="serif" color={main}>{user.profession}</Typography>
                    </Box>
                </Flexbetween>
                {userId === user._id && (
                    <Tooltip title="Edit">
                        <IconButton onClick={() => navigate("/profile/update")}>
                            <ManageAccountsOutlined />
                        </IconButton>
                    </Tooltip>
                )}
            </Flexbetween>

            <Divider />

            <Box p="1rem 0">
                <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                    <EmailOutlined fontSize='medium' sx={{ color: main }} />
                    <Typography variant='h5' fontWeight="500" fontFamily="serif" color={main} >{user.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                    <PhoneAndroidOutlined fontSize='medium' sx={{ color: main }} />
                    <Typography variant='h5' fontWeight="500" fontFamily="serif" color={main}>{user.phoneNo}</Typography>
                </Box>
            </Box>

            <Divider />

            <Box p="1rem 0">
                <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                    <LocationOnOutlined fontSize='medium' sx={{ color: main }} />
                    <Typography variant='h5' fontWeight="500" fontFamily="serif" color={main}>{user.location}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                    {user.gender.toUpperCase() === "MALE" ? <MaleOutlined fontSize='medium' sx={{ color: main }} />
                        : user.gender.toUpperCase() === "FEMALE" ? <FemaleOutlined fontSize='medium' sx={{ color: main }} /> : <TransgenderOutlined fontSize='medium' sx={{ color: main }} />}
                    <Typography variant='h5' fontWeight="500" fontFamily="serif" color={main}>{user.gender}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                    <SchoolOutlined fontSize='medium' sx={{ color: main }} />
                    <Typography variant='h5' fontWeight="500" fontFamily="serif" color={main}>{user.graduateYear}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                    <Person2Outlined fontSize='medium' sx={{ color: main }} />
                    <Typography variant='h5' fontWeight="500" fontFamily="serif" color={main}>{user.about}</Typography>
                </Box>
            </Box>

            <Divider />

            <Flexbetween p="0.8rem 0.5rem">
                <Box sx={{ cursor: "pointer" }}>
                    <a href={user.facebookId} target="_blank" rel="noreferrer">
                        <Facebook sx={{
                            fontSize: "1.6rem",
                            color: main,
                            "&:hover": {
                                fill: "#2563eb"
                            }
                        }} />
                    </a>
                </Box>
                <Box>
                    <a href={user.instagramId} target="_blank" rel="noreferrer">
                        <Instagram sx={{
                            fontSize: "1.6rem",
                            color: main,
                            "&:hover": {
                                fill: "#9d174d"
                            }
                        }} />
                    </a>
                </Box>
                <Box>
                    <a href={user.linkedinId} target="_blank" rel="noreferrer">
                        <LinkedIn sx={{
                            fontSize: "1.6rem",
                            color: main,
                            "&:hover": {
                                fill: "#0891b2"
                            }
                        }} />
                    </a>
                </Box>
                <Box>
                    <a href={user.githubId} target="_blank" rel="noreferrer">
                        <GitHub sx={{
                            fontSize: "1.6rem",
                            color: main,
                            "&:hover": {
                                fill: "#000"
                            }
                        }} />
                    </a>
                </Box>
            </Flexbetween>

        </WidgetWrapper>
    )
}

export default UserWidget