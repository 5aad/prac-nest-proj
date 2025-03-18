import { ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class UserCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    // If the request has an authenticated user, include the user ID in the cache key
    if (request.user && request.user.id) {
      return `user:${request.user.id}`;
    }
    // Fallback to the default key generation
    return super.trackBy(context);
  }
}
