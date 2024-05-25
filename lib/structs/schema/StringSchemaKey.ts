import { Expression, Types } from '../../types/schema';
import { SchemaKey } from './SchemaKey';

export class StringSchemaKey extends SchemaKey<Types.String> {
    public min(
        number: number,
        message = `"${Expression.Key}" length must be greater than ${number}`
    ) {
        return this.effect((string) => string.length >= number, message);
    }

    public max(
        number: number,
        message = `"${Expression.Key}" length must be less than ${number}`
    ) {
        return this.effect((string) => string.length <= number, message);
    }

    public match(
        pattern: RegExp,
        message = `"${Expression.Key}" must match the pattern "${pattern.source}"`
    ) {
        return this.effect((string) => pattern.test(string), message);
    }
}
