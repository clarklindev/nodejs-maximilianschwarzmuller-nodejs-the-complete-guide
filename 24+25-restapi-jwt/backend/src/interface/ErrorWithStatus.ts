export interface ErrorWithStatus extends Error {
  statusCode?: number;
}
