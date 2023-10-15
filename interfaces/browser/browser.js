import { lenscriptScene } from "../../lenscript.js";
import { grammar } from "./browser_grammar.js";

class browserInterfaceProperties {
  constructor() {
    this.visible = true;
    this.rotation = { deg: 0 };
    this.textColor = { r: 255, g: 255, b: 255 };
    this.bgColor = { r: 0, g: 0, b: 0 };
    this.scale = { x: 1, y: 1 };
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
    addActionLog('property', `Object ${name} property ${details.property} changed from ${JSON.stringify(details.prevValue)} to ${JSON.stringify(details.newValue)}`);
  }
  const targetElement = document.querySelector(`[data-name="${name}"]`);
  console.log(name, details, state);
  targetElement.style.visibility = state.visible ? 'visible' : 'hidden';
  targetElement.style.opacity = state.opacity;
  if (typeof state.bgColor.r !== 'undefined') {
  targetElement.style.backgroundColor = `rgb(${state.bgColor.r}, ${state.bgColor.g}, ${state.bgColor.b})`;
  } else targetElement.style.backgroundColor = state.bgColor.value;
  if (typeof state.textColor.r !== 'undefined') {
  targetElement.style.color = `rgb(${state.textColor.r}, ${state.textColor.g}, ${state.textColor.b})`;
  } else targetElement.style.color = state.textColor.value;
  targetElement.style.transform = `rotate(${state.rotation}) scale(${state.scale})`;
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

  // Filter for actions that only update an objects property
  const nonPropertyActions = ['play', 'tell', 'remember', 'loop', 'endLoop'];
  if (!nonPropertyActions.includes(actionName)) {
    scene.objectProperty(objectName, actionName, params);
  } else {
    console.log(objectName, actionName, params);
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
  }
}

/**************************************************/
/*              UI Specific code                  */
/*                                                */
/* Everything below this point is for the HTML UI */
/* ie: updating the output logs, dropdown, etc.   */
/**************************************************/

function addActionLog(type, message) {
  document.querySelector('.action-log').innerHTML += `<p class="log-${type}">${message}</p>`;
}

const textarea = document.querySelector('textarea');
const objectSelector = document.getElementById('objectSelector');
const btnValidate = document.getElementById('btnValidate');
const btnSave = document.getElementById('btnSave');
const validationOutput = document.getElementById('validationOutput');
let currentTarget = '';

objectSelector.addEventListener('change', (event) => {
  if (event.target.value === 'disabled') {
    textarea.value = '';
  } else {
    currentTarget = event.target.value;
    textarea.value = scene.objectScripts(currentTarget).join('\n');
  }
});

function validateScripts(scripts) {
  try {
    const validation = scene.validateScripts(scripts);
    if (validation.valid) {
      validationOutput.innerHTML = `<p>Valid</p>`;
    } else {
      validationOutput.innerHTML = `<p>Invalid: ${validation.errors}</p>`;
    }
    return validation.valid;
  } catch (error) {
    validationOutput.innerHTML = `<p>Invalid: ${error}</p>`;
    return false;
  }
}

btnValidate.addEventListener('click', () => {
  validateScripts(textarea.value.trim().split('\n'));
})

btnSave.addEventListener('click', () => {
  const scripts = textarea.value.trim().split('\n');
  if (!validateScripts(scripts)) return;
  scene.setScripts(currentTarget, scripts);
  validationOutput.innerHTML = `<p>Saved</p>`;
})