export interface IJsonapiError {
  id?: string;
  links?: {
    about?: string;
    type?: string;
  };
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
    header?: string;
  };
  meta?: object;
}

// validatejs error: when validation fails
export interface IValidatejsError {
  attribute: string;
  value?: any;
  validator: string;
  globalOptions: {
    format: string;
  };
  attributes: {
    [key: string]: any;
  };
  options:
    | boolean
    | {
        minimum?: number;
        maximum?: number;
        message?: string;
        [key: string]: any;
      };
  error: string;
}

// this works for errors returned from "detailed" format: validate.async(resourceAttributes, authLoginValidation, { format: 'detailed' })
export const makeJsonapiErrorsResponse = (errors: Array<IValidatejsError>) => {
  return errors.map((e: IValidatejsError) => {
    return {
      status: '422',
      source: { pointer: `data/attributes/${e.attribute}` },
      title: `Invalid ${e.attribute}`,
      detail: e.error,
    } as IJsonapiError;
  });
};
