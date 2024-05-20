import { SchemaTypes } from '../../typings/schema';
import { BaseNumberSchemaKey } from './BaseNumberSchemaKey';

export class NumberSchemaKey extends BaseNumberSchemaKey<SchemaTypes.Number> {
    public integer(message?: string) {
        return this.effect(Number.isInteger, message);
    }

    public float(message?: string) {
        return this.effect((value) => !Number.isInteger(value), message);
    }
}
