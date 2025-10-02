import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestInfoDto } from 'src/dto/request-info.dto';

export const RequestInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestInfoDto => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return {
      ip: request.ip || '::1',
      userAgent: request.headers['user-agent'] || '',
    };
  },
);
