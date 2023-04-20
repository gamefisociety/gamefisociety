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
                //"scenes/BrainStem/", "BrainStem.gltf"
                // https://storage.fleek.zone/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/scene/scene01.glb
                SceneLoader.ImportMesh("", "https://storage.fleek.zone/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/scene/", "scene01.glb", scene, (meshes) => {
                    meshes.map((item) => {
                        if (item) {
                            item.convertToFlatShadedMesh();
                        }
                    });
                    //
                    for (var mat of scene.materials) {
                        if (mat.albedoColor) {
                            mat.originalAlbedo = mat.albedoColor.clone();
                            mat.unlit = true;
                        }
                    }
                    console.log('SceneLoader.ImportMesh', meshes, scene);
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
