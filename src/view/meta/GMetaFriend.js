import {
    MeshBuilder,
    Vector3,
    Color3,
    StandardMaterial,
    Texture,
} from '@babylonjs/core'

import {
    AdvancedDynamicTexture,
} from '@babylonjs/gui'

let box = null;
let curScene = null;
let followers_gui = null;
let followers_ent_map = new Map();

export const createFriends = (scene) => {
    console.log('createFriends', scene);
    box = MeshBuilder.CreateBox('box', { size: 10 }, scene);
    box.position.y = 200;
    curScene = scene;

    var mat = new StandardMaterial("mat1", scene);
    mat.alpha = 1.0;
    mat.diffuseColor = new Color3(1.0, 1.0, 1.0);
    var texture = new Texture("https://i.postimg.cc/Vkj3nYx2/LOGO512-2.png", scene);
    mat.diffuseTexture = texture;
    box.material = mat;
    //
    followers_gui = AdvancedDynamicTexture.CreateFullscreenUI('ui_followers');

};

export const updateFriends = (dt, scene) => {
    if (box !== undefined) {
        const rpm = 10;
        box.rotation.y += (rpm / 60) * Math.PI * 2 * (dt / 1000);
    }
    // followers_ent_map.forEach()
};

export const addFriends = (follows) => {
    if (!curScene || !follows) {
        return;
    }

    var mat = new StandardMaterial("mat1", curScene);
    mat.alpha = 1.0;
    mat.diffuseColor = new Color3(1.0, 1.0, 1.0);
    var texture = new Texture("https://i.postimg.cc/Vkj3nYx2/LOGO512-2.png", curScene);
    mat.diffuseTexture = texture;
    //
    follows.map((info, index) => {
        console.log('follows info-', index, info);
        let ent_name = 'follower-ent-' + info;
        let cur_ent = MeshBuilder.CreateBox(ent_name, { size: 5 }, curScene);
        let rad = 300;
        cur_ent.position.y = 200 + (Math.random() - 0.5) * rad;
        cur_ent.position.x = (Math.random() - 0.5) * rad;
        cur_ent.position.z = (Math.random() - 0.5) * rad;
        //
        cur_ent.material = mat;
        //
        followers_ent_map.set(ent_name, cur_ent);
    });
};

