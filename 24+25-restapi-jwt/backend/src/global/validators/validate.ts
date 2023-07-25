import validate from 'validate.js';

import { floatWithTwoDecimals } from './numbers';
import { emailExists } from './emailExists';
validate.validators.floatWithTwoDecimals = floatWithTwoDecimals; //even though you can define the function directly on validate.validators, i use import to remember where it comes from.
validate.validators.emailExists = emailExists;

export default validate;
