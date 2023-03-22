import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";

import {
    Engine,
    Scene,
    useBeforeRender,
    useClick,
    useHover,
} from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import {
    getListData,
    getListChainData
} from 'api/requestData'
import { getALLAssetsForAccount } from '../../api/nftscan'
import FsLightbox from 'fslightbox-react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CardActions from '@mui/material/CardActions';

import GFTNewsView from './GFTNewsView'
import GBanner from 'view/head/GBanner';
//
import GMetaCamera from 'view/meta/GMetaCamera';
import GMetaFriend from 'view/meta/GMetaFriend';
import GMetaGround from 'view/meta/GMetaGround';

import ic_play_youtube from "asset/image/logo/ic_play_youtube.png"

import './GFTHomeMeta.scss';


const GFTHomeMeta = () => {

    const { follows } = useSelector((s) => s.profile);
    //
    console.log('follows1', follows);
    //
    const [videoList, setVideoList] = useState([]);
    const [chainList, setChainList] = useState([]);
    const [fsLightList, setFsLightList] = useState([]);

    const [toggler, setToggler] = useState(false);
    const [togSlide, setTogSlide] = useState(0);

    const navigate = useNavigate();

    const sceneRef = useRef(null)

    useEffect(() => {
        return () => {
        }
    }, [])

    useBeforeRender((scene) => {
        // if (boxRef.current) {
        //     // Delta time smoothes the animation.
        //     var deltaTimeInMillis = scene.getEngine().getDeltaTime()
        //     boxRef.current.rotation.y +=
        //         (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
        // }
    })


    return (
        <div className='meta_bg'>
            <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
                <Scene ref={sceneRef}>
                    <GMetaCamera></GMetaCamera>
                    <GMetaGround></GMetaGround>
                    {/* <arcRotateCamera
                        name="camera1"
                        target={Vector3.Zero()}
                        alpha={Math.PI / 2}
                        beta={Math.PI / 4}
                        radius={8}
                    /> */}
                    <hemisphericLight
                        name="light1"
                        intensity={0.7}
                        direction={Vector3.Up()}
                    />
                    <GMetaFriend follows={follows}></GMetaFriend>
                </Scene>
            </Engine>
        </div>)
}

export default GFTHomeMeta;