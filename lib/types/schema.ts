import { AnySchemaKey } from '../structs/schema/AnySchemaKey';
import { BigIntSchemaKey } from '../structs/schema/BigIntSchemaKey';
import { BooleanSchemaKey } from '../structs/schema/BooleanSchemaKey';
import { DateSchemaKey } from '../structs/schema/DateSchemaKey';
import { NumberSchemaKey } from '../structs/schema/NumberSchemaKey';
import { Schema } from '../structs/schema/Schema';
import { StringSchemaKey } from '../structs/schema/StringSchemaKey';
import { AnyObject } from './utils';

export enum Types {
    String,
    Number,
    Boolean,
    BigInt,
    Date,
    Any,
}

export type SchemaDefinition = {
    [K: string]: SchemaKeyOptions<Types> | SchemaDefinition;
};

export interface SchemaKeyOptions<Type extends Types> {
    type: Type;
    flags: SchemaKeyFlags[];
}

export enum SchemaKeyFlags {
    Nullable = 'NULLABLE',
    Optional = 'OPTIONAL',
}

export interface MappedSchemaTypes {
    [Types.String]: string;
    [Types.Number]: number;
    [Types.Boolean]: boolean;
    [Types.BigInt]: bigint;
    [Types.Date]: Date;
    [Types.Any]: unknown;
}

export interface MappedSchemaKeys {
    [Types.String]: StringSchemaKey;
    [Types.Number]: NumberSchemaKey;
    [Types.Boolean]: BooleanSchemaKey;
    [Types.BigInt]: BigIntSchemaKey;
    [Types.Date]: DateSchemaKey;
    [Types.Any]: AnySchemaKey;
}

export type InferShape<S extends AnyObject> = {
    [K in keyof S]: MappedSchemaKeys[ExtractType<S[K]>];
};

export type ExtractType<S> = S extends string
    ? Types.String
    : S extends number
      ? Types.Number
      : S extends boolean
        ? Types.Boolean
        : S extends bigint
          ? Types.BigInt
          : S extends Date
            ? Types.Date
            : Types.Any;

export interface Constraint<Type extends Types> {
    effect(value: MappedSchemaTypes[Type]): unknown;
    message: string;
}

export enum Expression {
    Key = '{KEY}',
}

export type Infer<S extends Schema<AnyObject>> = S extends Schema<infer Shape>
    ? Shape
    : never;
