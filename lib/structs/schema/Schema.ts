import isPlainObject from 'is-plain-obj';
import { AnyObject } from '../../types/utils';
import { InferShape, SchemaKeyFlags, Types } from '../../types/schema';
import { StringSchemaKey } from './StringSchemaKey';
import { NumberSchemaKey } from './NumberSchemaKey';
import { BooleanSchemaKey } from './BooleanSchemaKey';
import { BigIntSchemaKey } from './BigIntSchemaKey';

export class Schema<S extends AnyObject> {
    public constructor(public shape: Required<InferShape<S>>) {}

    public static string() {
        return new StringSchemaKey({ type: Types.String, flags: [] });
    }

    public static number() {
        return new NumberSchemaKey({ type: Types.Number, flags: [] });
    }

    public static boolean() {
        return new BooleanSchemaKey({ type: Types.Boolean, flags: [] });
    }

    public static bigint() {
        return new BigIntSchemaKey({ type: Types.BigInt, flags: [] });
    }

    public parse<O>(object: O) {
        if (!isPlainObject(object))
            throw new Error('Invalid value when parsing schema');

        const requiredKeys = this.getRequiredKeys();
        const missingKey = requiredKeys.find(
            (key) => !Object.keys(object).includes(key)
        );

        if (missingKey) throw new Error(`Key "${missingKey}" is missing`);

        for (const [key, value] of Object.entries(object)) {
            if (key === 'id') continue;

            const definition = this.shape[key];

            if (!definition) throw new Error(`Unknown key "${key}"`);
            if (
                value === undefined ||
                (value === null &&
                    definition.options.flags.includes(SchemaKeyFlags.Nullable))
            )
                continue;

            definition.parse(value, key);
        }

        return object;
    }

    public getRequiredKeys() {
        return Object.keys(this.shape).filter(
            (key) => this.shape[key].required
        );
    }
}
