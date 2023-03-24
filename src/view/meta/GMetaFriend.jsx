import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";

import {
    useClick,
    useHover,
    useBeforeRender,
    TransformNode
} from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'

const DefaultScale = new Vector3(1, 1, 1)
const BiggerScale = new Vector3(1.25, 1.25, 1.25)

const SpinningBox = (props) => {
    // access Babylon scene objects with same React hook as regular DOM elements
    const boxRef = useRef(null)

    const [clicked, setClicked] = useState(false)
    useClick(() => setClicked((clicked) => !clicked), boxRef)

    const [hovered, setHovered] = useState(false)
    useHover(
        () => setHovered(true),
        () => setHovered(false),
        boxRef
    )

    // This will rotate the box on every Babylon frame.
    const rpm = 5
    useBeforeRender((scene) => {
        // if (boxRef.current) {
        //     // Delta time smoothes the animation.
        //     var deltaTimeInMillis = scene.getEngine().getDeltaTime()
        //     boxRef.current.rotation.y +=
        //         (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
        // }
    })

    return (
        <sphere
            name={props.name}
            ref={boxRef}
            diameter={5}
            position={props.position}
            scaling={clicked ? BiggerScale : DefaultScale}
        >
            <standardMaterial
                name={`${props.name}-mat`}
                diffuseColor={hovered ? props.hoveredColor : props.color}
                specularColor={Color3.Black()}
            />
        </sphere>
    )
}

const followsPos = [];

const genFollowsPos = () => {
    for (let i = 0; i < 10000; i++) {
        let x = 200 * (Math.random() - 0.5);
        let y = 2.5;
        let z = 200 * (Math.random() - 0.5);
        followsPos.push(new Vector3(x, y, z));
    }
}

const GMetaFriend = (props) => {

    const { follows } = props;

    useEffect(() => {
        genFollowsPos();
        return () => {
            //
        }
    }, [])

    const getPosByIndex = (index) => {
        let ret = followsPos.at(index);
        if (!ret) {
            ret = new Vector3(100, 0, 0);
        }
        return ret;
    }

    return (
        <TransformNode>
            <SpinningBox
                name="self"
                position={new Vector3(0, 2.5, 0)}
                color={Color3.FromHexString('#C8F4F9')}
                hoveredColor={Color3.FromHexString('#3CACAE')}
            />
            {follows && follows.map((item, index) => (
                <SpinningBox
                    name="others"
                    position={getPosByIndex(index)}
                    color={Color3.FromHexString('#EEB5EB')}
                    hoveredColor={Color3.FromHexString('#C26DBC')}
                />
            ))}
        </TransformNode>
    )
}

export default GMetaFriend;