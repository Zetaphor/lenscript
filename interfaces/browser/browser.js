import { lenscriptScene } from "../../lenscript.js";
import { grammar } from "./browser_grammar.js";

class browserInterfaceProperties {
  constructor() {
    this.visible = true;
    this.rotation = { x: 0, y: 0, z: 0, w: 1 };
    this.textColor = { r: 255, g: 255, b: 255 };
    this.bgColor = { r: 0, g: 0, b: 0 };
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
function objectStateUpdate(name, details, state) {
  if (details.reason === 'stateChange') {
    addActionLog('transition', `Object ${name} transitioned from ${details.prevState} to ${details.newState}`);
  } else if (details.reason === 'propertyChange') {
    addActionLog('property', `Object ${name} property ${details.property} changed from ${details.prevValue} to ${details.newValue}`);
  }
  const targetElement = document.querySelector(`[data-name="${name}"]`);
  targetElement.style.visibility = state.visible ? 'visible' : 'hidden';
  targetElement.style.opacity = state.opacity;
  targetElement.style.backgroundColor = `rgb(${state.bgColor.r}, ${state.bgColor.g}, ${state.bgColor.b})`;
  targetElement.style.color = `rgb(${state.textColor.r}, ${state.textColor.g}, ${state.textColor.b})`;
  targetElement.style.transform = `rotate(${state.rotation.deg}) scale(${state.scale.x}, ${state.scale.y})`;
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
  const hasParams = typeof params == 'object' && Object.keys(params).length || params.length;
  const targetElement = document.querySelector(`[data-name="${objectName}"]`);
  addActionLog('action', `Object ${objectName} triggered action ${actionName} ${hasParams ? 'with params ' + JSON.stringify(params) : ''}`);
  if (actions[actionName]) {
    actions[actionName](objectName, params);
  } else {
    addActionLog('action', `Action ${actionName} does not exist`);
    throw new Error(`Action ${actionName} does not exist`);
  }
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
  scene.registerStateUpdateCallback(objectStateUpdate);
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

    // TODO Lowercase everything in lenscript

    const scripts = [
      'When started then set bg color 0 255 0, set text color red',
    ]

    const validation = scene.validateScripts(scripts);
    if (!validation.valid) {
      console.error('Invalid scripts:', validation.errors);
      return;
    }

    scene.setScripts(name, scripts);
    scene.objectState(name, 'default');
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
  play: function (name, ...params) {
    console.log('play', params);
  },
  bgColor: function (name, r, g, b) {
    console.log('bgColor', r, g, b);
    const targetElement = document.querySelector(`[data-name="${name}"]`);
    targetElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  },
  textColor: function (name, r, g, b) {
    console.log('textColor', r, g, b);
    const targetElement = document.querySelector(`[data-name="${name}"]`);
    targetElement.style.color = `rgb(${r}, ${g}, ${b})`;
  },
  scale: function (name, x, y, z) {
    console.log('scale', x, y, z);
  },
  rotation: function (name, de) {
    console.log('rotation', x, y, z, w);
  },
  opacity: function (name, opacity) {
    console.log('opacity', opacity);
  },
  visibility: function (name, visible) {
    console.log('visibility', visible);
  },
}

/**************************************************/
/*              UI Specific code                  */
/*                                                */
/* Everything below this point is for the HTML UI */
/* This like updating the output logs, etc.       */
/**************************************************/

function addActionLog(type, message) {
  document.querySelector('.action-log').innerHTML += `<p class="log-${type}">${message}</p>`;
}