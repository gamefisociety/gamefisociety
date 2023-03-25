import React, { useEffect, useState, useCallback, useRef, forwardRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
    useClick,
    useHover,
    useBeforeRender,
    TransformNode
} from 'react-babylonjs';

import NormalCache from "db/NormalCache";
import { Vector3, Color3 } from '@babylonjs/core'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { Line } from '@babylonjs/gui/2D/controls/line'

const DefaultScale = new Vector3(1, 1, 1)
const BiggerScale = new Vector3(1.25, 1.25, 1.25)
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
    const getFriendUIRefList = target => {
        console.log('meta1 getFriendUIRefList', target);
        if (!target) {
            return;
        }
        let entName = target.name.replace('friend-ui', 'friend-ent');
        for (let i = 0; i < friendEntRef.current.length; i++) {
            if (entName === friendEntRef.current[i].name) {
                target.linkWithMesh(friendEntRef.current[i]);
            }
        }
    };

    const friendEntRef = useRef([]);
    const getFriendEntRefList = dom => {
        console.log('meta1 getFriendEntRefList', friendEntRef.current.length);
        friendEntRef.current.push(dom);
    };

    useEffect(() => {
        console.log('meta1 friend enter');
        genFollowsPos();
        return () => {
            if (friendEntRef.current) {
                friendEntRef.current.clear();
            }
        }
    }, []);

    const getPosByIndex = (index) => {
        let ret = followsPos.at(index);
        if (!ret) {
            ret = new Vector3(100, 0, 0);
        }
        return ret;
    }

    const onFullScreenRef = useCallback((aa) => {
        // const line = uiRef!
        console.log('meta1 onFullScreenRef!', aa);
        try {
            // friendUIRef.current?.forEach((i) => {
            //     const friend_ui = friendUIRef[i]
            //     console.log('meta1 friend ui callback!', friend_ui);
            // })
        } catch (e) {
            console.error(e)
        }
    }, []);

    const FriendBox = forwardRef((props, ref) => {
        const { ent } = props;
        console.log('FriendBox ref', ref);
        // access Babylon scene objects with same React hook as regular DOM elements
        const friendRef = useRef(null);
        const [clicked, setClicked] = useState(false)
        useClick(() => setClicked((clicked) => !clicked), friendRef)
        const [hovered, setHovered] = useState(false)
        useHover(
            () => setHovered(true),
            () => setHovered(false),
            friendRef
        )
        // This will rotate the box on every Babylon frame.
        // const rpm = 5
        useBeforeRender((scene) => {
            // console.log('FriendBox useBeforeRender', scene);
            // if (boxRef.current) {
            //     // Delta time smoothes the animation.
            //     var deltaTimeInMillis = scene.getEngine().getDeltaTime()
            //     boxRef.current.rotation.y +=
            //         (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
            // }
        });

        return (
            <sphere
                name={props.name}
                ref={friendRef}
                diameter={5}
                position={props.position}
                scaling={clicked ? BiggerScale : DefaultScale}
                onCreated={(target) => {
                    if (ref && target) {
                        ref(target);
                    }
                }}
            >
                <standardMaterial
                    name={`${props.name}-mat`}
                    diffuseColor={hovered ? props.hoveredColor : props.color}
                    specularColor={Color3.Black()}
                />
            </sphere>
        )
    });


    let metadata_cache_flag = "metadata_cache";
    const NorCache = NormalCache();

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
                    ref={getFriendEntRefList}
                    key={'friend-ent-' + index}
                    name={'friend-ent-' + index}
                    ent={item}
                    position={getPosByIndex(index)}
                    color={Color3.FromHexString('#EEB5EB')}
                    hoveredColor={Color3.FromHexString('#C26DBC')}
                />
            ))}
            <adtFullscreenUi name={'ui-friend'} ref={onFullScreenRef}>
                {follows && follows.map((item, index) => {
                    const { info } = NorCache.getMetadata(metadata_cache_flag, item);
                    let baseInfo = null;
                    if (info && info.content) {
                        baseInfo = JSON.parse(info.content);
                    }
                    console.log('follows data', item, info);
                    return (
                        <rectangle
                            key={'friend-ui-' + index}
                            name={'friend-ui-' + index}
                            background="black"
                            height="30px"
                            alpha={0.5}
                            width="100px"
                            cornerRadius={20}
                            thickness={1}
                            linkOffsetY={30}
                            ref={getFriendUIRefList}
                            verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
                        >
                            <textBlock
                                name={'sphere-text'}
                                text={baseInfo ? baseInfo.name : 'gfs user'}
                                color="White"
                            />
                        </rectangle>
                    )
                })}
            </adtFullscreenUi>
        </TransformNode>
    )
}

export default GMetaFriend;