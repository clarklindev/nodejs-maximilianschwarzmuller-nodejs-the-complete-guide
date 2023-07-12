import User from '../../models/user';

import { Express } from "express-serve-static-core";
import session, { Session } from 'express-session';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
    session?: session 
  }
  interface Response {
    user?: User
  }
  interface Session extends session{
    user?: User
    isLoggedIn?: boolean
  }
}