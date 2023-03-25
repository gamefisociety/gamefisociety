import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { Rectangle, TextBlock } from '@babylonjs/gui/2D/controls';

import {
    useClick,
    useHover,
    useBeforeRender,
    TransformNode
} from 'react-babylonjs';

import { Vector3, Color3 } from '@babylonjs/core'
// import { Rectangle } from '@babylonjs/gui/2D/controls/rectangle'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { Line } from '@babylonjs/gui/2D/controls/line'

const DefaultScale = new Vector3(1, 1, 1)
const BiggerScale = new Vector3(1.25, 1.25, 1.25)

const FriendBox = (props) => {
    const { ent } = props;
    // access Babylon scene objects with same React hook as regular DOM elements
    const friendRef = useRef(null);
    const uiRef = useRef(null)

    const [clicked, setClicked] = useState(false)
    useClick(() => setClicked((clicked) => !clicked), friendRef)

    const [hovered, setHovered] = useState(false)
    useHover(
        () => setHovered(true),
        () => setHovered(false),
        friendRef
    )

    // This will rotate the box on every Babylon frame.
    const rpm = 5
    useBeforeRender((scene) => {
        // console.log('FriendBox useBeforeRender', scene);
        // if (boxRef.current) {
        //     // Delta time smoothes the animation.
        //     var deltaTimeInMillis = scene.getEngine().getDeltaTime()
        //     boxRef.current.rotation.y +=
        //         (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
        // }
    });

    // const onFullScreenRef = useCallback(() => {
    //     // const line = uiRef!
    //     console.log('friend callback!', uiRef);
    //     try {
    //         // if (uiRef.current && friendRef.current) {
    //         //     // uiRef.linkWithMesh(friendRef.current)
    //         //     // line.connectedControl = label7Ref.current!
    //         //     //     ;[1, 2, 3, 4, 5, 6].forEach((i) => {
    //         //     //         const lookup = refLookup[i]
    //         //     //         lookup.label.current!.linkWithMesh(lookup.sphere.current)
    //         //     //     })
    //         // }
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }, [])

    return (
        <sphere
            name={props.name}
            ref={friendRef}
            diameter={5}
            position={props.position}
            scaling={clicked ? BiggerScale : DefaultScale}
            onCreated={(target) => {
                var label = new Rectangle("label for " + target.name);
                console.log('sphere oncreate', target, label, ent);
                label.background = "black"
                label.height = "30px";
                label.alpha = 0.5;
                label.width = "100px";
                label.cornerRadius = 20;
                label.thickness = 1;
                label.linkOffsetY = 30;
                // advancedTexture.addControl(label); 
                label.linkWithMesh(target);

                var text1 = new TextBlock();
                text1.text = target.name;
                text1.color = "white";
                label.addControl(text1);
            }}
        >
            <standardMaterial
                name={`${props.name}-mat`}
                diffuseColor={hovered ? props.hoveredColor : props.color}
                specularColor={Color3.Black()}
            />
            {/* <rectangle
                    key={`labela`}
                    name={`label for Spherea`}
                    background="black"
                    height="30px"
                    alpha={0.5}
                    width="100px"
                    cornerRadius={20}
                    thickness={1}
                    linkOffsetY={30}
                    ref={uiRef}
                    verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
                >
                    <textBlock
                        name={`sphere-text`}
                        text={`Sphere`}
                        color="White"
                    />
                </rectangle> */}
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
    }, []);

    const getPosByIndex = (index) => {
        let ret = followsPos.at(index);
        if (!ret) {
            ret = new Vector3(100, 0, 0);
        }
        return ret;
    }

    return (
        <TransformNode>
            <FriendBox
                name="self"
                position={new Vector3(0, 2.5, 0)}
                color={Color3.FromHexString('#C8F4F9')}
                hoveredColor={Color3.FromHexString('#3CACAE')}
            />
            {follows && follows.map((item, index) => (
                <FriendBox
                    ent={item}
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