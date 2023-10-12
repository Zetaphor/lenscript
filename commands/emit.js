export function emit(params) {
  // Emit something
  console.log(`Emitting: ${params.join(' ')}`);
  return `Emitted: ${params.join(' ')}`;
}