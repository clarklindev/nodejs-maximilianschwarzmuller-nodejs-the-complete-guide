import validate from 'validate.js';

import { floatWithTwoDecimals } from './numbers';

validate.validators.floatWithTwoDecimals = floatWithTwoDecimals; //even though you can define the function directly on validate.validators, i use import to remember where it comes from.

export default validate;
