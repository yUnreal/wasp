import { SchemaTypes } from '../../typings/schema';
import { BaseSchemaKey } from './BaseSchemaKey';

export class StringSchemaKey extends BaseSchemaKey<SchemaTypes.String> {
    public max(length: number, message?: string) {
        return this.effect((value) => value.length <= length, message);
    }

    public min(length: number, message?: string) {
        return this.effect((value) => value.length >= length, message);
    }

    public length(length: number, message?: string) {
        return this.effect((value) => value.length === length, message);
    }
    
}
