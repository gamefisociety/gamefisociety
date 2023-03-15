import { React, useEffect, useState, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import './GFTWallet.scss';

import ic_avatar from "../../asset/image/logo/ic_avatar.png";

function GFTWallet() {

    const [value, setValue] = useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        return () => {

        }
    }, [])

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            padding: '48px',
            width: "100%",
            backgroundColor: "background.paper",
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: 'auto',
            }}>
                <Box sx={{
                    position: "relative",
                    width: "68px",
                    height: '68px',
                }}>
                    <Avatar
                        sx={{ width: "68px", height: "68px" }}
                        src={ic_avatar}
                    />
                    <Typography
                        sx={{
                            position: "absolute",
                            bottom: "0px",
                            right: '0px',
                            left: '0px',
                            with: '68px',
                            height: '20px',
                            backgroundColor: "#1C1C1E",
                        }}
                        color="#ffffffff"
                        variant={'subtitle2'}
                        align={'center'}>
                        edit
                    </Typography>
                </Box >
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "auto",

                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "colum",
                        width: "100%",
                        height: 'auto',
                    }}>
                        <Typography
                            sx={{
                                marginLeft: '16px',
                                with: '68px',
                                height: '20px',
                                fontSize: '14px',
                                backgroundColor: "#1C1C1E",
                            }}
                            color="#ffffffff"
                            variant={'subtitle2'}
                            align={'center'}>
                            0x3e53cd6288decc43fc1ebd9f6b404eaddbb59a1e
                        </Typography>

                    </Box>
                </Box>
            </Box>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext

                    value={value}>
                    <Box sx={{ marginTop: '56px', borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                            textColor="inherit"
                            indicatorColor="secondary"
                            onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Portfolio" value="1" />
                            <Tab label="NFTs" value="2" />
                            <Tab label="History" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">Item One</TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                    <TabPanel value="3">Item Three</TabPanel>
                </TabContext>
            </Box>
        </Box>
    );

}

export default GFTWallet;