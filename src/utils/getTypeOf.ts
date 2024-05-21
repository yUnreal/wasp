/* eslint-disable indent */
import isPlainObject from 'is-plain-obj';
import { SchemaTypes } from '../typings/schema';

export const getTypeOf = (value: unknown) => {
    if (value instanceof RegExp) return SchemaTypes.RegExp;
    if (value instanceof Map) return SchemaTypes.Map;
    if (value instanceof Date) return SchemaTypes.Date;
    if (Array.isArray(value)) return SchemaTypes.Array;
    if (isPlainObject(value)) return SchemaTypes.Object;

    const UUID_V4_PATTERN =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    switch (typeof value) {
        case 'string':
            if (UUID_V4_PATTERN.test(value)) return SchemaTypes.UUID;

            return SchemaTypes.String;
        case 'number':
            return SchemaTypes.Number;
        case 'bigint':
            return SchemaTypes.BigInt;
        case 'boolean':
            return SchemaTypes.Boolean;
        default:
            throw new Error(`Could not get type from "${value}"`);
    }
};
