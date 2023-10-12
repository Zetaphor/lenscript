# Lenscript

This is an experimental project implementing a version of the scripting language from Anyland in Javascript.

http://anyland.com/scripting/

The long-term goal of this project is to enable the use of this language on Overte, and possibly other platforms.

### Why is it called Lenscript?

Anyland was developed by Philipp Lenssen so the name is an homage to him for the original concepts of the Anyland scripting language. Also it abbreviates nicely to LS.

### Architecture Overview

Lenscript operates on a scene graph made up of state-managed objects. Each of these objects has named multiple states, which are collections of different types of properties: interface properties, trigger properties, and user-defined variables. The scene graph can also store user-defined variables which can be read by all objects.

**Hierarchy:**
  - LenscriptScene
    - User-defined variables
    - LenscriptObject
      - User-defined variables
      - States
        - Properties
          - Interface Properties (e.g., Color, Position, Scale)
          - Trigger Properties (e.g., Touching, Hovering, Visible)

#### Property Types:

- **Interface Properties**: These are properties that signal changes to the external interface. Examples include browser, game engine, or virtual world platforms.

- **Trigger Properties**: These are properties that respond to events or changes coming from the external interface. For instance, they detect when an object is hovered over or clicked.

#### Goal:

The primary objective is to isolate the internal behavior of Lenscript from the specifics of the environment it operates in. This ensures that Lenscript scripts work the same way internally, regardless of the external host engine. Any differences arise solely due to how the host engine interacts with Lenscript's property mutations.

