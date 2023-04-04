import React, { forwardRef, useImperativeHandle } from 'react';

import {
    HemisphericLight,
    Vector3,
} from '@babylonjs/core'

import { GridMaterial } from '@babylonjs/materials/grid';
import { SkyMaterial } from '@babylonjs/materials/sky';

const GMetaLight = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => (
        {
            init: (scene) => {
                console.log('GMetaLight init');
                //
                var light = new HemisphericLight('light', new Vector3(1, 1, 1), scene);
                light.intensity = 0.7;
            },
            render: (scene) => {
                // console.log('GMetaLight render');
            }
        }
    ));

    return null;
});

export default GMetaLight;
