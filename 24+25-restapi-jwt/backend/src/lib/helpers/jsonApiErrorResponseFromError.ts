import { IError } from '../interfaces/IError';
import { IJsonApiError } from '../interfaces/IJsonApiError';

//returns error (singular)
export const jsonApiErrorResponseFromError = (error: IError, meta?: Record<string, any>) => {
  const jsonApiErrorResponse: IJsonApiError = {
    id: error.name,
    status: error.statusCode ? error.statusCode : 500,
    title: error.message,
    detail: error.stack,
  };

  if (meta) {
    return { errors: [{ ...jsonApiErrorResponse, meta }] };
  }
  return { errors: [{ ...jsonApiErrorResponse }] };
};
