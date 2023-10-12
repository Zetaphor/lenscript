export class lenscriptObjectProperties {
  constructor(properties = {}) {
    // Trigger properties
    this.touching = false;
    this.hovering = false;

    // Interface properties
    this.visible = true;
    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0, w: 1 };
    this.color = { r: 0, g: 0, b: 0 };
    this.scale = { x: 1, y: 1, z: 1 };
    this.opacity = 1;

    // Override default properties with user provided values
    Object.assign(this, properties);
  }
}

export class lenscriptObject {
  #variables = {};
  #currentState = 'default';
  #states = { 'default': new lenscriptObjectProperties(properties) };

  constructor(name) {
    this.name = name;
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
   * @param {string} value optional value, if not provided the value of the variable is returned
   */
  var(name, value = null) {
    if (value === null) return this.#variables[name] || '';
    else this.#variables[name] = value.toString();
  }

  /**
   * Get or set a state property value. If no value is provided the value of the property is returned
   * Returns an empty string if the property is undefined
   *
   * @param {string} name
   * @param {string} value optional value, if not provided the value of the property is returned
   */
  prop(name, value = null) {
    if (value === null) return this.#states[this.#currentState][name] || '';
    else this.setProperty(name, value.toString());
  }

  /**
   * Get the current state
   *
   * @returns {object} the current state
   */
  state() {
    return this.#states[this.#currentState];
  }

  /**
   * Set the current state
   *
   * @param {string} name
   */
  setState(name) {
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
   * @param {string} name
   */
  removeState(name) {
    delete this.#states[name];
  }
}

export class lenscriptScene {
  #variables = {};
  #objects = {};

  constructor(objects = []) {
    this.#objects = objects;
  }

  /**
   * Add an object to the scene
   *
   * @param {string} name
   * @param {lenscriptObjectProperties} properties
   */
  add(name, properties = {}) {
    this.#objects.push(new lenscriptObject(name, properties));
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
  var(name, value = null) {
    if (value === null) return this.#variables[name] || '';
    else this.#variables[name] = value.toString();
  }

  /**
   * Get an object from the scene
   *
   * @param {string} name
   * @returns {lenscriptObject}
   */
  obj(name, value = null) {
    if (value === null) return this.#objects[name] || '';
  }

  /**
   * Get all of the objects in the scene
   * @returns {Array<lenscriptObject>}
   */
  objects() {
    return this.#objects;
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
