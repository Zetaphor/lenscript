class lenscriptObject {
  variables = {};
  currentState = 'default';
  states = {};
  parentScene = null;
  constructor(name, defaultProperties) {
    if (!name) throw new Error('Object must have a name');
    if (!defaultProperties) throw new Error('Object must have default properties');

    this.name = name;
    this.states = { 'default': defaultProperties };
  }
}

export class lenscriptScene {
  #variables = {};
  #children = {};
  #stateUpdateCallback = null;
  #actionCallback = null;
  #grammar = null

  /**
   * Validate the scene
   *
   * @throws {Error} if the scene does not have a state update callback
   * @throws {Error} if the scene does not have an action callback
   * @throws {Error} if the scene does not have a grammar
   */
  #validateScene() {
    if (!this.#stateUpdateCallback) throw new Error('Scene must have a state update callback');
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
   * @throws {Error} if the scene does not have a transition callback
   */
  #objectStateUpdated(name, details, state) {
    if (!this.#stateUpdateCallback) throw new Error('Scene must have a transition callback');
    this.#stateUpdateCallback(name, details, state);
  }

  /**
   * Set the state update callback function
   *
   * @param {function} callback
   * @throws {Error} if the scene does not have a state update callback
   */
  registerStateUpdateCallback(callback) {
    if (typeof callback !== 'function') throw new Error('State update callback must be a function');
    this.#stateUpdateCallback = callback;
  }

  /**
   * Set the action callback function
   *
   * @param {function} callback
   * @throws {Error} if the scene does not have an action callback
   */
  registerActionCallback(callback) {
    if (typeof callback !== 'function') throw new Error('Action callback must be a function');
    this.#actionCallback = callback;
  }

  /**
   * Set the command grammar for parsing commands
   *
   * @param {object} grammar
   * @throws {Error} if the grammar is not an object
   * @throws {Error} if the grammar triggers is not an object
   * @throws {Error} if the grammar actions is not an object
   */
  registerGrammar(grammar) {
    if (typeof grammar !== 'object') throw new Error('Grammar must be an object');
    if (typeof grammar['triggers'] !== 'object') throw new Error('Grammar triggers must be an object');
    if (typeof grammar['actions'] !== 'object') throw new Error('Grammar actions must be an object');
    this.#grammar = grammar;
  }

  /**
   * Trigger an action
   *
   * @param {string} name
   * @param  {...any} params
   * @throws {Error} if the object does not exist
   * @throws {Error} if the trigger does not exist
   */
  trigger(name, trigger, ...params) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    if (!this.#grammar.triggers[trigger]) throw new Error(`Trigger ${trigger} does not exist`);
    const objectTriggers = this.objectTriggers(name);
    if (!objectTriggers.includes(trigger)) throw new Error(`Object ${name} does not have trigger ${trigger}`);
    const sceneObject = this.object(name);
    const script = sceneObject.parsedScripts.find(script => script.trigger === trigger);
    for (let i = 0; i < script.actions.length; i++) {
      this.#actionCallback(name, script.actions[i].actionName, script.actions[i].params);
    }
  }

  /**
   * Add an object to the scene
   *
   * @param {string} name
   * @param {object} properties
   * @throws {Error} if the object already exists
   * @throws {Error} if the object does not have a name
   * @throws {Error} if the object does not have properties
   */
  add(name, properties) {
    this.#validateScene();
    if (!name) throw new Error('Object must have a name');
    if (!properties) throw new Error('Object must have properties');
    if (this.#children[name]) throw new Error(`Object ${name} already exists`);
    this.#children[name] = {
      object: new lenscriptObject(name, properties),
      activeTriggers: [],
      scripts: [],
      parsedScripts: [],
    }
  }

  /**
   * Remove an object from the scene
   *
   * @param {string} name
   * @throws {Error} if the object does not exist
  */
  remove(name) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    delete this.#children[name];
  }

