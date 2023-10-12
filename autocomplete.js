/**
 * Given a command string, return a list of valid next words.
 *
 * @param {string} command - The current command string.
 * @returns {Array<string>} - A list of valid next words.
 */
export function getAutocompletions(command) {
  const words = command.split(" ");
  let node = syntaxTree;

  for (const word of words) {
    if (node[word]) {
      node = syntaxTree[word];
    } else {
      return [];  // Invalid command
    }
  }

  return node.next || [];
}
