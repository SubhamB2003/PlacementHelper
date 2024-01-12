import { CloseOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Modal, TextField, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../state';
import { successSound } from './Audios';
import Flexbetween from './Flexbetween';

function ModelPopup({ setOpenModal, openModal, postId, desc, setDesc, cmtId, comment, setComment, isComment = false }) {

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const userId = useSelector((state) => state.user._id);

    const handlePostUpdate = async () => {
        const singlePost = await axios.patch(`${process.env.REACT_APP_URL}/posts/post`, { postId, desc }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (singlePost.status === 200) {
            successSound();
            const post = singlePost.data;
            setOpenModal(false);
            dispatch(setPost({ post }));
        }

    }

    const updatePostComment = async () => {
        const Data = { userId, postId, cmtId, comment };
        const res = await axios.patch(`${process.env.REACT_APP_URL}/posts/post/comment`, Data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            setOpenModal(false);
            const post = res.data;
            dispatch(setPost({ post }));
            successSound();
        }
    }


    const handleUpdateData = async (e) => {
        e.preventDefault();

        if (isComment) updatePostComment();
        else handlePostUpdate();
    }



    return (
        <>
            {openModal && (
                <Modal
                    open={openModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4,

                    }}>
                        <Flexbetween>
                            <Typography id="modal-modal-title" fontFamily="serif" fontSize={20} color={main}>{isComment ? "Comment Update" : "Post Update"}</Typography>
                            <IconButton onClick={() => setOpenModal(false)} sx={{
                                top: 'calc(-1/4 * var(--IconButton-size))',
                                right: 'calc(-1/4 * var(--IconButton-size))',
                                boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                                borderRadius: '50%',
                                bgcolor: 'background.body',
                            }}>
                                <CloseOutlined />
                            </IconButton>
                        </Flexbetween>
                        <form style={{ display: "grid", padding: "2rem 0.2rem", gap: "15px" }} onSubmit={handleUpdateData}>
                            {isComment ? (
                                <TextField label="Comment" name="comment" required
                                    autoComplete='off' onChange={(e) => setComment(e.target.value)}
                                    value={comment} sx={{
                                        gridColumn: "span 2", input: {
                                            fontSize: "18px",
                                            fontFamily: "serif",
                                            color: main
                                        }
                                    }} />
                            ) : (
                                <TextField label="Description" name="description" required
                                    autoComplete='off' onChange={(e) => setDesc(e.target.value)}
                                    value={desc} sx={{
                                        gridColumn: "span 2", input: {
                                            fontSize: "16px",
                                            fontFamily: "serif",
                                            color: main
                                        }
                                    }} />
                            )}

                            <Button sx={{ gridColumn: "span 2", fontFamily: "serif", fontSize: "16px" }} variant="outlined" type='submit'>
                                Update
                            </Button>
                        </form>
                    </Box>
                </Modal>
            )}
        </>
    )
}

export default ModelPopup;