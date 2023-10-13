# Lenscript

This is an experimental project implementing a version of the scripting language from Anyland in Javascript.

http://anyland.com/scripting/

The long-term goal of this project is to enable the use of this language on Overte, and possibly other platforms.

## Why is it called Lenscript?

Anyland was developed by Philipp Lenssen so the name is an homage to him for the original concepts of the Anyland scripting language. Also it abbreviates nicely to LS.

## Architecture Overview

Lenscript operates on a scene graph made up of state-managed named objects. Each of these named objects has named multiple states, which are collections of different types of properties: interface properties, trigger properties, and user-defined variables. The scene graph can also store user-defined variables which can be read by all child objects.

**Hierarchy:**
  - LenscriptScene
    - User-defined variables
    - LenscriptObject
      - User-defined variables
      - Trigger Properties (e.g., Touching, Hovering)
      - Named States
        - Properties
          - Interface Properties (e.g., Color, Position, Scale)

### Goal:

The primary objective is to isolate the internal behavior of Lenscript from the specifics of the environment it operates in. This ensures that Lenscript scripts work the same way internally, regardless of the external host engine. Any differences arise solely due to how the host engine interacts with Lenscript's property mutations.

## Interfaces

In Lenscript an interface is defined as the operating context for the scene and objects. This context is where the output of the an objects state properties and transititions therein are made visible. An interface is responsible for handling the platform-specific details required to read and update the trigger and state properties of an object, as well as requesting state transitions.

Examples of practical implementations of such interfaces include 2D game engines intended for web browsers, such as PhaserJS, or 3D virtual world platforms like Overte.

## State Transitions

### Updating the Interface

An interface implementation can subscribe to state changes by registering a callback function with the `registerTransitionCallback` method on the `lenscriptScene` class. This callback will be triggered whenever an object in the scene transitions states. The callback method will be sent the object name, the previous state, the new state, and an object containing interface and trigger properties of the new state.

#### Example

```js
import { lenscriptScene } from './lenscript.js';

function objectTransitioned(name, prevState, nextState, state) {
  console.log(`Object ${name} transitioned from ${prevState} to ${nextState}`);
  console.log(state);
}

const scene = new lenscriptScene();

scene.registerTransitionCallback(objectTransitioned);

scene.add('testObject');
const testObject = scene.object('testObject');
// All objects are initalized with the "default" state
testObject.property('color', { r: 255, g: 0, b: 0 });
testObject.addState('hovering', { color: { r: 0, g: 255, b: 0 } });
testObject.setState('hovering');
```

Running this code will yield the following output:

```
Object testObject transitioned from default to hovering
lenscriptObjectProperties {
  touching: false,
  hovering: false,
  visible: true,
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0, w: 1 },
  color: { r: 0, g: 255, b: 0 },
  scale: { x: 1, y: 1, z: 1 },
  opacity: 1
}
```

### Property Types:

- **Interface Properties**: These are properties that signal changes to the external interface. Interface properties are defined on the current state, and can be changed by the result of triggers or a state transition. Examples include browser, game engine, or virtual world platforms.

- **Trigger Properties**: These are properties that respond to events or changes coming from the external interface. Trigger properties are defined on the object separate from the state and thus are not affected by state changes. For instance, they are used to detect when an object is hovered over or clicked.

## Syntax

### Overview

An object can contain multiple script lines. A script is a single line that takes the format of **When** _Trigger_ **Then** _Action_.

As an example:

> When touched then play success

This script line will trigger when the interface detects the object has been touched, and will respond by instructing the interface to play the "success" sound effect.

### Multiple actions

Commands can also support multiple actions in response to a single trigger by separating each action with a comma, for example:

> When touched then play success, destroy

This script line is identical to the above line, except it will also destroy the object after triggering the sound effect.

### Parameters

Triggers and actions are able to accept one or more parameters. These are defined by providing the data immediately after the invoking keyword:

#### Trigger Parameters

> When touched then play success 50% volume

#### Action Parameters

> When touched then emit bubbles

### State Changes

Object properties are stored in their current state. Transitioning to another state will overwrite these properties with new or default values, facilitating easy animations and transitions.

Example: For a color-changing button, define each color in a separate state. Transition between states in response to a touch trigger.

State transitions are done using the "become" keyword, ex:

> When touched become pressed

The above script line will transition from the current state to a state named "pressed".

## Object Properties

### Trigger Properties

* `touching` - True when the object is actively being touched
* `hovering` - True when the object is actively being hovered by a selection pointer

### Interface Properties

* `visible` - Boolean
* `position` - `{ x, y, z }`
* `rotation` - `{ x, y, z, w }`
* `color` - `{ r, g, b }`
* `scale` - `{ x, y, z }`
* `opacity` - Float