import { SchemaTypes } from '../../typings/schema';
import { BaseSchemaKey } from './BaseSchemaKey';

export abstract class BaseNumberSchemaKey<
    T extends SchemaTypes.BigInt | SchemaTypes.Number | SchemaTypes.Date,
> extends BaseSchemaKey<T> {
    public min(min: number, message?: string) {
        // @ts-expect-error Ignore it
        return this.effect((value) => +value > min, message);
    }

    public max(max: number, message?: string) {
        // @ts-expect-error Ignore it
        return this.effect((value) => +value < max, message);
    }

    public positive(message?: string) {
        return this.min(1, message);
    }

    public negative(message?: string) {
        return this.max(0, message);
    }
}
