import { lenscriptScene } from "../../lenscript.js";
import { grammar } from "./browser_grammar.js";

class browserInterfaceProperties {
  constructor() {
    this.visible = true;
    this.rotation = 0;
    this.textColor = { r: 255, g: 255, b: 255 };
    this.bgColor = { r: 0, g: 0, b: 0 };
    this.scale = 1;
    this.opacity = 1;
  }
}

let targetElements = null;
let scene = null;

/**
 * Called from the scene when an object has changed states
 * Updates the CSS properties of the target element based on the object state
 * Updates the action log with a notice about the property change
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
 * Implements the browser interpretation of the action
 * Updates the action log with a notice about the action
 * Registered in the scene from setupScene()
 *
 * @param {string} objectName the name of the object
 * @param {string} actionName the name of the action
 * @param {object} params action parameters
 */
function actionCallback(objectName, actionName, params) {
  const hasParams = typeof params == 'object' && Object.keys(params).length || params.length;
  const targetElement = document.querySelector(`[data-name="${objectName}"]`);

  // Filter for actions that only update an objects property
  const nonPropertyActions = ['tell', 'remember', 'save', 'become'];
  if (!nonPropertyActions.includes(actionName)) {
    scene.objectProperty(objectName, actionName, params);
  } else {
    if (actionName === 'remember') scene.objectVariable(objectName, params.name, params.value);
    else if (actionName === 'save') scene.variable(params.name, params.value);
    else if (actionName === 'tell') {
      scene.trigger(params.target, 'heard', params.value);
      console.log('tell', params);
      // TODO: Implement told trigger, not sure if that's ready yet
      // Also implement remembered and saved triggers
    } else if (actionName === 'become') {
      console.log('become', params);
    }
  }
  addActionLog('action', `Object ${objectName} triggered action ${actionName} ${hasParams ? 'with params ' + JSON.stringify(params) : ''}`);
}

/**
 * Set up the scene and target elements on page load
 */
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

  const scripts = [
    [
      'When started then set bg color 0 255 0, set text color 255 255 255',
      'When hover started then set bg color 144 175 174, set text color 237 213 4',
      'When hovered then set bg color 39 11 130, set text color 255 255 255',
      'When touched then save test 1',
      'When grabbed then set bg color 58 209 136, set text color 255 255 255',
      'When dropped then set bg color 42 127 50, set text color 255 255 255',
    ],
    [
      'When started then set bg color 145 240 247, set text color 255 255 255',
      'When hover started then set bg color 15 71 60, set text color 237 213 4',
      'When hovered then set bg color 179 130 221, set text color 255 255 255',
      'When touched then tell testObject1 hello',
      'When grabbed then set bg color 15 71 60, set text color 255 255 255',
      'When dropped then set bg color 188 20 79, set text color 255 255 255',
    ],
    [
      'When started then set bg color 48 157 163, set text color 255 255 255',
      'When hover started then set bg color 68 139 244, set text color 237 213 4',
      'When hovered then set bg color 183 244 210, set text color 255 255 255',
      'When touched then set bg color 48 157 163, set text color 255 255 255',
      'When grabbed then set bg color 93 96 54, set text color 255 255 255',
      'When dropped then set bg color 191 180 30, set text color 255 255 255',
    ],
    [
      'When started then set bg color 137 107 113, set text color 255 255 255',
      'When hover started then set bg color 0 204 226, set text color 237 213 4',
      'When hovered then set bg color 2 0 2, set text color 255 255 255',
      'When touched then set bg color 164 189 191, set text color 255 255 255',
      'When grabbed then set bg color 57 73 71, set text color 255 255 255',
      'When dropped then set bg color 76 75 48, set text color 255 255 255',
    ]
  ]


  for (let i = 0; i < targetElements.length; i++) {
    const element = targetElements[i];
    const name = element.getAttribute('data-name');

    scene.add(name, new browserInterfaceProperties());

    // TODO Lowercase everything in lenscript

    const validation = scene.validateScripts(scripts[i]);
    if (!validation.valid) {
      console.error('Invalid scripts:', validation.errors);
      return;
    }

    scene.setScripts(name, scripts[i]);
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

const textarea = document.querySelector('textarea');
const objectSelector = document.getElementById('objectSelector');
const btnValidate = document.getElementById('btnValidate');
const btnSave = document.getElementById('btnSave');
const validationOutput = document.getElementById('validationOutput');
const actionLog = document.getElementById('actionLog');
let currentTarget = '';

function addActionLog(type, message) {
  actionLog.innerHTML += `<p class="log-${type}">${message}</p>`;
  actionLog.scrollTo({
    top: actionLog.scrollHeight,
    behavior: 'smooth'
  });
}

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