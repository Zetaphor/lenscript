export class lenscriptObject {
  #variables = {};
  #currentState = 'default';
  #states = {};
  #parentScene = null;
  constructor(parent, name, defaultProperties) {
    if (!parent) throw new Error('Object must have a parent');
    if (!name) throw new Error('Object must have a name');
    if (!defaultProperties) throw new Error('Object must have default properties');

    this.name = name;
    this.#parentScene = parent;
    this.addState('default', defaultProperties);
  }

  /**
   * Set the objects name
   *
   * @param {string} name
   */
  setName(name) {
    if (!name) throw new Error('Object must have a name');
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
    if (!this.#states[name]) throw new Error(`State ${name} does not exist`);
    this.#parentScene._objectStateTransitioned(this.name, this.#currentState, name, this.#states[name]);
    this.#currentState = name;
  }

  /**
   * Add a state to the object
   *
   * @param {string} name
   * @param {lenscriptObjectProperties} properties
   */
  addState(name, properties = {}) {
    if (!name) throw new Error('State must have a name');
    if (this.#states[name]) throw new Error(`State ${name} already exists`);
    this.#states[name] = properties;
  }

  /**
   * Remove a state
   *
   * @param {string} name
   */
  removeState(name) {
    if (!this.#states[name]) throw new Error(`State ${name} does not exist`);
    delete this.#states[name];
  }
}

export class lenscriptScene {
  #variables = {};
  #objects = {};
  #transitionCallback = null;
  #actionCallback = null;
  #grammar = null

  #validateScene() {
    if (!this.#transitionCallback) throw new Error('Scene must have a transition callback');
    if (!this.#actionCallback) throw new Error('Scene must have an action callback');
    if (!this.#grammar) throw new Error('Scene must have a grammar');
  }

  /**
   * Trigger the transition callback function when a childs state changes
   * This should only be called from a child object
   *
   * @param {string} name
   * @param {string} prevName the previous state name
   * @param {string} newName the new state name
   * @param {lenscriptObjectProperties} state the new state properties
   */
  _objectStateTransitioned(name, prevName, newName, state) {
    if (!this.#transitionCallback) throw new Error('Scene must have a transition callback');
    this.#transitionCallback(name, prevName, newName, state);
  }

  /**
   * Set the transition callback function
   *
   * @param {function} callback
   */
  registerTransitionCallback(callback) {
    if (typeof callback !== 'function') throw new Error('Transition callback must be a function');
    this.#transitionCallback = callback;
  }

  /**
   * Set the action callback function
   *
   * @param {function} callback
   */
  registerActionCallback(callback) {
    if (typeof callback !== 'function') throw new Error('Action callback must be a function');
    this.#actionCallback = callback;
  }

  /**
   * Set the command grammar for parsing commands
   *
   * @param {object} grammar
   */
  registerGrammar(grammar) {
    if (typeof grammar !== 'object') throw new Error('Grammar must be an object');
    if (typeof grammar['triggers'] !== 'object') throw new Error('Grammar triggers must be an object');
    if (typeof grammar['actions'] !== 'object') throw new Error('Grammar actions must be an object');
    this.#grammar = grammar;
  }

  /**
   * Trigger an action
   * @param {*} name
   * @param  {...any} params
   */
  trigger(name, action, ...params) {
    this.#validateScene();
    const sceneObject = this.object(name);
    if (sceneObject.activeTriggers.includes(action)) {
      const script = sceneObject.scripts.find(script => script.trigger === action);
      for (let i = 0; i < script.actions.length; i++) {
        this.#actionCallback(name, script.actions[i].actionName, script.actions[i].params);
      }
    }
  }

  /**
   * Add an object to the scene
   *
   * @param {string} name
   * @param {object} properties
   */
  add(name, properties) {
    this.#validateScene();
    if (!name) throw new Error('Object must have a name');
    if (!properties) throw new Error('Object must have properties');
    if (this.#objects[name]) throw new Error(`Object ${name} already exists`);
    this.#objects[name] = {
      object: new lenscriptObject(this, name, properties),
      activeTriggers: [],
      scripts: []
    }
  }

  /**
   * Remove an object from the scene
   * @param {string} name
  */
  remove(name) {
    this.#validateScene();
    if (!this.#objects[name]) throw new Error(`Object ${name} does not exist`);
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
    this.#validateScene();
    if (value === null) return this.#variables[name] || '';
    else this.#variables[name] = value.toString();
  }

  /**
   * Get a single object from the scene
   *
   * @param {string} name
   * @returns {lenscriptObject} the scene object
   */
  object(name) {
    this.#validateScene();
    if (!this.#objects[name]) throw new Error(`Object ${name} does not exist`);
    return this.#objects[name];
  }

  /**
   * Get all of the objects in the scene
   * @returns {array<lenscriptObject>} the scene objects
   */
  objects() {
    this.#validateScene();
    return this.#objects;
  }

  /**
   * Validate scripts for correct trigger and action syntax
   *
   * @param {array<string>} scripts
   * @returns {object} { valid: boolean, errors: array }
   */
  validateScripts(scripts) {
    let errors = [];
    for (let i = 0; i < scripts.length; i++) {
      let script = this.#parseCommand(scripts[i]);
      if (!script.isValid) {
        errors.push({
          index: i,
          message: "Invalid trigger"
        })
      }

      for (let j = 0; j < script.actions.length; j++) {
        if (script.actions[j].isValid) continue;
        errors.push({
          index: i,
          message: "Invalid action"
        });
        break;
      }
    }
    return { valid: !errors.length, errors: errors };
  }

  /**
   * Set an objects scripts and triggers
   *
   * @param {string} name
   * @param {array<string>} scripts an array of scripts
   */
  setScripts(name, scripts) {
    if (!this.#objects[name]) throw new Error(`Object ${name} does not exist`);
    let activeTriggers = [];
    let validScripts = [];
    for (let i = 0; i < scripts.length; i++) {
      let script = this.#parseCommand(scripts[i]);
      if (!script.isValid) continue;
      let actionsValid = true;
      for (let j = 0; j < script.actions.length; j++) {
        if (script.actions[j].isValid) continue;
        actionsValid = false;
        break;
      }
      if (!actionsValid) continue;
      activeTriggers.push(script.trigger);
      validScripts.push(script);
    }
    this.#objects[name].activeTriggers = activeTriggers;
    this.#objects[name].scripts = validScripts;
  }

  /**
   * Check if a given command string matches a pattern and returns the extracted parameters
   * @param {string} commandString
   * @param {string} pattern
   * @returns {object} object containing the extracted parameters
   */
  #matchAndExtractParams(commandString, pattern) {
    const patternTokens = pattern.split(" ");
    const commandTokens = commandString.split(" ");

    let commandIndex = 0;
    const params = {};

    for (const token of patternTokens) {
      if (token.startsWith("[")) { // Variable placeholder
        if (commandIndex >= commandTokens.length) return null;
        const paramName = token.substring(1, token.length - 1); // Remove brackets
        params[paramName] = commandTokens[commandIndex];
        commandIndex++;
      } else { // Fixed word
        if (commandTokens[commandIndex] !== token) return null;
        commandIndex++;
      }
    }

    // Ensure we've consumed all parameters
    if (commandIndex !== commandTokens.length) return null;

    return params;
  }

  /**
   * Parse a command string into a trigger and actions
   * @param {string} command
   * @returns {object} { isValid: boolean, trigger: string, triggerParams: object, actions: array }
   */
  #parseCommand(command) {
    if (!command) return null;
    const result = {
      isValid: false,
      trigger: null,
      triggerParams: {},
      actions: []
    };

    // Split the command into "When ... then ..." parts
    const [whenPart, thenPart] = command.split(" then ");
    const triggerString = whenPart.replace("When ", "");

    // Validate trigger using the grammar
    for (const [triggerKey, triggerExamples] of Object.entries(this.#grammar.triggers)) {
      for (const example of triggerExamples) {
        const extractedParams = this.#matchAndExtractParams(triggerString, example);
        if (extractedParams) {
          result.isValid = true;
          result.trigger = triggerKey;
          result.triggerParams = extractedParams;
          break;
        }
      }

      if (result.isValid) break;
    }

    // Validate actions using the grammar
    const actions = thenPart.split(", ").map(action => {
      let isValid = false;
      let actionName = '';
      let extractedParams = {};

      for (const [possibleActionName, actionExamples] of Object.entries(this.#grammar.actions)) {
        for (const example of actionExamples) {
          extractedParams = this.#matchAndExtractParams(action, example);
          if (extractedParams) {
            isValid = true;
            actionName = possibleActionName;
            break;
          }
        }

        if (isValid) break;
      }

      return {
        isValid,
        actionName,
        params: extractedParams
      };
    });

    result.actions = actions;

    return result;
  }
}