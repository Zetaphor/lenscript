# Lenscript

Lenscript is a scripting language inspired by the natural language state-machine based scripting system from Anyland.

http://anyland.com/scripting/

## Why is it called Lenscript?

Anyland was developed by Philipp Lenssen so the name is an homage to him for the original concepts of the Anyland scripting language. Also it abbreviates nicely to LS.

## Demo

[Click here](https://zetaphor.github.io/lenscript/interfaces/browser/) to test the browser interface implementation.

This implementation is using a browser specific grammar which can be found [here](https://github.com/Zetaphor/lenscript/blob/main/interfaces/browser/browser_grammar.js). The [`browser.js`](https://github.com/Zetaphor/lenscript/blob/main/interfaces/browser/browser.js) file contains the complete implementation for both the UI elements and the interaction with the lenscript engine. The implementation simply binds browser specific inputs to triggers (hover, click, drag) and then then updates the display of objects via CSS properties when a state property is mutated.


## Documentation

~~See [the wiki](https://github.com/Zetaphor/lenscript/wiki) for more information.~~

This needs to be completely rewritten. That will be done after I finish the browser implementation