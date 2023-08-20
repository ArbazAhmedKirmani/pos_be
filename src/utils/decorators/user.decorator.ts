import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../interfaces';

export const User = createParamDecorator(
  (names: string | Array<string>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let names_array = new Array();
    let request_user = request.user;
    if (names) {
      request_user = new Object();
      names_array = Array.isArray(names) ? names : [names];
      names_array.forEach((name) => (request_user[name] = request.user[name]));
    }
    const user: AuthUser = request_user; // Assuming the user data is stored in the request's user property
    return user;
  },
);
