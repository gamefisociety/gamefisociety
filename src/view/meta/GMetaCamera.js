import {
    ArcRotateCamera,
    ArcFollowCamera,
    Vector3,
} from '@babylonjs/core'

export const createCamera = (scene) => {

    var camera = new ArcRotateCamera("camera-main", Math.PI / 3, Math.PI / 3, 500, new Vector3(0, 100, 0), scene);
    camera.setTarget(new Vector3(0, 100, 0));
    // var camera = new ArcFollowCamera("camera-main", Math.PI / 3, Math.PI / 3, 200, new Vector3(0, 100, 0), scene);
    camera.minZ = 0.1;
    camera.maxZ = 5000;
    //
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
};
