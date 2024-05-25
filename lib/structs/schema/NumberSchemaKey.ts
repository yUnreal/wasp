import { Types, Expression } from '../../types/schema';
import { NumberBasedSchemaKey } from './NumberBasedSchemaKey';

export class NumberSchemaKey extends NumberBasedSchemaKey<Types.Number> {
    public integer(message = `"${Expression.Key}" must be a integer`) {
        return this.effect(Number.isSafeInteger, message);
    }

    public float(message = `"${Expression.Key}" me be a float`) {
        return this.effect((num) => !Number.isInteger(num), message);
    }
}
