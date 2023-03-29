
import {
    MeshBuilder,
} from '@babylonjs/core';

import { GridMaterial } from '@babylonjs/materials/grid';

export const createGround = (scene) => {
    const ground = MeshBuilder.CreateGround('ground', { width: 1000, height: 1000 }, scene);
    ground.material = new GridMaterial("groundMat");
    ground.material.backFaceCulling = false;
    ground.material.gridRatio = 10;
};
