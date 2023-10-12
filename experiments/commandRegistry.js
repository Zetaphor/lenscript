import * as play from './commands/play.js';
import * as emit from './commands/emit.js';

const commandRegistry = {
  play: play.play,
  emit: emit.emit,
};

export function executeCommand(commandName, params) {
  if (commandRegistry.hasOwnProperty(commandName)) {
    return commandRegistry[commandName](params);
  }
  return `Command ${commandName} not found`;
}