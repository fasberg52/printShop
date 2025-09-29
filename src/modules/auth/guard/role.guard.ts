import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/check-role.decorator';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { RoleEnum } from 'src/common/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      throw new ForbiddenException('You do not have the necessary role to access this resource.');
    }

    const hasRole = () => requiredRoles.some((role) => user.roles?.includes(role));

    if (!hasRole()) {
      throw new ForbiddenException('You do not have the necessary role to access this resource.');
    }

    return true;
  }
}
