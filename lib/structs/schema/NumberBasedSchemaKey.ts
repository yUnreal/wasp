import { Expression, Types } from '../../types/schema';
import { SchemaKey } from './SchemaKey';

export abstract class NumberBasedSchemaKey<
    T extends Types.Number | Types.BigInt,
> extends SchemaKey<T> {
    public min(
        number: number,
        message = `Min length of the "${Expression.Key}" must be ${number}`
    ) {
        return this.effect((num) => num > number, message);
    }

    public max(
        number: number,
        message = `Max length of the "${Expression.Key}" must be ${number}`
    ) {
        return this.effect((num) => num < number, message);
    }

    public gte(
        number: number,
        message = `"${Expression.Key}" must be greater or equal than ${number}`
    ) {
        return this.min(number - 1, message);
    }

    public lte(
        number: number,
        message = `"${Expression.Key}" must be less or equal to ${number}`
    ) {
        return this.max(number - 1, message);
    }
}
