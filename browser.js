import { lenscriptScene } from "./lenscript.js";

const targetElement = document.getElementById('targetElement');
const targetInput = document.getElementById('commandInput');
let parsedCommands;


function objectTransitioned(name, prevState, nextState, state) {
  console.log(`Object ${name} transitioned from ${prevState} to ${nextState}`);
  console.log(state);
}

const targetObjectName = 'test';
const scene = new lenscriptScene();
scene.registerTransitionCallback(objectTransitioned);
scene.add(targetObjectName);

let hovering = false;

document.addEventListener('DOMContentLoaded', () => {
  scene.trigger('start');
});

document.addEventListener('mousemove', () => {
  // if (hovering) scene.trigger('hovering', targetObjectName);
});

targetInput.addEventListener('input', event => {

});

targetElement.addEventListener('dragstart', () => {
  scene.trigger('grabStart', targetObjectName)
});

targetElement.addEventListener('drag', () => {
  // scene.trigger('grabbing', targetObjectName)
});

targetElement.addEventListener('dragend', () => {
  scene.trigger('grabEnd', targetObjectName)
});

targetElement.addEventListener('mouseenter', () => {
  hovering = true;
  scene.trigger('hoverStart', targetObjectName)
});

targetElement.addEventListener('mouseleave', () => {
  hovering = false;
  scene.trigger('hoverEnd', targetObjectName)
});

targetElement.addEventListener('mousedown', () => {
  scene.trigger('touchStart', targetObjectName)
});

targetElement.addEventListener('mouseup', () => {
  scene.trigger('touchEnd', targetObjectName)
});