import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import {
    Engine,
    Scene,
    useBeforeRender,
    useClick,
    useHover,
} from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'


import GMetaCamera from 'view/meta/GMetaCamera';
import GMetaFriend from 'view/meta/GMetaFriend';
import GMetaGround from 'view/meta/GMetaGround';

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

    const sceneRef = useRef(null);
    console.log('sceneRef', sceneRef);

    useEffect(() => {
        return () => {
        }
    }, [])

    useBeforeRender((scene) => {
        console.log('sceneRef render', scene);
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
                <Scene ref={sceneRef} clearColor={Color3.FromHexString('#000000') }>
                    <GMetaCamera></GMetaCamera>
                    <GMetaGround sc={sceneRef} ></GMetaGround>
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