
import {
    MeshBuilder,
    Vector3,
} from '@babylonjs/core';

import { GridMaterial } from '@babylonjs/materials/grid';
import { SkyMaterial } from '@babylonjs/materials/sky';

export const createGround = (scene) => {

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
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    skybox.material = skyMaterial;

    const ground = MeshBuilder.CreateGround('ground', { width: 1000, height: 1000 }, scene);
    ground.material = new GridMaterial("groundMat");
    ground.material.backFaceCulling = false;
    ground.material.gridRatio = 10;
};
