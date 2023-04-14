import React, { forwardRef, useImperativeHandle } from 'react';
import {
    ArcRotateCamera,
    ArcFollowCamera,
    Vector3,
} from '@babylonjs/core'

export const createCamera = (scene) => {

    var camera = new ArcRotateCamera("camera-main", Math.PI / 3, Math.PI / 3, 500, new Vector3(0, 0, 0), scene);
    camera.setTarget(new Vector3(0, 0, 0));
    // var camera = new ArcFollowCamera("camera-main", Math.PI / 3, Math.PI / 3, 200, new Vector3(0, 100, 0), scene);
    // camera.minZ = 0.1;
    // camera.maxZ = 5000;
    //
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
};

const GMetaCamera = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => (
        {
            init: (scene) => {
                console.log('GMetaGround init');
                createCamera(scene);

            },
            render: (dt,scene) => {
                // console.log('GMetaGround render');
            }
        }
    ));

    return null;
});

export default GMetaCamera;
