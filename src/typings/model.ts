import { JSONBasedDriver } from '../drivers/JSONBasedDriver';
import { Schema } from '../structs/Schema';
import { Infer } from './schema';
import { AnyObject } from './utils';

/**
 * Options used when creating a new model
 */
export interface ModelOptions<S extends Schema<AnyObject>> {
    /**
     * The name of the model, must be unique
     */
    name: string;
    /**
     * The schema to validate any data
     */
    schema: S;
    /**
     * The global cache options for this model
     */
    cache?: CacheOptions;
    /**
     * Whether the model is strict or not
     */
    strict?: true;
    /**
     * The driver of the schema
     */
    driver?: AnyDriver<S>;
}

/**
 * Options that can be used for global model cache
 */
export interface CacheOptions {
    /**
     * The limit of documents to store in the cache
     */
    limit?: number;
    /**
     * The lifetime of each document
     */
    lifetime: number;
}

/**
 * Any primitive driver
 */
export type AnyDriver<S extends Schema<AnyObject>> = JSONBasedDriver<Infer<S>>;
