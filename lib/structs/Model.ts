import { JSONDriver } from '../drivers/JSONDriver';
import { Infer } from '../types/schema';
import { AnyObject } from '../types/utils';
import { Document } from './Document';
import { Schema } from './schema/Schema';
import uuid from 'uuid-random';
import { join } from 'path';

export class Model<S extends Schema<AnyObject>> {
    public driver: JSONDriver<Infer<S>>;

    public constructor(
        public name: string,
        public schema: S
    ) {
        this.driver = new JSONDriver<Infer<S>>(
            join(__dirname, `../../wasp/${this.name}/${this.name}.json`)
        );
    }

    public create(data: Infer<S> & { id?: string }) {
        if ('id' in data && typeof data.id !== 'string')
            throw new Error('"id" property must always be a string');

        this.schema.parse(data);

        for (const [key, value] of Object.entries(data)) {
            if (value instanceof Date)
                Object.defineProperty(data, key, {
                    value: { $date: value.getTime() },
                    enumerable: true,
                });
        }

        data.id ??= uuid();

        this.driver.update((crrData) =>
            Object.defineProperty(crrData, <string>data.id, {
                value: data,
                enumerable: true,
            })
        );

        return new Document(data, this);
    }

    public findById(id: string) {
        const doc = this.driver.read()[id];

        if (!doc) return null;

        // @ts-expect-error Ignore it
        return new Document<Infer<S>>(doc, this);
    }

    public findByIdAndDelete(id: string) {
        const doc = this.findById(id);

        if (doc) this.driver.update((data) => delete data[doc.id]);

        return doc;
    }
}
