import { Model } from './structs/Model';
import { Schema } from './structs/schema/Schema';
import { AnyObject } from './types/utils';

export const createModel = <S extends Schema<AnyObject>>(
    name: string,
    schema: S
) => new Model(name, schema);
