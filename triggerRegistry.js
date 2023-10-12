import * as shaken from './triggers/shaken.js';
import * as touched from './triggers/touched.js';

const triggerRegistry = {
  shaken: shaken.isShaken,
  touched: touched.isTouched,
};

export function isTriggerValid(triggerName, params, input) {
  if (triggerRegistry.hasOwnProperty(triggerName)) {
    return triggerRegistry[triggerName](params, input);
  }
  return false;
}
