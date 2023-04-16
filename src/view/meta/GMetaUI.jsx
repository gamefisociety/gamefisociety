import React, { useEffect, useRef, createRef } from 'react';
import './GMetaUI.scss';

import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";

const GMetaUI = () => {

    const navigate = useNavigate();

    return (
        <Box className={'meta_ui'}>
            <Box className={'bt_back'} onClick={() => {
                navigate('/home');
            }}></Box>
        </Box>
    );
}

export default React.memo(GMetaUI);