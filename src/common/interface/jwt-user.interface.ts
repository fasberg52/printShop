import { Types } from 'mongoose';

export interface JwtUserInterface {
  _id: Types.ObjectId;
  sub: string;
  phone: string;
  roles: string[];
  iat: number;
  exp: number;
}
