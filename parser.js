/**
 * Parse a single command into its components.
 *
 * @param {string} command - The command string to parse.
 * @returns {object} - An object containing the components of the command.
 */
export function parseCommand(command) {
  const result = {
    trigger: null,
    triggerParams: [],
    actions: []
  };

  // Split the command into "When ... then ..." parts
  const [whenPart, thenPart] = command.split(" then ");

  // Extract the trigger and its parameters after "When"
  const [trigger, ...triggerParams] = whenPart.replace("When ", "").split(" ");
  result.trigger = trigger.trim();
  result.triggerParams = triggerParams.map(param => param.trim());

  // Split actions by commas
  const actions = thenPart.split(", ").map(action => {
    const [actionName, ...params] = action.split(" ");
    return {
      actionName: actionName.trim(),
      params: params.map(param => param.trim())
    };
  });

  result.actions = actions;

  return result;
}

/**
 * Parse multiple commands into a structured format.
 *
 * @param {Array<string>} commands - An array of command strings.
 * @returns {Array<object>} - An array of parsed commands.
 */
export function parseCommands(commands) {
  return commands.map(command => parseCommand(command));
}
