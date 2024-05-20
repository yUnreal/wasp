export class QueryError extends Error {
    public constructor(
        message: string,
        public query: object
    ) {
        super(message);
    }
}
