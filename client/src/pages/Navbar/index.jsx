import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setLogout, setMode } from "../../state/index";
import { useNavigate } from "react-router-dom";
import { DarkMode, InfoOutlined, LightMode, LogoutOutlined, SaveOutlined, Search } from "@mui/icons-material";
import { Box, Divider, IconButton, InputBase, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import Flexbetween from "../../components/Flexbetween";
import UserImage from '../../components/UserImage';
import SearchWidget from '../../widgets/SearchWidget';


function Navbar() {

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const mode = useSelector((state) => state.mode);
    const isNonMobile = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const main = theme.palette.neutral.main;
    let timer;

    const handleMenu = () => {
        setOpen((toggle) => !toggle);
    };

    const handleChange = (e) => {
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            setQuery(e.target.value);
        }, 1000);
    }


    return (
        <Flexbetween padding="1rem 6%" backgroundColor={alt}>
            <Flexbetween>
                <Typography fontWeight="bold" fontFamily="serif"
                    color="primary"
                    fontSize={isNonMobile ?
                        "clamp(1rem, 2rem, 2.25rem)"
                        : "clamp(1rem, 1.5rem, 2.25rem)"}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}>
                    Placement Helper</Typography>
            </Flexbetween>

            {/* DESKTOP VIEW NAV */}
            <Flexbetween gap={isNonMobile ? "3rem" : "1rem"}>
                {isNonMobile && (
                    <Box>
                        <Flexbetween backgroundColor={neutralLight}
                            borderRadius="10px" gap="2rem" padding="0.3rem 1.2rem"
                            sx={{
                                "&:hover": {
                                    color: primaryLight,
                                    cursor: "pointer",
                                },
                                input: {
                                    fontFamily: "serif", fontSize: "18px"
                                }
                            }}>
                            <InputBase placeholder='Search users...' onChange={(e) => handleChange(e)} />
                            <Box display="flex" gap="1rem">
                                <IconButton>
                                    <Search />
                                </IconButton>
                                <IconButton>
                                    <Tooltip title='Search using username' placement='right'>
                                        <InfoOutlined />
                                    </Tooltip>
                                </IconButton>
                            </Box>
                        </Flexbetween>
                        <Box
                            position="absolute"
                            borderRadius="16px"
                            backgroundColor={neutralLight}
                            sx={{
                                vertical: 'top',
                                zIndex: "10",
                                marginTop: "5px"
                            }}>
                            <SearchWidget query={query} />
                        </Box>
                    </Box>
                )}
                <IconButton onClick={() => dispatch(setMode())} sx={{ marginRight: "20px" }}>
                    {mode === "light" ? (
                        <Tooltip title="Dark">
                            <DarkMode sx={{ fontSize: "30px" }} />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Light">
                            <LightMode sx={{ fontSize: "30px" }} />
                        </Tooltip>
                    )}
                </IconButton>

                <Box display="flex" justifyContent="center" sx={{ marginRight: "2rem" }}>
                    <Tooltip title="Open settings" placement="right">
                        <IconButton onClick={handleMenu} sx={{ p: 0, width: "10px" }}>
                            <UserImage width="40px" image={user.picturePath} size={55} />
                        </IconButton>
                    </Tooltip>
                    {open && (
                        <Box
                            position="absolute"
                            backgroundColor={neutralLight}
                            borderRadius="4px"
                            marginTop={7}
                            sx={{
                                vertical: 'top',
                            }}
                        >
                            <Box display="flex" padding="0.5rem" sx={{ cursor: "pointer" }}
                                onClick={() => navigate(`/user/saveposts`)}>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <SaveOutlined sx={{ fontSize: "18px", color: main }} />
                                </Box>
                                <Typography fontFamily="serif" fontSize="1rem" paddingLeft="0.4rem" color={main}>Save</Typography>
                            </Box>
                            <Divider />
                            <Box display="flex" padding="0.5rem" sx={{ cursor: "pointer" }}
                                onClick={() => dispatch(setLogout())}>
                                <LogoutOutlined sx={{ fontSize: "18px", color: main }} />
                                <Typography fontFamily="serif" fontSize="0.9rem" color={main}>Log Out</Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Flexbetween>
        </Flexbetween >
    )
}


export default Navbar

