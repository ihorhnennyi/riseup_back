import { User } from '../user/schemas/user.schema';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
