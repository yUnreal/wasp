import { Projection, UpdateOneOptions } from '../typings/query';
import { Model } from './Model';
import { Schema } from './Schema';

export class Doc<T extends Record<string, unknown>> {
    public constructor(
        public _doc: T,
        public model: Model<Schema<T>>
    ) {}

    public get id() {
        return <string>this._doc.id;
    }

    public fetch(projection?: Projection<T>) {
        return <Doc<T>>(
            this.model.findUnique({ query: { id: this.id }, projection })
        );
    }

    public delete() {
        this.model.deleteOne({ query: { id: this.id } });
    }

    public update(options: UpdateOneOptions<T>) {
        return this.model.updateOne({ query: { id: this.id } }, options);
    }

    public save() {
        return this.update({ Set: this._doc });
    }
}
