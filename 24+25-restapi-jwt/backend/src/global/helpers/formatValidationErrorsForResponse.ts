import { JsonApiError } from '../interfaces/JsonApiError';
import { ValidateJsError } from '../interfaces/ValidateJsError';

export const formatValidationErrorsForResponse = (
  errors: Array<ValidateJsError>
) => {
  return errors.map((e: ValidateJsError) => {
    return {
      status: '422',
      source: { pointer: `data/attributes/${e.attribute}` },
      title: `Invalid ${e.attribute}`,
      detail: e.error,
    } as JsonApiError;
  });
};
