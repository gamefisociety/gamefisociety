import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useSelector } from "react-redux";
import UserDataCache from 'db/UserDataCache';
import { EventEmitter } from 'events';

import {
    MeshBuilder,
    Vector3,
    Color3,
    StandardMaterial,
    Texture,
} from '@babylonjs/core'

import {
    AdvancedDynamicTexture,
    Rectangle,
    TextBlock,
} from '@babylonjs/gui'

let curScene = null;
let followers_gui = null;
let follower_main = null;
let followers_ent = new Map();

const eventBus = new EventEmitter();

const GMetaFriend = forwardRef((props, ref) => {

    const { follows, profile } = useSelector((s) => s.profile);

    const UserCache = UserDataCache();

    const createFriends = (scene) => {
        //
        console.log('createFriends', scene, profile);
        followers_gui = AdvancedDynamicTexture.CreateFullscreenUI('ui_followers');

        if (!follower_main) {
            follower_main = {
                pubkey: '0',
            };
        }
        // console.log('createFriends', scene, profile);
        follower_main.mesh = MeshBuilder.CreateBox('box', { size: 10 }, scene);
        follower_main.mesh.position.y = 200;
        curScene = scene;

        var mat = new StandardMaterial("mat1", scene);
        mat.alpha = 1.0;
        mat.diffuseColor = new Color3(1.0, 1.0, 1.0);
        var texture = new Texture("https://i.postimg.cc/Vkj3nYx2/LOGO512-2.png", scene);
        mat.diffuseTexture = texture;
        follower_main.name = 'follower_main';
        follower_main.mesh.material = mat;
        createLabel(follower_main);
    };

    const updateFriends = (dt, scene) => {
        const rpm = 10;
        if (follower_main && follower_main.mesh !== undefined) {
            follower_main.mesh.rotation.y += (rpm / 60) * Math.PI * 2 * (dt / 1000);
        }
        //update followsers
        for (let [key, ent] of followers_ent) {
            if (ent.dirty === true) {
                let meta = UserCache.getMetadata(key);
                if (meta && meta.content !== '') {
                    let t_profile = JSON.parse(meta.content);
                    updateTarget(ent, t_profile);
                    ent.dirty = false;
                }
            }
            ent.mesh.rotation.y += (rpm / 60) * Math.PI * 2 * (dt / 1000);
        }
    };

    const init = (scene) => {
        createFriends(scene);
    }

    const render = (dt, scene) => {
        updateFriends(dt, scene);
    }

    const createLabel = (ent) => {
        var label = new Rectangle(ent.name + '-label');
        label.background = "black"
        label.alpha = 0.5;
        label.height = "30px";
        label.width = "100px";
        label.cornerRadius = 12;
        label.thickness = 1;
        label.linkOffsetY = 30;
        followers_gui.addControl(label);
        label.linkWithMesh(ent.mesh);
        var text1 = new TextBlock();
        text1.text = ent.name;
        text1.color = "white";
        label.addControl(text1);
        label.onPointerEnterObservable.add((event) => {
            // console.log('aa onPointerEnterObservable', event);
            label.scaleX = 1.1;
            label.scaleY = 1.1;
            label.alpha = 0.85;
        });
        label.onPointerOutObservable.add((event) => {
            // console.log('aa onPointerOutObservable', event);
            label.scaleX = 1.0;
            label.scaleY = 1.0;
            label.alpha = 0.5;
        });
        //
        ent.label = label;
        ent.label_name = text1;
    }

    const addFriend = (pubkeys) => {
        if (!curScene || !pubkeys) {
            return;
        }
        // console.log('follower ent', followers_ent);
        pubkeys.map((pubkey, index) => {
            let ent_name = 'follower-' + pubkey;
            // add_ent_names.push(ent_name);
            let ent = followers_ent.get(pubkey);
            if (ent) {
                //update
            } else {
                //add
                ent = {};
                followers_ent.set(pubkey, ent);
                ent.pubkey = pubkey;
                ent.dirty = true;
                ent.name = ent_name;
                ent.mesh = MeshBuilder.CreateSphere(ent_name + '-mesh', { diameter: 10 }, curScene);
                let rad = 300;
                ent.mesh.position.y = 200 + (Math.random() - 0.5) * rad;
                ent.mesh.position.x = (Math.random() - 0.5) * rad;
                ent.mesh.position.z = (Math.random() - 0.5) * rad;
                // ent.mesh.metadata = pubkey;
                var mat = new StandardMaterial("mat1", curScene);
                mat.alpha = 1.0;
                mat.diffuseColor = new Color3(1.0, 1.0, 1.0);
                var texture = new Texture("https://i.postimg.cc/Vkj3nYx2/LOGO512-2.png", curScene);
                mat.diffuseTexture = texture;
                // mat.emissiveTexture = texture;
                ent.mesh.material = mat;
                // followers_ent_map.set(ent_name, ent);
                createLabel(ent);
            }
        });
    }

    const updateTarget = (ent, profile) => {
        //update name
        if (!ent) {
            return;
        }
        if (ent.label_name) {
            ent.label_name.text = profile.name;
        }
        //
        if (ent.mesh && ent.mesh.material) {
            var texture = new Texture(profile.picture, curScene);
            ent.mesh.material.diffuseTexture = texture;
            // ent.mesh.material.emissiveTexture = texture;
        }
    }

    useImperativeHandle(ref, () => (
        {
            init: init,
            render: render,
        }
    ));

    const msg_follow_procer = (param) => {
        console.log('msg_follow_procer', param);
    }

    useEffect(() => {
        eventBus.addListener("msg_follow_procer", msg_follow_procer);
        return () => {
            eventBus.removeListener("msg_follow_procer", msg_follow_procer);
        }
    }, []);

    useEffect(() => {
        addFriend(follows);
    }, [follows]);

    useEffect(() => {
        console.log('follower main', profile);
        updateTarget(follower_main, profile);
    }, [profile]);

    return null;
});

export default React.memo(GMetaFriend);

