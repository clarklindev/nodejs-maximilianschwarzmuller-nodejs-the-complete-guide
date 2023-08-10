import { IJsonApiError } from '../interfaces/IJsonApiError';
import { IValidateJsError } from '../interfaces/IValidateJsError';

//returns array
// this works for errors returned from "detailed" format: validate.async(resourceAttributes, authLoginValidation, { format: 'detailed' })
export const jsonApiErrorResponseFromValidateJsError = (errors: IValidateJsError[]): Array<IJsonApiError> => {
  return errors.map((e: IValidateJsError) => {
    return {
      status: 422,
      source: { pointer: `data/attributes/${e.attribute}` },
      title: `Invalid ${e.attribute}`,
      detail: e.error,
    };
  });
};
