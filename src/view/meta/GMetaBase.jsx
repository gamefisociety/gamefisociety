import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  Engine,
  Scene,
} from '@babylonjs/core'

const GMetaBase = (props) => {

  const reactCanvas = useRef(null)
  const {
    canvasId,
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    ...rest
  } = props

  useEffect(() => {
    if (!reactCanvas.current)
      return;

    const engine = new Engine(
      reactCanvas.current,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    )

    const scene = new Scene(engine, sceneOptions)
    if (scene.isReady()) {
      onSceneReady(scene)
    } else {
      scene.onReadyObservable.addOnce(onSceneReady)
    }

    engine.runRenderLoop(() => {
      onRender(scene)
      scene.render()
    })

    const resize = () => {
      scene.getEngine().resize()
    }

    if (window) {
      window.addEventListener('resize', resize)
    }

    return () => {
      scene.getEngine().dispose()
      if (window) {
        window.removeEventListener('resize', resize)
      }
    }
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
  ])

  return <canvas className='meta_bg' id={canvasId} ref={reactCanvas} {...rest} />
}

export default React.memo(GMetaBase);

