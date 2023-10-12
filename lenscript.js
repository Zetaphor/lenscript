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

  addState(name, properties = {}) {
    this.states[name] = new lenscriptObjectProperties(properties);
  }

  setName(name) {
    this.name = name;
  }

  setState(name) {
    this.currentState = name;
  }
}

export class lenscriptScene {
  constructor(name, objects = []) {
    this.objects = objects;
    this.variables = {};
  }
}