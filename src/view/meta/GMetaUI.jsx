import React, { useEffect, useRef, createRef } from 'react';
import './GMetaUI.scss';

import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";

const GMetaUI = () => {
    const navigate = useNavigate();

    const renderUser = () => {
        return null;
    }

    return (
        <Box className={'meta_ui'}>
            <Box className={'bt_back'} onClick={() => {
                navigate('/home');
            }} />
            {renderUser()}
        </Box>
    );
}

export default React.memo(GMetaUI);