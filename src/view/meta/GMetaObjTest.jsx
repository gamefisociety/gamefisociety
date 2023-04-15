import React, { forwardRef, useImperativeHandle } from 'react';

import {
    HemisphericLight,
    Vector3,
    Color3,
    SceneLoader,
    StandardMaterial,
    Texture,
} from '@babylonjs/core'

import {
    OBJFileLoader
} from '@babylonjs/loaders';

// console.log('OBJFileLoader', OBJFileLoader);

const GMetaObjTest = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => (
        {
            init: (scene) => {
                // OBJFileLoader.loadAsync()
                // SceneLoader.ImportMesh("", Assets.meshes.aerobatic_plane.rootUrl, Assets.meshes.aerobatic_plane.filename, scene, function (meshes) {
                //     console.log('SceneLoader.ImportMesh ', meshes);
                //     // scene.createDefaultCameraOrLight(true, true, true);
                //     // scene.createDefaultEnvironment();
                // });
                // onSuccess = null, onProgress = null, onError = null, pluginExtension = null
                SceneLoader.ImportMesh("", 'asset/model/obj01/', 'cup_ferris.obj', scene, (meshes) => {
                    // let mesh = meshes[0];
                    // mesh.showBoundingBox = true;
                    // mesh.scaling.x = 100;
                    // mesh.scaling.y = 100;
                    // mesh.scaling.z = 100;
                    // var mat = new StandardMaterial("mat1", scene);
                    // mat.alpha = 1.0;
                    // mat.diffuseColor = new Color3(1.0, 1.0, 1.0);
                    // var texture = new Texture("https://i.postimg.cc/Vkj3nYx2/LOGO512-2.png", scene);
                    // mat.diffuseTexture = texture;
                    // // mat.emissiveTexture = texture;
                    // mesh.material = mat;
                    console.log('SceneLoader.ImportMesh', meshes, scene);
                    // scene.createDefaultCameraOrLight(true, true, true);
                    // scene.createDefaultEnvironment();
                });
            },
            render: (dt, scene) => {
                // console.log('GMetaLight render');
            }
        }
    ));

    return null;
});

export default GMetaObjTest;
