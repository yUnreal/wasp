import { SchemaTypes } from '../../typings/schema';
import { BaseSchemaKey } from './BaseSchemaKey';

export class RegexSchemaKey extends BaseSchemaKey<SchemaTypes.RegExp> {
    public match(regex: RegExp, message?: string) {
        return this.effect(
            (crrRegex) => crrRegex.source === regex.source,
            message
        );
    }
}
