import { Request } from 'express';

export interface IRequest {
  userId?: string;
  body: {
    data?: Record<string, any>;
  };
}
