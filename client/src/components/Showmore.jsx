import { useTheme } from '@emotion/react';
import { Typography } from '@mui/material';
import React, { useState } from 'react';


function Readmore({ children, fontSize = 17, mt }) {

    let text = children;
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => { setIsReadMore(!isReadMore) };

    return (
        <Typography sx={{ mt: `${mt === 0 ? "0" : "1rem"}`, padding: "4px" }} fontFamily='serif' fontSize={fontSize} color={main}>
            {isReadMore ? text.slice(0, 200) : text}
            {text.length > 200 &&
                <span style={{ fontSize: "1rem", cursor: "pointer", color: { main }, fontWeight: "600" }} onClick={toggleReadMore}>
                    {isReadMore ? ' ...read more' : ' ...read less'}
                </span>
            }
        </Typography>
    );
};


export default Readmore;