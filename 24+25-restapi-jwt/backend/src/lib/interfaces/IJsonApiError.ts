//what the error for jsonApi should look like
export interface IJsonApiError {
  id?: string;
  links?: {
    about?: string;
    type?: string;
  };
  status?: number;
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
