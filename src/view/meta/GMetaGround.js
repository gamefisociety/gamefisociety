import React, { useEffect, useState } from 'react';
import {
    useClick,
    useHover,
} from 'react-babylonjs'

import {
    Engine,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    Scene,
    Vector3,
} from '@babylonjs/core'

export const createGround = (scene) => {
    MeshBuilder.CreateGround('ground', { width: 1000, height: 1000 }, scene);
};
