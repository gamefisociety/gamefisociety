import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import GMetaBase from './GMetaBase';
import {
    HemisphericLight,
    MeshBuilder,
    Vector3,
} from '@babylonjs/core'

import { createCamera } from 'view/meta/GMetaCamera';
import { createGround } from 'view/meta/GMetaGround';
import GMetaFriend from 'view/meta/GMetaFriend';

import './GFTHomeMeta.scss';

const GFTHomeMeta = () => {

    // const { follows } = useSelector((s) => s.profile);

    let box
    const onSceneReady = (scene) => {
        createCamera(scene);
        var light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        box = MeshBuilder.CreateBox('box', { size: 10 }, scene);
        box.position.y = 200;
        //
        createGround(scene);
    }
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
    const onRender = (scene) => {
        if (box !== undefined) {
            var deltaTimeInMillis = scene.getEngine().getDeltaTime();
            const rpm = 10;
            box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
        }
    }

    return (<GMetaBase
        canvasId="babylon-canvas"
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
    />);
}

export default  React.memo(GFTHomeMeta);