  /**
   * Get or set a global scene variable value. If no value is provided the value of the variable is returned
   * Returns an empty string if the variable is undefined
   *
   * @param {string} name the name of the scene variable
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
   * @returns {lenscriptObject} { name, properties, variables, scripts }
   * @throws {Error} if the object does not exist
   */
  object(name) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    return {
      name: name,
      state: this.#children[name].object.currentState,
      triggers: this.#children[name].activeTriggers,
      properties: this.#children[name].object.states[this.#children[name].object.currentState],
      variables: this.#children[name].object.variables,
      scripts: this.#children[name].scripts,
      parsedScripts: this.#children[name].parsedScripts,
    }
  }

  /**
   * Get all of the objects in the scene
   *
   * @returns {array<lenscriptObject>} the scene objects
   */
  objects() {
    this.#validateScene();
    return Object.values(this.#children).map(object => {
      return this.object(object.name);
    });
  }

  /**
   * Get all of the scripts for an object
   *
   * @param {string} name
   * @returns {array<string>} an array of scripts
   * @throws {Error} if the object does not exist
   */
  objectScripts(name) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    return this.#children[name].scripts;
  }

  /**
   * Get all of the triggers for an object
   *
   * @param {string} name
   * @returns {array<string>} an array of triggers
   * @throws {Error} if the object does not exist
   */
  objectTriggers(name) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    return this.#children[name].activeTriggers;
  }

  /**
   * Get or set an object state. If no value is provided the value of the state is returned
   *
   * @param {string} name
   * @param {string} value optional value, if not provided the value of the state is returned
   * @returns {string} the state*
   * @throws {Error} if the object does not exist
   * @throws {Error} if the state does not exist
   */
  objectState(name, value = null) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    if (value === null) return this.#children[name].object.states[this.#children[name].object.currentState];
    if (this.#children[name].object.states[value] === undefined) {
      throw new Error(`Object ${name} does not have a state ${value}`);
    }
    else {
      this.#stateUpdateCallback(name, { reason: 'stateChange', prevState: this.#children[name].object.currentState, newState: value }, this.#children[name].object.states[value]);
      this.#children[name].object.currentState = value;
    }
  }

  /**
   * Add a state to an object
   *
   * @param {string} name
   * @param {string} state
   * @param {object} properties
   * @throws {Error} if the object does not exist
   * @throws {Error} if the state already exists
   * @throws {Error} if the properties are not an object
   */
  objectAddState(name, state, properties) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    if (this.#children[name].object.states[state] !== undefined) {
      throw new Error(`Object ${name} already has a state ${state}`);
    }
    if (typeof properties !== 'object') throw new Error('State properties must be an object');
    this.#children[name].object.states[state] = properties;
  }

  /**
   * Remove a state from an object. If the state is the current state, the current state will revert to the default state
   *
   * @param {string} name
   * @param {string} state
   * @throws {Error} if the object does not exist
   * @throws {Error} if the state does not exist
   * @throws {Error} if the state is the default state
   */
  objectRemoveState(name, state) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    if (this.#children[name].object.states[state] === undefined) {
      throw new Error(`Object ${name} does not have a state ${state}`);
    }
    if (state === 'default') throw new Error('Cannot remove the default state');
    if (this.#children[name].objects.currentState === state) this.objectState(name, 'default');
    delete this.#children[name].object.states[state];
  }

  /**
   * Get or set an object property value on the objects current state. If no value is provided the value of the property is returned
   *
   * @param {string} name
   * @param {string} property
   * @param {any} value optional value, if not provided the value of the property is returned
   * @returns {any} the property value
   * @throws {Error} if the object does not exist
   * @throws {Error} if the property does not exist
   */
  objectProperty(name, property, value = null) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    if (this.objecs[name].states[this.#children[name].object.currentState][property] === undefined) {
      throw new Error(`Object ${name} does not have a property ${property}`);
    }
    if (value === null) return this.#children[name].object.states[this.#children[name].object.currentState][property];
    else {
      this.#stateUpdateCallback(name, { reason: 'propertyChange', property: property, prevValue: this.#children[name].object.states[this.#children[name].object.currentState][property], newValue: value }, this.#children[name].object.states[value]);
      return this.#children[name].object.states[this.#children[name].object.currentState][property] = value;
    }
  }

  /**
   * Get or set an object variable value. If no value is provided the value of the variable is returned
   * Returns an empty string if the variable is undefined
   *
   * @param {string} name
   * @param {string} variable
   * @param {any} value optional value, if not provided the value of the variable is returned
   * @return {any} the variable value
   * @throws {Error} if the object does not exist
   * @throws {Error} if the variable does not exist
   */
  objectVariable(name, variable, value = null) {
    this.#validateScene();
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
    if (this.#children[name].variables[variable] === undefined) {
      throw new Error(`Object ${name} does not have a variable ${variable}`);
    }
    if (value === null) return this.#children[name].variables[variable];
    return this.#children[name].variables[variable] = value;
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
    if (!this.#children[name]) throw new Error(`Object ${name} does not exist`);
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
    this.#children[name].activeTriggers = activeTriggers;
    this.#children[name].parsedScripts = validScripts;
    this.#children[name].scripts = scripts;
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