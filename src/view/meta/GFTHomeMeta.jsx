import React, { useEffect, useRef, createRef } from 'react';
import './GFTHomeMeta.scss';

import { useSelector } from "react-redux";
import GMetaBase from './GMetaBase';
import GMetaLight from './GMetaLight';
import GMetaGround from './GMetaGround';
import GMetaCamera from './GMetaCamera';
import GMetaFriend from './GMetaFriend';

const GFTHomeMeta = () => {

    const metaLightRef = useRef(null);
    const metaGroundRef = useRef(null);
    const metaCameraRef = useRef(null);
    const metaFriendRef = useRef(null);

    const onSceneReady = (scene) => {

        if (metaCameraRef.current && metaCameraRef.current.init) {
            metaCameraRef.current.init(scene);
        }

        if (metaGroundRef.current && metaGroundRef.current.init) {
            metaGroundRef.current.init(scene);
        }

        if (metaLightRef.current && metaLightRef.current.init) {
            metaLightRef.current.init(scene);
        }

        if (metaFriendRef.current && metaFriendRef.current.init) {
            metaFriendRef.current.init(scene);
        }
    }

    const onRender = (scene) => {
        let dt = scene.getEngine().getDeltaTime();

        if (metaGroundRef.current && metaGroundRef.current.render) {
            metaGroundRef.current.render(dt, scene);
        }

        if (metaLightRef.current && metaLightRef.current.render) {
            metaLightRef.current.render(dt, scene);
        }

        if (metaFriendRef.current && metaFriendRef.current.render) {
            metaFriendRef.current.render(dt, scene);
        }
    }

    return <GMetaBase
        canvasId="babylon-canvas"
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
    >
        <GMetaCamera ref={metaCameraRef}></GMetaCamera>
        <GMetaGround ref={metaGroundRef}></GMetaGround>
        <GMetaLight ref={metaLightRef}></GMetaLight>
        <GMetaFriend ref={metaFriendRef}></GMetaFriend>
    </GMetaBase>
}

export default React.memo(GFTHomeMeta);