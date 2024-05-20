import {
    ObjectShape,
    SchemaKeyOptions,
    SchemaTypes,
} from '../../typings/schema';
import { BaseSchemaKey } from './BaseSchemaKey';

export class ObjectSchemaKey<
    T extends ObjectShape,
> extends BaseSchemaKey<SchemaTypes.Object> {
    public constructor(
        public shape: T,
        options: SchemaKeyOptions<SchemaTypes.Object>
    ) {
        super(options);
    }
}
