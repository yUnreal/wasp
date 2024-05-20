import { QueryError } from '../errors/QueryError';
import { Projection, QueryOptions } from '../typings/query';
import { AnyObject } from '../typings/utils';
import { Model } from './Model';
import { QueryKey } from './QueryKey';
import { Schema } from './Schema';

export class Query<Shape extends AnyObject = AnyObject> {
    public constructor(
        public model: Model<Schema<Shape>>,
        private name: string,
        public query = <QueryOptions<Shape>>{}
    ) {}

    public delete() {
        this.model.queries.delete(this.name);
    }

    public merge(query: Query<Shape>) {
        return this.model.queries.merge(this, query);
    }

    public edit(options: QueryOptions<Shape>) {
        return this.model.queries.edit(this.name, options);
    }

    public skip(amount: number) {
        this.query.skip = amount;

        return this;
    }

    public project(projection: Projection<Shape>) {
        this.query.projection = projection;

        return this;
    }

    public select<Key extends keyof Shape>(key: Key) {
        const fetchedKey = this.model.schema.shape[key];

        if (!fetchedKey)
            throw new QueryError(`Unknown key "${String(key)}"`, this.query);

        // @ts-expect-error Fix this soon
        return new QueryKey(fetchedKey);
    }
}
