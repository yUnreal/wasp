import { CacheOptions } from '../typings/model';

export class Cache<K, V> extends Map<K, V> {
    public constructor(public options: CacheOptions) {
        super();
    }

    public set(key: K, value: V) {
        if (this.size === this.options.limit) return this;

        setTimeout(() => this.delete(key), this.options.lifetime);

        return super.set(key, value);
    }
}
