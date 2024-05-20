import { JSONBasedDriver } from '../drivers/JSONBasedDriver';
import { QueryError } from '../errors/QueryError';
import {
    DeleteOneOptions,
    QueryOptions,
    UpdateOneOptions,
} from '../typings/query';
import { Infer } from '../typings/schema';
import { AnyObject } from '../typings/utils';
import { project } from '../utils/project';
import { Doc } from './Doc';
import { Schema } from './Schema';
import isEqual from 'lodash.isequal';
import uuid from 'uuid-random';
import { inspect } from 'util';
import { QueryManager } from '../managers/QueryManager';
import { ModelOptions } from '../typings/model';

export class Model<S extends Schema<AnyObject>> {
    public constructor(public options: ModelOptions<S>) {}

    public get name() {
        return this.options.name;
    }

    public get schema() {
        return this.options.schema;
    }

    protected get driver() {
        return (
            this.options.driver ??
            new JSONBasedDriver<Infer<S>>(`./wuue/${this.name}.json`)
        );
    }

    public get queries() {
        // @ts-expect-error Unknown error
        return new QueryManager<Infer<S>>(this);
    }

    public findUnique(
        options: QueryOptions<Infer<S>> | string
    ): Doc<Infer<S>> | null {
        const { query, skip, projection } = this.queries.resolve(options);

        const { data } = this.driver;

        if (query.id) {
            //// @ts-expect-error Ignore it
            const foundDoc = data[query.id];

            return foundDoc ? new Doc(foundDoc, this) : null;
        }

        const skipedValues = Object.values(data).slice(0, skip);

        const doc = skipedValues.find((obj) => {
            return Object.entries(query).every(([key, value]) =>
                isEqual(obj[key], value)
            );
        });

        if (!doc) return null;
        if (projection) return new Doc(project(doc, projection), this);

        return new Doc(doc, this);
    }

    public deleteOne(options: DeleteOneOptions<Infer<S>> | string) {
        const doc = this.findUnique(options);

        if (!doc) {
            // @ts-expect-error After fix this
            if ('throw' in options && options.throw)
                throw new QueryError('Unknown document', options);

            return null;
        }

        return doc;
    }

    public updateOne(
        query: QueryOptions<Infer<S>> | string,
        update: UpdateOneOptions<Infer<S>>
    ) {
        const doc = this.findUnique(query);

        if (!doc) return null;

        this.driver.update((data) => {
            Object.defineProperty(data, doc.id, { value: update });

            return data;
        });

        return;
    }

    public create(data: Infer<S>) {
        this.schema.parse(data);

        this.driver.update((crrData) => {
            const id = uuid();

            Object.defineProperty(crrData, id, {
                value: { id, ...data },
            });

            return crrData;
        });

        return new Doc(data, this);
    }

    public createMany(...data: Infer<S>[]) {
        const createdDocs = [];

        for (const item of data) {
            createdDocs.push(this.create(item));
        }

        return createdDocs;
    }

    public inspect() {
        return inspect(this, {
            colors: true,
            depth: Infinity,
            getters: true,
            showHidden: true,
        });
    }
}
