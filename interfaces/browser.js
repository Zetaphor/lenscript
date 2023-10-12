import { parseCommands } from '../parser.js';
import { executeCommand } from '../commandRegistry.js';
import { isTriggerValid } from '../triggerRegistry.js';

const targetElement = document.getElementById('targetElement');

const targetInput = document.getElementById('commandInput');

let parsedCommands;


document.addEventListener('DOMContentLoaded', () => {
  console.log('Started');
});

targetInput.addEventListener('input', event => {
console.log('dsadsa')
});

targetElement.addEventListener('mouseenter', () => {

});

targetElement.addEventListener('mouseleave', () => {

});

targetElement.addEventListener('mousedown', () => {

});

targetElement.addEventListener('mouseup', () => {

});