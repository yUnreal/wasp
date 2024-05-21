import { Schema } from '../structs/Schema';
import { ArraySchemaKey } from '../structs/schema/ArraySchemaKey';
import { BigIntSchemaKey } from '../structs/schema/BigIntSchemaKey';
import { BooleanSchemaKey } from '../structs/schema/BooleanSchemaKey';
import { DateSchemaKey } from '../structs/schema/DateSchemaKey';
import { MapSchemaKey } from '../structs/schema/MapSchemaKey';
import { NumberSchemaKey } from '../structs/schema/NumberSchemaKey';
import { ObjectSchemaKey } from '../structs/schema/ObjectSchemaKey';
import { RegexSchemaKey } from '../structs/schema/RegexSchemaKey';
import { StringSchemaKey } from '../structs/schema/StringSchemaKey';
import { UUIDSchemaKey } from '../structs/schema/UUIDSchemaKey';
import { AnyObject, UUID } from './utils';

/**
 * Types availables when creating a new schema key
 */
export enum SchemaTypes {
    String = 1,
    Number,
    Boolean,
    Array,
    Object,
    //Union,
    BigInt,
    Date,
    Map,
    RegExp,
    UUID,
}

export type JSONValue =
    | string
    | number
    | boolean
    | JSONValue[]
    // TODO: Fix this later
    | Record<string, unknown>
    | null;

export interface MappedSchemaTypes {
    [SchemaTypes.Boolean]: boolean;
    [SchemaTypes.Number]: number;
    [SchemaTypes.String]: string;
    [SchemaTypes.Array]: unknown[];
    [SchemaTypes.Object]: AnyObject;
    [SchemaTypes.BigInt]: bigint;
    [SchemaTypes.Date]: Date;
    [SchemaTypes.Map]: Map<string, unknown>;
    [SchemaTypes.Json]: JSONValue;
    [SchemaTypes.RegExp]: RegExp;
    [SchemaTypes.UUID]: UUID;
}

/**
 * Options when creating a schema key
 */
export interface SchemaKeyOptions<Type extends SchemaTypes> {
    /**
     * The type of the schema key
     */
    type: Type;
    /**
     * Whether this schema is optional or not
     */
    optional?: true;
    /**
     * The default function for a default data
     */
    default?(): MappedSchemaTypes[Type];
    /**
     * Whether the schema is nullable or not
     */
    nullable?: true;
    /**
     * The cast function when validating a schema key
     *
     * @example
     * type User = {
     *    username: string;
     * }
     *
     * const username = Schema.string().cast(String);
     * const userSchema = new Schema<User>({
     *    username,
     * });
     *
     * // Works fine, `10` will be casted to String(10)
     * userSchema.parse(10);
     */
    cast?(value: unknown): MappedSchemaTypes[Type];
}

/**
 * Options that can be used when creating a new schema
 */
export interface SchemaOptions {
    /**
     * Whether the schema is strict or not
     */
    strict?: boolean;
}

/**
 * Infer the schema object based in any POJO (Plain Old JavaScript Object)
 *
 * type User = {
 *    username: string;
 *    age: number;
 * }
 *
 * // { username: StringSchemaKey; age: NumberSchemaKey; }
 * type T1 = InferSchema<User>;
 */
export type InferSchema<S extends AnyObject> = {
    [K in keyof S]: InferType<S[K]> extends SchemaTypes.Array
        ? ArraySchemaKey<MappedSchemaKeys[InferType<S[K][number]>]>
        : InferType<S[K]> extends SchemaTypes.Object
          ? {
                [Key in keyof S[K]]: S[K][Key] extends AnyObject | unknown[]
                    ? InferSchema<S[K][Key]>
                    : MappedSchemaKeys[InferType<S[K][Key]>];
            }
          : MappedSchemaKeys[InferType<S[K]>];
};

export interface MappedSchemaKeys {
    [SchemaTypes.Boolean]: BooleanSchemaKey;
    [SchemaTypes.Number]: NumberSchemaKey;
    [SchemaTypes.String]: StringSchemaKey;
    [SchemaTypes.Array]: ArraySchemaKey<AnySchemaKey>;
    [SchemaTypes.Object]: ObjectSchemaKey<ObjectShape>;
    [SchemaTypes.BigInt]: BigIntSchemaKey;
    [SchemaTypes.Date]: DateSchemaKey;
    [SchemaTypes.Map]: MapSchemaKey<AnySchemaKey, AnySchemaKey>;
    [SchemaTypes.RegExp]: RegexSchemaKey;
    [SchemaTypes.UUID]: UUIDSchemaKey;
}

export type ObjectShape = Record<string, AnySchemaKey>;

/**
 * All schemas key available
 */
export type AnySchemaKey =
    | BooleanSchemaKey
    | NumberSchemaKey
    | StringSchemaKey
    | ArraySchemaKey<AnySchemaKey>
    | ObjectSchemaKey<ObjectShape>
    | BigIntSchemaKey
    | DateSchemaKey
    | MapSchemaKey<AnySchemaKey, AnySchemaKey>
    | RegexSchemaKey
    | UUIDSchemaKey;

/**
 * Infer the type of a value based in itself
 */
export type InferType<S> = S extends MappedSchemaTypes[SchemaTypes]
    ? S extends RegExp
        ? SchemaTypes.RegExp
        : S extends UUID
          ? SchemaTypes.UUID
          : S extends boolean
            ? SchemaTypes.Boolean
            : S extends string
              ? SchemaTypes.String
              : S extends Date
                ? SchemaTypes.Date
                : S extends Map<string, any>
                  ? SchemaTypes.Map
                  : S extends number
                    ? SchemaTypes.Number
                    : S extends unknown[]
                      ? SchemaTypes.Array
                      : S extends AnyObject
                        ? SchemaTypes.Object
                        : S extends bigint
                          ? SchemaTypes.BigInt
                          : never
    : never;

/**
 * Infer the raw type of a schema
 *
 * // { username: string; age: number; }
 * type T1 = Infer<typeof userSchema>;
 */
export type Infer<S extends Schema<AnyObject>> = S extends Schema<infer T>
    ? T
    : never;

/**
 * Options used when creating a new effect in a schema key
 */
export interface SchemaKeyEffect<Type extends SchemaTypes> {
    /**
     * The function used to validate the effect
     * @param value The value to use
     */
    effect: (value: MappedSchemaTypes[Type]) => boolean;
    /**
     * The error message when the effect is not successfull
     */
    message?: string;
}
