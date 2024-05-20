import { Projection } from '../typings/query';

export const project = <O extends Record<string, unknown>>(
    object: O,
    projection: Projection<O>
) => {
    if (Array.isArray(projection)) {
        const projectedEntries = Object.entries(object).filter(([key]) =>
            projection.includes(key)
        );

        return <O>Object.fromEntries(projectedEntries);
    }

    return object;
};
