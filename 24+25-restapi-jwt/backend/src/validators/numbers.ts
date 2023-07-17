import { validate } from 'validate.js';
//usage
//import validate from 'validate.js'
// import floatWithTwoDecimals from '../validation/numbers';
// validate.validators.floatWithTwoDecimals;

//custom validator
export const floatWithTwoDecimals = (value: string) => {
  if (!value) {
    // Return undefined if the value is empty
    return undefined;
  }

  if (!/^\d+(\.\d{2})?$/.test(value)) {
    // Return an error message if the value doesn't match the pattern
    return 'must be a float with exactly two decimal places';
  }
};
