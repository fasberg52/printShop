import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserInterface } from '../interface/jwt-user.interface';

export const GetUser = createParamDecorator(
  (data: keyof JwtUserInterface | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtUserInterface }>();
    const user = request.user;
    if (!user) return null;
    return data ? user[data] : user;
  },
);
