export function play(params) {
  // Perform the play action
  console.log(`Playing sound: ${params.join(' ')}`);
  return `Played sound: ${params.join(' ')}`;
}