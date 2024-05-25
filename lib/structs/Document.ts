import isPlainObject from 'is-plain-obj';
import { AnyObject } from '../types/utils';
import { Model } from './Model';
import { Schema } from './schema/Schema';

export class Document<T extends AnyObject & { id?: string }> {
    public constructor(
        public data: T,
        public model: Model<Schema<T>>
    ) {
        for (const [key, value] of Object.entries(data)) {
            const DATE_KEY = '$date';

            if (isPlainObject(value) && value[DATE_KEY])
                Object.defineProperty(data, key, {
                    value: new Date(<number>value[DATE_KEY]),
                });
        }
    }

    public fetch() {
        return this.model.findById(this.id);
    }

    public get id() {
        return <string>this.data.id;
    }
}
