import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export const Authorized = (roles: UserRole | Array<UserRole> | boolean) => {
  let authorizedRoles: Array<UserRole | true> | boolean | UserRole =
    Object.values(UserRole).filter(
      (role: UserRole) => role !== UserRole.CASHIER,
    );
  if (roles) authorizedRoles = Array.isArray(roles) ? roles : [roles];
  return applyDecorators(
    SetMetadata('roles', authorizedRoles),
    ApiBearerAuth('access-token'),
    ApiHeader({ name: 'locale' }),
  );
};
