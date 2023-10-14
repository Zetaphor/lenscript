import { lenscriptScene } from "../../lenscript.js";
import { grammar } from "./browser_grammar.js";

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

function actionCallback(objectName, actionName, params) {
  console.log(`Object ${objectName} triggered action ${actionName} with params`, params);
}

const scene = new lenscriptScene();
scene.registerGrammar(grammar);
scene.registerTransitionCallback(objectTransitioned);
scene.registerActionCallback(actionCallback);

const scripts = [
  "When started then play music 120, emit bubbles, tell bob hello",
  "When touched then play music",
  "When someone in vicinity then play music 100 high",
  "When player in vicinity then play music",
  "When dropped by player then play music",
  "When told test by player then play music 110",
  "When heard hello from Alice then tell Bob hi",
  "When heard hello then tell Bob hi",
]

console.log(scene.validateScripts(scripts));

const targetElements = document.querySelectorAll('.target');

targetElements.forEach((element) => {
  const name = element.getAttribute('data-name');

  scene.add(name, new browserInterfaceProperties());

  scene.setScripts(name, scripts);

  scene.trigger(name, 'started');

  element.addEventListener('dragstart', () => {
    scene.trigger(name, 'grabStart');
  });

  element.addEventListener('drag', () => {
    // scene.trigger(name, 'grabbing');
  });

  element.addEventListener('dragend', () => {
    scene.trigger(name, 'grabEnd');
  });

  element.addEventListener('mouseenter', () => {
    scene.trigger(name, 'hoverStart');
  });

  element.addEventListener('mouseover', (event) => {
    scene.trigger(name, 'hovering');
  });

  element.addEventListener('mouseleave', () => {
    scene.trigger(name, 'hoverEnd');
  });

  element.addEventListener('mousedown', () => {
    scene.trigger(name, 'touchStart');
  });

  element.addEventListener('mouseup', () => {
    scene.trigger(name, 'touchEnd');
  });
});
