import React, { forwardRef, useImperativeHandle } from 'react';

import {
    HemisphericLight,
    Vector3,
    Color3,
} from '@babylonjs/core'

const GMetaLight = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => (
        {
            init: (scene) => {
                var light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
                light.intensity = 1.5;
                light.diffuse = new Color3(1, 1, 1);
                light.specular = new Color3(1, 1, 1);
                light.groundColor = new Color3(1, 1, 1);
                // light.groundColor = new Color3(0.95, 0.95, 0.95);
            },
            render: (dt, scene) => {
                // console.log('GMetaLight render');
            }
        }
    ));

    return null;
});

export default GMetaLight;
