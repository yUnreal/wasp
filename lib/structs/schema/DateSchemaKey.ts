import { Expression, Types } from '../../types/schema';
import { SchemaKey } from './SchemaKey';

export class DateSchemaKey extends SchemaKey<Types.Date> {
    public min(
        date: Date,
        message = `${Expression.Key} must be older than ${date.toISOString()}`
    ) {
        return this.effect(
            (crrData) => crrData.getTime() > date.getTime(),
            message
        );
    }

    public max(
        date: Date,
        message = `${Expression.Key} must be newer than ${date.toISOString()}`
    ) {
        return this.effect(
            (crrData) => crrData.getTime() < date.getTime(),
            message
        );
    }
}
