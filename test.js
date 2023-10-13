import { lenscriptScene } from './lenscript.js';

function objectTransitioned(name, prevState, nextState, state) {
  console.log(`Object ${name} transitioned from ${prevState} to ${nextState}`);
  console.log(state);
}

const scene = new lenscriptScene();

scene.registerTransitionCallback(objectTransitioned);

scene.add('test');
const testObject = scene.object('test');
testObject.property('color', { r: 255, g: 0, b: 0 });
console.log('Default color', testObject.property('color'))
testObject.addState('hovering', { color: { r: 0, g: 255, b: 0 } });
testObject.setState('hovering');
console.log('Hovering color', testObject.property('color'));