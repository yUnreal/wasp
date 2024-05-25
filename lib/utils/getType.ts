import { Types } from '../types/schema';

export const getType = (value: unknown) => {
    switch (typeof value) {
    case 'number':
        return Types.Number;
    case 'string':
        return Types.String;
    case 'boolean':
        return Types.Boolean;
    default:
        throw new Error('Could not get the type from the value');
    }
};
