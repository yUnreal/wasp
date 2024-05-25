import { AnyObject } from '../types/utils';
import { Model } from './Model';
import { Schema } from './schema/Schema';

export class Document<T extends AnyObject & { id?: string }> {
    public constructor(
        public data: T,
        public model: Model<Schema<T>>
    ) {}

    public fetch() {
        return this.model.findById(this.id);
    }

    public get id() {
        return <string>this.data.id;
    }
}
