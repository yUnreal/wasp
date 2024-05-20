import { QueryError } from '../errors/QueryError';
import { Model } from '../structs/Model';
import { Query } from '../structs/Query';
import { Schema } from '../structs/Schema';
import { QueryOptions } from '../typings/query';
import { AnyObject } from '../typings/utils';
import { BaseManager } from './BaseManager';

export class QueryManager<T extends AnyObject = AnyObject> extends BaseManager<
    string,
    Query<T>
> {
    public constructor(public model: Model<Schema<T>>) {
        super();
    }

    public resolve(query: QueryOptions<T> | string) {
        if (typeof query === 'object') return query;

        const fetchedQuery = this.get(query);

        if (!fetchedQuery)
            throw new QueryError(`Uknown query "${query}"`, this);

        return fetchedQuery.query;
    }

    public delete(query: string) {
        return this.cache.delete(query);
    }

    public create(name: string, options?: QueryOptions<T>) {
        const query = new Query(this.model, name, options);

        this.cache.set(name, query);

        return query;
    }

    public get(name: string) {
        return this.cache.get(name) ?? null;
    }

    public merge(first: Query<T>, second: Query<T>) {
        first.query = { ...first.query, ...second.query };

        return first;
    }

    public edit(name: string, options: QueryOptions<T>) {
        const query = this.get(name);

        if (!query) throw new QueryError(`Unknown query "${name}"`, options);

        query.query = { ...query.query, ...options };

        this.cache.set(name, query);

        return query;
    }
}
