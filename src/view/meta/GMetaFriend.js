import React, { useEffect, useState, useCallback, useRef, forwardRef } from 'react';
import { useSelector, useDispatch } from "react-redux";

import {
    MeshBuilder,
    ArcFollowCamera,
    Vector3,
} from '@babylonjs/core'

let box = null;
let curScene = null;
export const createFriends = (scene) => {
    console.log('createFriends', scene);
    box = MeshBuilder.CreateBox('box', { size: 10 }, scene);
    box.position.y = 200;
    curScene = scene;
};

export const updateFriends = (dt, scene) => {
    if (box !== undefined) {
        const rpm = 10;
        box.rotation.y += (rpm / 60) * Math.PI * 2 * (dt / 1000);
    }
};

export const addFriends = (follows) => {
    if (!curScene || !follows) {
        return;
    }
    follows.map((info, index) => {
        console.log('follows info-', index, info);
        let ent_name = 'ent-' + info;
        let cur_ent = MeshBuilder.CreateBox(ent_name, { size: 10 }, curScene);
        let rad = 400;
        cur_ent.position.y = 200 + (Math.random() - 0.5) * rad;
        cur_ent.position.x = (Math.random() - 0.5) * rad;
        cur_ent.position.z = (Math.random() - 0.5) * rad;
    });
};

