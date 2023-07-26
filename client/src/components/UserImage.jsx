import { Box, Modal, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';

function UserImage({ image, size, dpZoom = false }) {

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const isNonMobile = useMediaQuery("(min-width: 1000px)");

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 500, height: 500, boxShadow: 24, p: 4, bgcolor: 'background.paper',
                }}>
                    <img style={{
                        objectFit: "cover", borderRadius: "50%", marginLeft: `${!isNonMobile && "10vw"}`,
                        marginTop: `${!isNonMobile && "4.8vh"}`
                    }} width={isNonMobile ? "100%" : "80%"} height={isNonMobile ? "100%" : "80%"}
                        src={`${process.env.REACT_APP_URL}/assets/${image}`} alt="user" />
                </Box>
            </Modal>

            <Box width={size} height={size} onClick={() => dpZoom && setOpen((on) => !on)}>
                <img style={{ objectFit: "cover", borderRadius: "50%" }}
                    width={size} height={size}
                    src={`${process.env.REACT_APP_URL}/assets/${image}`} alt="user" />
            </Box>
        </>
    )
}

export default UserImage