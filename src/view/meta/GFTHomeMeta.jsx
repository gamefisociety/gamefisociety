import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import GMetaBase from './GMetaBase';
import './GFTHomeMeta.scss';

import {
    HemisphericLight,
    Vector3,
} from '@babylonjs/core'

import { createCamera } from 'view/meta/GMetaCamera';
import { createGround } from 'view/meta/GMetaGround';
import { createFriends, updateFriends, addFriends } from 'view/meta/GMetaFriend';

const GFTHomeMeta = () => {

    const { follows } = useSelector((s) => s.profile);

    const friendRef = useRef(null);
    console.log('onSceneReady', friendRef);

    const onSceneReady = (scene) => {
        // console.log('onSceneReady friends', friendRef);
        createCamera(scene);
        //
        var light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        //
        createGround(scene);
        //
        createFriends(scene);
    }

    const onRender = (scene) => {
        let dt = scene.getEngine().getDeltaTime();
        updateFriends(dt, scene);
    }

    useEffect(() => {
        addFriends(follows);
    }, [follows]);

    return <GMetaBase
        canvasId="babylon-canvas"
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
    />
}

export default React.memo(GFTHomeMeta);