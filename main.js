import { parseCommands } from './parser.js';
import { executeCommand } from './commandRegistry.js';
import { isTriggerValid } from './triggerRegistry.js';





// Parse the commands
const parsedCommands = parseCommands(testCommands);

// Simulated event input (could be real event data in your actual application)
const simulatedInput = {
  // Any data that would be used to validate triggers
};

// Check and execute each parsed command
parsedCommands.forEach(parsedCommand => {
  const { trigger, triggerParams, actions } = parsedCommand;

  if (isTriggerValid(trigger, triggerParams, simulatedInput)) {
    actions.forEach(action => {
      const result = executeCommand(action.actionName, action.params);
      console.log(result);
    });
  }
});
