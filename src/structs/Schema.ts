import isPlainObject from 'is-plain-obj';
import {
    AnySchemaKey,
    InferSchema,
    ObjectShape,
    SchemaOptions,
    SchemaTypes,
} from '../typings/schema';
import { AnyObject } from '../typings/utils';
import { SchemaError } from '../errors/SchemaError';
import { StringSchemaKey } from './schema/StringSchemaKey';
import { NumberSchemaKey } from './schema/NumberSchemaKey';
import { BooleanSchemaKey } from './schema/BooleanSchemaKey';
import { ArraySchemaKey } from './schema/ArraySchemaKey';
import { ObjectSchemaKey } from './schema/ObjectSchemaKey';
import { BigIntSchemaKey } from './schema/BigIntSchemaKey';
import { DateSchemaKey } from './schema/DateSchemaKey';
import { MapSchemaKey } from './schema/MapSchemaKey';

export class Schema<Shape extends AnyObject> {
    public constructor(
        public shape: InferSchema<Shape>,
        public options = <SchemaOptions>{}
    ) {}

    public getRequiredKeys() {
        return Object.keys(this.shape).filter(
            (key) => this.shape[key].required
        );
    }

    public parse(object: unknown) {
        if (!isPlainObject(object))
            throw new SchemaError('Invalid value to parse', this);

        const requiredKeys = this.getRequiredKeys();
        const missingKey = Object.keys(object).find(
            (key) => !requiredKeys.includes(key)
        );

        if (missingKey)
            throw new SchemaError(`Missing required key "${missingKey}"`, this);

        for (const [key, value] of Object.entries(object)) {
            const definition = this.shape[key];

            if (!definition) {
                if (this.options.strict)
                    throw new SchemaError(
                        `Unknown key "${key}" in strict mode`,
                        this
                    );

                delete object[key];

                continue;
            }

            // @ts-expect-error Ignore it
            definition.parse(value);
        }
    }

    public static string() {
        return new StringSchemaKey({ type: SchemaTypes.String });
    }

    public static number() {
        return new NumberSchemaKey({ type: SchemaTypes.Number });
    }

    public static boolean() {
        return new BooleanSchemaKey({ type: SchemaTypes.Boolean });
    }

    public static array<Keys extends AnySchemaKey>(...keys: Keys[]) {
        return new ArraySchemaKey(keys, { type: SchemaTypes.Array });
    }

    public static object<Shape extends ObjectShape>(shape: Shape) {
        return new ObjectSchemaKey(shape, { type: SchemaTypes.Object });
    }

    public static bigint() {
        return new BigIntSchemaKey({ type: SchemaTypes.BigInt });
    }

    public static date() {
        return new DateSchemaKey({ type: SchemaTypes.Date });
    }

    public static map<K extends AnySchemaKey, V extends AnySchemaKey>(
        key: K,
        value: V
    ) {
        return new MapSchemaKey(key, value, { type: SchemaTypes.Map });
    }
}
