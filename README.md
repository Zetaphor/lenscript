# Lenscript

This is an experimental project implementing a version of the scripting language from Anyland in Javascript.

http://anyland.com/scripting/

The long-term goal of this project is to enable the use of this language on Overte, and possibly other platforms.

### Why is it called Lenscript?

Anyland was developed by Philipp Lenssen so the name is an homage to him for the original concepts of the Anyland scripting language. Also it abbreviates nicely to LS.

### Architecture Overview

Lenscript operates on a scene graph made up of state-managed named objects. Each of these named objects has named multiple states, which are collections of different types of properties: interface properties, trigger properties, and user-defined variables. The scene graph can also store user-defined variables which can be read by all child objects.

**Hierarchy:**
  - LenscriptScene
    - User-defined variables
    - LenscriptObject
      - User-defined variables
      - Trigger Properties (e.g., Touching, Hovering, Visible)
      - Named States
        - Properties
          - Interface Properties (e.g., Color, Position, Scale)

#### Property Types:

- **Interface Properties**: These are properties that signal changes to the external interface. Interface properties are defined on the current state, and can be changed by the result of triggers or a state transition. Examples include browser, game engine, or virtual world platforms.

- **Trigger Properties**: These are properties that respond to events or changes coming from the external interface. Trigger properties are defined on the object separate from the state and thus are not affected by state changes. For instance, they are used to detect when an object is hovered over or clicked.

#### Goal:

The primary objective is to isolate the internal behavior of Lenscript from the specifics of the environment it operates in. This ensures that Lenscript scripts work the same way internally, regardless of the external host engine. Any differences arise solely due to how the host engine interacts with Lenscript's property mutations.

### Syntax

#### Overview

An object can contain multiple script lines. A script is a single line that takes the format of **When** _Trigger_ **Then** _Action_.

As an example:

> When touched then play success

This script line will trigger when the interface detects the object has been touched, and will respond by instructing the interface to play the "success" sound effect.

#### Multiple actions

Commands can also support multiple actions in response to a single trigger by separating each action with a comma, for example:

> When touched then play success, destroy

This script line is identical to the above line, except it will also destroy the object after triggering the sound effect.

#### Parameters

Triggers and actions are able to accept one or more parameters. These are defined by providing the data immediately after the invoking keyword:

##### Trigger Parameters

> When touched then play success 50% volume

##### Action Parameters

> When touched then emit bubbles

#### State Changes

Object properties are stored in their current state. Transitioning to another state will overwrite these properties with new or default values, facilitating easy animations and transitions.

Example: For a color-changing button, define each color in a separate state. Transition between states in response to a touch trigger.

State transitions are done using the "become" keyword, ex:

> When touched become pressed

The above script line will transition from the current state to a state named "pressed".

### Defined Properties

#### Trigger Properties

* `touching` - True when the object is actively being touched
* `hovering` - True when the object is actively being hovered by a selection pointer

#### Interface Properties

* `visible` - Boolean
* `position` - { x, y, z }
* `rotation` - { x, y, z, w }
* `color` - { r, g, b }
* `scale` - { x, y, z }
* `opacity` - Float