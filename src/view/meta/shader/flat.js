import {
    ShaderStore,
} from '@babylonjs/core/Engines';

import {
    ShaderMaterial
} from '@babylonjs/core';
// import { ShaderMaterial } from '../../../../node_modules/react-babylonjs/dist/generatedCode';

const fShader = `
    void main(void) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const vShader = `
    attribute vec3 position;
    //attribute vec2 uv;
    uniforms mat4 worldViewProjection;
    void main() {
        gl_Position = worldViewProjection * vec4(position, 1.0);
    }
`;

ShaderStore['flatVertexShader'] = vShader;
ShaderStore['flatFragmentShader'] = fShader;

const getFlatShader = (sc) => {
    const flatShader = new ShaderMaterial(
        'flat',
        sc,
        {
            vertex: 'flat',
            fragment: 'flat',
        },
        {
            attributes: ['position'],
            uniforms: ['worldViewProjection']
        });
    return flatShader;
}

export default getFlatShader;
