import { QueryError } from '../errors/QueryError';
import { InferQuery, Operators } from '../typings/query';
import { AnySchemaKey, MappedSchemaTypes } from '../typings/schema';

export class QueryKey<Key extends AnySchemaKey> {
    public constructor(
        public key: Key,
        public query = <InferQuery<Key>>{}
    ) {}

    private set(operator: Operators, value: unknown) {
        Object.defineProperty(this.query, operator, { value });

        return this;
    }

    public where(fn: (value: unknown) => boolean) {
        return this.set(Operators.Where, fn);
    }

    public equal(value: MappedSchemaTypes[Key['options']['type']]) {
        return this.set(Operators.Equal, value);
    }

    public nequal(value: unknown) {
        return this.set(Operators.NotEqual, value);
    }

    public in(value: unknown[]) {
        if (!Array.isArray(value))
            throw new QueryError('Invalid array for "In" operator', this.query);

        return this.set(Operators.In, value);
    }

    public exists(exists: boolean) {
        return this.set(Operators.Exists, exists);
    }

    public length(len: number) {
        return this.set(Operators.Length, len);
    }

    public includes(value: string) {
        return this.set(Operators.Includes, value);
    }

    public size(value: number) {
        return this.set(Operators.Size, value);
    }

    public gt(num: number) {
        return this.set(Operators.Greater, num);
    }

    public gte(num: number) {
        return this.set(Operators.GreaterThanOrEqual, num);
    }

    public lt(num: number) {
        return this.set(Operators.Less, num);
    }

    public lte(num: number) {
        return this.set(Operators.LessThanOrEqual, num);
    }
}
