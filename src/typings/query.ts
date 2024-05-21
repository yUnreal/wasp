import { InferType, SchemaTypes } from './schema';
import { DeepPartial, PartialRecord } from './utils';

/**
 * Options used when querying document(s)
 */
export interface QueryOptions<
    T extends Record<string, unknown>,
    K extends keyof T = keyof T,
> {
    /**
     * The query object to find the document(s)
     */
    query: (DeepPartial<T> | PartialRecord<K, InferQuery<T[K]>>) & {
        /**
         * The unique object ID
         */
        id?: string;
    };
    /**
     * The projection to use when returning the document(s) found
     */
    projection?: Projection<T>;
    /**
     * Amount of documents to skip before querying
     */
    skip?: number;
}

/**
 * Options used when deleting a document
 */
export interface DeleteOneOptions<T extends Record<string, unknown>>
    extends QueryOptions<T> {
    /**
     * Whether should thrown an error if the document is not found
     */
    throw?: true;
}

/**
 * Options used when updating a document
 */
export interface UpdateOneOptions<T extends Record<string, unknown>> {
    /**
     * The keys to set/update the value
     */
    Set?: DeepPartial<T>;
    /**
     * The keys to remove/delete
     */
    Remove?: (keyof T)[];
}

/**
 * Utility type for projecting document(s)
 */
export type Projection<T extends Record<string, unknown>> =
    | {
          /**
           * Whether the key must be selected or not
           */
          [K in keyof T]?: boolean;
      }
    | (keyof T)[];

/**
 * All query operators
 */
export enum Operators {
    // Any
    Equal = 'Equal',
    NotEqual = 'NotEqual',
    In = 'In',
    Exists = 'Exists',
    And = 'And',
    Or = 'Or',
    Where = 'Where',

    // Number
    Greater = 'Greater',
    GreaterThanOrEqual = 'Gte',
    Less = 'Less',
    LessThanOrEqual = 'Lts',

    // String
    Length = 'Length',
    Includes = 'Includes',

    // Map
    Size = 'Size',

    // RegExp
    Matches = 'Matches',
}

export interface BaseQuery {
    [Operators.Equal]?: unknown;
    [Operators.NotEqual]?: unknown;
    [Operators.In]?: unknown[];
    [Operators.Exists]?: boolean;
    [Operators.And]?: Record<
        string,
        Omit<AnyQuery, Operators.And | Operators.Or>
    >[];
    [Operators.Or]?: Record<
        string,
        Omit<AnyQuery, Operators.And | Operators.Or>
    >[];
    [Operators.Where]?(...values: unknown[]): boolean;
}

export interface NumberBasedQuery extends BaseQuery {
    [Operators.Greater]?: number;
    [Operators.Less]?: number;
    [Operators.LessThanOrEqual]?: number;
    [Operators.GreaterThanOrEqual]?: number;
}

export interface StringBasedQuery extends BaseQuery {
    [Operators.Length]?: number;
    [Operators.Includes]?: string;
}

export type ArrayBasedQuery = StringBasedQuery;

export type DateBasedQuery = NumberBasedQuery;

export interface MapBasedQuery extends BaseQuery {
    [Operators.Size]?: number;
}

export type BooleanBasedQuery = BaseQuery;

export interface RegExpBasedQuery extends BaseQuery {
    [Operators.Matches]?: string;
}

export interface MappedQuery {
    [SchemaTypes.Number]: NumberBasedQuery;
    [SchemaTypes.String]: StringBasedQuery;
    [SchemaTypes.Boolean]: BooleanBasedQuery;
    [SchemaTypes.Array]: ArrayBasedQuery;
    [SchemaTypes.BigInt]: NumberBasedQuery;
    [SchemaTypes.Date]: DateBasedQuery;
    [SchemaTypes.Map]: MapBasedQuery;
    [SchemaTypes.Object]: Record<string, BaseQuery>;
    [SchemaTypes.UUID]: BaseQuery;
    [SchemaTypes.RegExp]: RegExpBasedQuery;
}

/**
 * All available objetct queries
 */
export type AnyQuery = MappedQuery[SchemaTypes];

/**
 * Infer the query
 */
export type InferQuery<T> = MappedQuery[InferType<T>];
