import { createClient, RedisClient } from 'redis';
import { redisConfig } from 'src/configs/configs.constants';
import { promisify } from 'util';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';
@Injectable()
export class RedisService {
  private readonly redisClient: RedisClient;
  private readonly hget: any;
  private readonly hset: any;
  private readonly del: any;
  private readonly hdel: any;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.redisClient = createClient(redisConfig);
    this.hget = promisify(this.redisClient.hget).bind(this.redisClient);
    this.hset = promisify(this.redisClient.hset).bind(this.redisClient);
    this.del = promisify(this.redisClient.del).bind(this.redisClient);
    this.hdel = promisify(this.redisClient.hdel).bind(this.redisClient);
  }

  async hsetAsync(key: string, field: string, value: string) {
    return this.hset(key, field, value);
  }

  async hgetAsync(key: string, field: string) {
    return this.hget(key, field);
  }

  async delAsync(key: string) {
    return this.del(key);
  }

  async hdelAsync(key: string, field: string) {
    return this.hdel(key, field);
  }

  async set<T>(key: string, value: T, options?: CachingConfig): Promise<T> {
    return this.cacheManager.set(key, value, options);
  }

  async get(key: string): Promise<unknown> {
    return this.cacheManager.get(key);
  }

  async getObject<T>(key: string): Promise<T> {
    return (this.cacheManager.get(key) as unknown) as T;
  }
}
