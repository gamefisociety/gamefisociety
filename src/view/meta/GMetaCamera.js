import {
    ArcRotateCamera,
    Vector3,
} from '@babylonjs/core'

export const createCamera = (scene) => {

    var camera = new ArcRotateCamera("camera-main", Math.PI/3, Math.PI/3, 100, Vector3.Zero(), scene);;
    camera.setTarget(Vector3.Zero());
    //
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
};
