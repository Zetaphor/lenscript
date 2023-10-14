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

let targetElements = null;
let scene = null;

/**
 * Called from the scene when an object has changed states
 * Registered in the scene from setupScene()
 *
 * @param {string} name the name of the object
 * @param {string} prevState the previous state
 * @param {string} nextState the new state
 * @param {object} state the new state properties
 */
function objectTransitioned(name, prevState, nextState, state) {
  console.log(`Object ${name} transitioned from ${prevState} to ${nextState}`);
  console.log(state);
}

/**
 * Called from the scene when an action is triggered
 * Registered in the scene from setupScene()
 *
 * @param {string} objectName the name of the object
 * @param {string} actionName the name of the action
 * @param {object} params action parameters
 */
function actionCallback(objectName, actionName, params) {
  console.log(`Object ${objectName} triggered action ${actionName} with params`, params);
  const targetElement = document.querySelector(`[data-name="${objectName}"]`);
}

document.addEventListener('DOMContentLoaded', () => {
  setupScene();
  setupTargetElements();
});

/**
 * Create the scene and register the grammar, transition callback, and action callback
 */
function setupScene() {
  scene = new lenscriptScene();
  scene.registerGrammar(grammar);
  scene.registerTransitionCallback(objectTransitioned);
  scene.registerActionCallback(actionCallback);
}

/**
 * Add the target elements to the scene and bind the browser-specific action triggers
 */
function setupTargetElements() {
  targetElements = document.querySelectorAll('.test-object');

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
}

const actions = {
  play: function (soundName, volume = 100) {
    console.log('play', soundName, volume);
  }
}

/**************************************************/
/*              UI Specific code                  */
/*                                                */
/* Everything below this point is for the HTML UI */
/* This like updating the output logs, etc.       */
/**************************************************/


