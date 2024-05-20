import {
    AnySchemaKey,
    SchemaKeyOptions,
    SchemaTypes,
} from '../../typings/schema';
import { BaseSchemaKey } from './BaseSchemaKey';

export class MapSchemaKey<
    K extends AnySchemaKey,
    V extends AnySchemaKey,
> extends BaseSchemaKey<SchemaTypes.Map> {
    public constructor(
        public key: K,
        public value: V,
        options: SchemaKeyOptions<SchemaTypes.Map>
    ) {
        super(options);
    }

    public size(size: number, message?: string) {
        return this.effect((map) => map.size === size, message);
    }

    public parse(map: unknown) {
        this.parse(map);

        for (const [key, value] of <Map<unknown, unknown>>map) {
            this.key.parse(key);
            this.value.parse(value);
        }
    }
}
