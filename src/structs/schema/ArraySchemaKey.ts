import {
    AnySchemaKey,
    SchemaKeyOptions,
    SchemaTypes,
} from '../../typings/schema';
import { BaseSchemaKey } from './BaseSchemaKey';

export class ArraySchemaKey<
    Items extends AnySchemaKey,
> extends BaseSchemaKey<SchemaTypes.Array> {
    public constructor(
        public items: Items[],
        options: SchemaKeyOptions<SchemaTypes.Array>
    ) {
        super(options);
    }

    public parse(value: unknown) {
        super.parse(value);

        for (const index in <unknown[]>value) {
            const indexedItem = this.items[index];

            indexedItem.parse((<unknown[]>value)[index]);
        }
    }
}
