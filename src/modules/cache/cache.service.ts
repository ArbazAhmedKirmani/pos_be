import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private _cacheService: Cache) {}

  public async Set(key: string, value: any, ttl: number = 0) {
    return await this._cacheService.set(key, JSON.stringify(value), ttl);
  }

  public async Get(key: string) {
    return JSON.parse(await this._cacheService.get(key));
  }

  public async Delete(key: string) {
    return await this._cacheService.del(key);
  }
}
