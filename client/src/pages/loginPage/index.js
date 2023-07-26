import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import Form from './Form';

function AuthPage() {

    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { palette } = useTheme();

    return (
        <Box>
            <Box p="1rem 6%" textAlign="center" backgroundColor={palette.background.alt}>
                <Typography fontFamily="serif" fontWeight="bold" fontSize={32} color="deepskyblue">
                    Placement Helper
                </Typography>
            </Box>

            <Box m={isNonMobileScreens ? "1rem 20%" : "0.5rem 5%"} p="1rem 5%" textAlign="center" backgroundColor={palette.background.alt} borderRadius={6}>
                <Typography fontFamily="serif" fontWeight="bold" fontSize={15} color="deepskyblue">
                    Currently, I am facing challenges in obtaining free SSL certificates, which has resulted in the unavailability of secure connections. Consequently, after logging in, you may have noticed that your profile image is not visible due to the use of insecure URLs.
                </Typography>
            </Box>

            <Box width={isNonMobileScreens ? "50%" : "90%"}
                backgroundColor={palette.background.alt}
                p="2rem" m="2rem auto" borderRadius="1.5rem">
                <Typography
                    fontWeight="400" variant="h4" textAlign="center"
                    fontFamily="serif" sx={{ mb: "1.5rem" }}
                >Welcome to placement helper</Typography>
                <Form />
            </Box>
        </Box>
    )
}

export default AuthPage;