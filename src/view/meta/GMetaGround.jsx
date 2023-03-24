import React, { useEffect, useState } from 'react';
import {
    useClick,
    useHover,
} from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'

const GMetaGround = (props) => {
    //
    const { sc } = props;

    useEffect(() => {
        console.log('enter ground', sc);
        return () => {
        }
    }, [props])

    return <ground
        name={'ground'}
        width={1000}
        height={1000}
        subdivisions={100}
    >
        <standardMaterial
            name={'ground-mat'}
            diffuseColor={Color3.White()}
            specularColor={Color3.Black()}
            wireframe={true}
        />
    </ground>;
}

export default React.memo(GMetaGround);