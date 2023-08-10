import validate from 'validate.js';

import { isPhoneNumber } from './phoneNumber';
import { floatWithTwoDecimals } from './numbers';
import { emailAvailable } from './emailAvailable';

validate.validators.isPhoneNumber = isPhoneNumber;
validate.validators.floatWithTwoDecimals = floatWithTwoDecimals;
validate.validators.emailAvailable = emailAvailable;

export default validate;
