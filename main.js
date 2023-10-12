import { lenscriptScene } from './lenscript.js';

const scene = new lenscriptScene();

scene.add('test');
const testObject = scene.obj('test');
testObject.prop('color', { r: 255, g: 255, b: 255 });
console.log('Before color', testObject.prop('color'));
testObject.prop('color', { r: 0, g: 0, b: 0 });
console.log('After color', testObject.prop('color'));
