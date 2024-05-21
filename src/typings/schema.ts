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
    Json,
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

export interface SchemaKeyOptions<Type extends SchemaTypes> {
    type: Type;
    optional?: true;
    default?(): MappedSchemaTypes[Type];
    nullable?: true;
    cast?(value: unknown): MappedSchemaTypes[Type];
}

export interface SchemaOptions {
    strict?: boolean;
}

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

export type Infer<S extends Schema<AnyObject>> = S extends Schema<infer T>
    ? T
    : never;

export interface SchemaKeyEffect<Type extends SchemaTypes> {
    effect: (value: MappedSchemaTypes[Type]) => boolean;
    message?: string;
}
