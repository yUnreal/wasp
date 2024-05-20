import { SchemaTypes } from '../../typings/schema';
import { BaseSchemaKey } from './BaseSchemaKey';

export class BooleanSchemaKey extends BaseSchemaKey<SchemaTypes.Boolean> {
    public truthy(values: (number | string)[], message?: string) {
        return this.effect((value) => values.includes(value), message);
    }

    public falsy(values: (number | string)[], message?: string) {
        return this.truthy(values, message);
    }
}
