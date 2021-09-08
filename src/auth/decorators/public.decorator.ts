import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * Provides a decorator that is used with guards to allow access to unauthenticated methods.
 * @constructor
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
