import { lenscriptScene } from "../../lenscript.js";
import { grammar } from "./grammar.js";

const targetElement = document.getElementById('targetElement');
const targetInput = document.getElementById('commandInput');
let parsedCommands;


class browserInterfaceProperties {
  constructor() {
    this.visible = true;
    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0, w: 1 };
    this.color = { r: 0, g: 0, b: 0 };
    this.scale = { x: 1, y: 1, z: 1 };
    this.opacity = 1;
  }
}

function objectTransitioned(name, prevState, nextState, state) {
  console.log(`Object ${name} transitioned from ${prevState} to ${nextState}`);
  console.log(state);
}

const targetObjectName = 'test';
const scene = new lenscriptScene();
scene.registerGrammar(grammar);
scene.registerTransitionCallback(objectTransitioned);
scene.add(targetObjectName, new browserInterfaceProperties());

let hovering = false;

document.addEventListener('DOMContentLoaded', () => {
  scene.trigger('start');
  console.log(scene.parseCommand("When started then play music 120, emit bubbles, tell bob hello"));
  console.log(scene.parseCommand("When touched then play music"));
  console.log(scene.parseCommand("When someone in vicinity then play music 100 high"));
  console.log(scene.parseCommand("When player in vicinity then play music"));
  console.log(scene.parseCommand("When dropped by player then play music"));
  console.log(scene.parseCommand("When told test by player then play music 110"));
  console.log(scene.parseCommand("When heard hello from Alice then tell Bob hi"));
  console.log(scene.parseCommand("When heard hello then tell Bob hi"));
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