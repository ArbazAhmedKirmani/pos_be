import { SetMetadata, applyDecorators } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => {
  return applyDecorators(SetMetadata(IS_PUBLIC_KEY, true));
};
