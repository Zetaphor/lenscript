export class lenscriptObjectProperties {
  constructor(properties = {}) {
    this.touching = false;
    this.hovering = false;
    Object.assign(this, properties);
  }
}

export class lenscriptObject {
  constructor(name, properties = {}) {
    this.name = name;
    this.variables = {};
    this.currentState = 'default';
    this.states = {
      'default': new lenscriptObjectProperties(properties)
    };
  }

  /**
   * Set the objects name
   * @param {string} name
   */
  setName(name) {
    this.name = name;
  }

  /**
   * Set the current state
   * @param {string} name
   */
  setState(name) {
    this.currentState = name;
  }

  /**
   * Add a state
   * @param {string} name
   * @param {lenscriptObjectProperties} properties
   */
  addState(name, properties = {}) {
    this.states[name] = new lenscriptObjectProperties(properties);
  }

  /**
   * Remove a state
   * @param {string} name
   */
  removeState(name) {
    delete this.states[name];
  }

  /**
   * Set a variable value
   * @param {string} name
   * @param {string} value
   */
  setVariable(name, value) {
    this.variables[name] = value.toString();
  }

  /**
   * Get a variable value
   * @param {string} name
   * @returns string the value of the variable
   */
  getVariable(name) {
    return this.variables[name];
  }

  /**
   * Set a property value
   * @param {string} name
   * @param {string} value
   */
  setProperty(name, value) {
    this.states[this.currentState][name] = value.toString();
  }

  /**
   * Get a property value
   * @param {string} name
   * @returns string the value of the property
   */
  getProperty(name) {
    return this.states[this.currentState][name];
  }
}

export class lenscriptScene {
  constructor(objects = []) {
    this.objects = objects;
    this.variables = {};
  }

  /**
   * Add an object to the scene
   * @param {string} name
   * @param {lenscriptObjectProperties} properties
   */
  addObject(name, properties = {}) {
    this.objects.push(new lenscriptObject(name, properties));
  }

  /**
   * Remove an object from the scene
   * @param {string} name
  */
  removeObject(name) {
    delete this.objects[name];
  }

  /**
   * Set a scene variable value
   * @param {string} name
   * @param {string} value
   */
  setVariable(name, value) {
    this.variables[name] = value;
  }
}

/**
 * Parse a single command into its components.
 *
 * @param {string} command - The command string to parse.
 * @returns {object} - An object containing the components of the command.
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
 * Parse multiple commands into a structured format.
 *
 * @param {Array<string>} commands - An array of command strings.
 * @returns {Array<object>} - An array of parsed commands.
 */
export function parseCommands(commands) {
  return commands.map(command => parseCommand(command));
}
