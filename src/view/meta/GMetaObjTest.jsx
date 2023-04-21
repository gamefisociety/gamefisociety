import React, { forwardRef, useImperativeHandle } from 'react';

import {
    SceneLoader,
} from '@babylonjs/core'

import {
    OBJFileLoader
} from '@babylonjs/loaders';

import getFlatShader from './shader/flat';
// console.log('OBJFileLoader', OBJFileLoader);

const GMetaObjTest = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => (
        {
            init: (scene) => {

                let flagShader = getFlatShader(scene);

                SceneLoader.ImportMesh("", "https://storage.fleek.zone/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/scene/", "scene01.glb", scene, (meshes) => {
                    console.log('SceneLoader.ImportMesh', meshes);
                    meshes.map((item) => {
                        // console.log('SceneLoader.ImportMesh', item.name);
                        // if (item) {
                        //     item.material = flagShader;
                        //     // item.convertToFlatShadedMesh();
                        // }
                    });
                    // //
                    // for (var mat of scene.materials) {
                    //     if (mat.albedoColor) {
                    //         mat.originalAlbedo = mat.albedoColor.clone();
                    //         mat.unlit = true;
                    //     }
                    // }
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
