import React, { forwardRef, useImperativeHandle } from 'react';

import {
    HemisphericLight,
    Vector3,
} from '@babylonjs/core'

const GMetaLight = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => (
        {
            init: (scene) => {
                var light = new HemisphericLight('light', new Vector3(1, 1, 1), scene);
                light.intensity = 0.7;
            },
            render: (dt, scene) => {
                // console.log('GMetaLight render');
            }
        }
    ));

    return null;
});

export default GMetaLight;
