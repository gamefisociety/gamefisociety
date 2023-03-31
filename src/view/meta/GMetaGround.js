
import {
    MeshBuilder,
    Vector3,
    Color3,
    Scene
} from '@babylonjs/core';

import { GridMaterial } from '@babylonjs/materials/grid';
import { SkyMaterial } from '@babylonjs/materials/sky';

export const createGround = (scene) => {

    // scene.fogMode = Scene.FOGMODE_LINEAR;
    // //BABYLON.Scene.FOGMODE_NONE;
    // //BABYLON.Scene.FOGMODE_EXP;
    // //BABYLON.Scene.FOGMODE_EXP2;
    // //BABYLON.Scene.FOGMODE_LINEAR;
    // scene.fogColor = new Color3(1.0, 1.0, 1.0);
    // scene.fogDensity = 0.001;


    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.turbidity = 20;
    skyMaterial.luminance = 0.1;
    skyMaterial.inclination = 0.5;
    skyMaterial.azimuth = 0.5;
    skyMaterial.rayleigh = 1;
    skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
    skyMaterial.sunPosition = new Vector3(0, 100, 0);
    //
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 5000.0 }, scene);
    skybox.material = skyMaterial;

    const ground = MeshBuilder.CreateGround('ground', { width: 2000, height: 2000 }, scene);
    ground.material = new GridMaterial("groundMat");
    ground.material.backFaceCulling = false;
    ground.material.gridRatio = 10;
};
