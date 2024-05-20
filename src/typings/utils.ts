export type AnyObject = Record<string, any>;

export type DeepPartial<T> = {
    [K in keyof T]?: DeepPartial<T[K]>;
};

export type PartialRecord<K extends PropertyKey, V> = Partial<Record<K, V>>;

export type IsExact<T, O> = [O] extends [T]
    ? [T] extends [O]
        ? true
        : false
    : false;