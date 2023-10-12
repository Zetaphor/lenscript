import { parseCommands } from './parser.js';
import { executeCommand } from './commandRegistry.js';
import { isTriggerValid } from './triggerRegistry.js';

const testCommands = [
  "When shaken then play doorbell",
  "When touched then play doorbell with high-pitch 120% volume",
  "When shaken then play laughter, emit bubbles",
  "When starts then become next in 1s",
  "When starts then become 3 in 1s",
  "When touches red key 1 then tell open",
  "When walked into then send one nearby to buildtown"
];

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
