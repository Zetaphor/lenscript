class lenscriptInterfaceProperties {
  constructor() {
    this.visible = true;
    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0, w: 1 };
    this.color = { r: 0, g: 0, b: 0 };
    this.scale = { x: 1, y: 1, z: 1 };
    this.opacity = 1;
  }
}

class lenscriptTriggerProperties {
  constructor() {
    this.touching = false;
    this.hovering = false;
    this.waitingForTouches = false;
    this.waitingForTells = false;
  }
}

export class lenscriptObject {
  #variables = {};
  #currentState = 'default';
  #triggerProperties = new lenscriptTriggerProperties();
  #states = { 'default': new lenscriptInterfaceProperties() };
  #parentScene = null;

  constructor(parent, name) {
    this.name = name;
    this.#parentScene = parent;
  }

  /**
   * Set the objects name
   *
   * @param {string} name
   */
  setName(name) {
    this.name = name;
  }

  /**
   * Get or set a variable value. If no value is provided the value of the variable is returned
   * Returns an empty string if the variable is undefined
   *
   * @param {string} name
   * @param {any} value optional value, if not provided the value of the variable is returned
   */
  variable(name, value = null) {
    if (value === null) return this.#variables[name] || '';
    else this.#variables[name] = value.toString();
  }

  /**
   * Get or set a state property value. If no value is provided the value of the property is returned
   * Returns an empty string if the property is undefined
   *
   * @param {string} name
   * @param {any} value optional value, if not provided the value of the property is returned
   */
  property(name, value = null) {
    if (value === null) return this.#states[this.#currentState][name] || '';
    else this.#states[this.#currentState][name] = value;
  }

  /**
   * Get the current state name
   *
   * @returns {string} the current state name
   */
  state() {
    return this.#currentState;
  }

  /**
   * Get all of the states
   *
   * @returns {Array<string>} the names of all states
   */
  states() {
    return Object.keys(this.#states);
  }

  /**
   * Set the current state and trigger the transition callback
   *
   * @param {string} name
   */
  setState(name) {
    this.#parentScene.objectStateTransitioned(this.name, this.#currentState, name, this.#states[name]);
    this.#currentState = name;
  }

  /**
   * Add a state to the object
   *
   * @param {string} name
   * @param {lenscriptObjectProperties} properties
   */
  addState(name, properties = {}) {
    this.#states[name] = new lenscriptObjectProperties(properties);
  }

  /**
   * Remove a state
   *
   * @param {string} name
   */
  removeState(name) {
    delete this.#states[name];
  }
}

export class lenscriptScene {
  #variables = {};
  #objects = {};
  #transitionCallback = null;

  /**
   * Trigger the transition callback function when a childs state changes
   * This should only be called from a child object
   *
   * @param {string} name
   * @param {string} prevName the previous state name
   * @param {string} newName the new state name
   * @param {lenscriptObjectProperties} state the new state properties
   */
  objectStateTransitioned(name, prevName, newName, state) {
    if (this.#transitionCallback) {
      this.#transitionCallback(name, prevName, newName, state);
    }
  }

  /**
   * Set the transition callback function
   *
   * @param {function} callback
   */
  registerTransitionCallback(callback) {
    this.#transitionCallback = callback;
  }

  /**
   * Add an object to the scene
   *
   * @param {string} name
   * @param {lenscriptObjectProperties} properties
   */
  add(name) {
    this.#objects[name] = new lenscriptObject(this, name);
  }

  /**
   * Remove an object from the scene
   * @param {string} name
  */
  remove(name) {
    delete this.#objects[name];
  }

  /**
   * Get or set a variable value. If no value is provided the value of the variable is returned
   * Returns an empty string if the variable is undefined
   *
   * @param {string} name
   * @param {string} value optional value, if not provided the value of the variable is returned
   */
  variable(name, value = null) {
    if (value === null) return this.#variables[name] || '';
    else this.#variables[name] = value.toString();
  }

  /**
   * Get a single object from the scene
   *
   * @param {string} name
   * @returns {lenscriptObject}
   */
  object(name) {
    return this.#objects[name];
  }

  /**
   * Get all of the objects in the scene
   * @returns {Array<lenscriptObject>}
   */
  objects() {
    return this.#objects;
  }

  /**
   * Set the transition callback function
   *
   * @param {function} callback
   */
  setCallback(callback) {
    this.#transitionCallback = callback;
  }
}

/**
 * Parse a single command into its components
 *
 * @param {string} command The command string to parse
 * @returns {object} An object containing the components of the command
 */
export function parseCommand(command) {
  const result = {
    trigger: null,
    triggerParams: [],
    actions: []
  };

  // Split the command into "When ... then ..." parts
  const [whenPart, thenPart] = command.split(" then ");

  // Extract the trigger and its parameters after "When"
  const [trigger, ...triggerParams] = whenPart.replace("When ", "").split(" ");
  result.trigger = trigger.trim();
  result.triggerParams = triggerParams.map(param => param.trim());

  // Split actions by commas
  const actions = thenPart.split(", ").map(action => {
    const [actionName, ...params] = action.split(" ");
    return {
      actionName: actionName.trim(),
      params: params.map(param => param.trim())
    };
  });

  result.actions = actions;

  return result;
}

/**
 * Parse multiple commands into a structured format
 *
 * @param {Array<string>} commands An array of command strings
 * @returns {Array<object>} An array of parsed commands
 */
export function parseCommands(commands) {
  return commands.map(command => parseCommand(command));
}

