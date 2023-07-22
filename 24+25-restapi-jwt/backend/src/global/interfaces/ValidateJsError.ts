export interface ValidateJsError {
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
