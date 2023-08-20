import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export const Authorized = (roles: UserRole | Array<UserRole>) => {
  let authorizedRoles = [];
  if (roles) authorizedRoles = Array.isArray(roles) ? roles : [roles];
  return applyDecorators(
    SetMetadata('roles', authorizedRoles),
    ApiBearerAuth('access-token'),
  );
};
