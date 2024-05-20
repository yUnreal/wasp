import { Schema } from '../structs/Schema';

export class SchemaError extends Error {
    public constructor(
        message: string,
        public schema: Schema<Record<string, unknown>>
    ) {
        super(message);
    }
}
