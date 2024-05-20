import { JSONBasedDriver } from '../drivers/JSONBasedDriver';
import { Schema } from '../structs/Schema';
import { Infer } from './schema';
import { AnyObject } from './utils';

export interface ModelOptions<S extends Schema<AnyObject>> {
    name: string;
    schema: S;
    cache?: CacheOptions;
    strict?: true;
    driver?: AnyDriver<S>;
}

export interface CacheOptions {
    limit?: number;
    lifetime: number;
}

export type AnyDriver<S extends Schema<AnyObject>> = JSONBasedDriver<Infer<S>>;
