// IApiResponse is generic for IJsonapiError type or IJsonapiSuccess type
export interface IJsonApiResponse<T = object, K = object | undefined> {
  errors?: IJsonapiError<T>;
  data?: T;
  meta?: K;
}

// ---------------------------------------------------------------------------------

type JsonapiError = {
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
  meta?: Record<string, any>;
};

export interface IJsonapiError<T = object> {
  errors: T | T[];
}

type JsonapiLoginSuccessMeta = {
  message: string;
  token: string;
};

export interface IJsonapiSuccess {
  data: {
    id: string;
    type: string;
    attributes: Record<string, any>;
  };
  meta?: {
    token?: string;
    message?: string;
  };
}
