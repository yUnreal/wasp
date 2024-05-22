import { Cache } from '../structs/Cache';
import { CacheOptions } from '../typings/model';

export abstract class BaseCache<K, V> {
    public cache: Cache<K, V>;

    public constructor(options: CacheOptions) {
        this.cache = new Cache<K, V>(options);
    }
}
