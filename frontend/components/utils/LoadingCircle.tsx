import {Box, CircularProgress} from "@mui/material";
import React from "react";

const LoadingCircle = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress sx={{margin: 'auto'}} />
        </Box>
    )
}

export default LoadingCircle;
