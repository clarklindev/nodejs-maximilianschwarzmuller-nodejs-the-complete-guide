// validatejs error: when validation fails this is the structure of validatejs error
export interface IValidateJsError {
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
