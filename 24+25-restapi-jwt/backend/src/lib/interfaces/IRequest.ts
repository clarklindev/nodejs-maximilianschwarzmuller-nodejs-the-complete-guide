import { File } from 'buffer';
import { Request } from 'express';

export interface IRequest {
  userId?: string;
  body: {
    file?: File;
    data: Record<string, any>;
  };
}
