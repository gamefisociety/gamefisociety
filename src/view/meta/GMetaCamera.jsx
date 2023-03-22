import React, { useEffect, useState, useRef } from 'react';
import {
    useClick,
    useHover,
    useBeforeRender,
    TransformNode
} from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'

const GMetaCamera = () => {

    const cameraRef = useRef(null)
    //
    useEffect(() => {
        // requsetData();
        // fetchAllNFTs();
        return () => {
        }
    }, [])

    useBeforeRender((scene) => {
        // if (boxRef.current) {
        //     // Delta time smoothes the animation.
        //     var deltaTimeInMillis = scene.getEngine().getDeltaTime()
        //     boxRef.current.rotation.y +=
        //         (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
        // }
    })

    return (
        <arcRotateCamera
            ref={cameraRef}
            name="camera1"
            target={Vector3.Zero()}
            alpha={Math.PI / 2}
            beta={Math.PI / 4}
            radius={8}
        />
    )
}

export default GMetaCamera;