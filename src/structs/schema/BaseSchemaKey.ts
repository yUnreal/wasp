import {
    MappedSchemaKeys,
    MappedSchemaTypes,
    SchemaKeyEffect,
    SchemaKeyOptions,
    SchemaTypes,
} from '../../typings/schema';
import { getTypeOf } from '../../utils/getTypeOf';
import { ArraySchemaKey } from './ArraySchemaKey';

export abstract class BaseSchemaKey<Type extends SchemaTypes> {
    protected effects = <SchemaKeyEffect<Type>[]>[];

    public constructor(public options: SchemaKeyOptions<Type>) {}

    public get required() {
        return !this.options.optional;
    }

    public isSafe(value: unknown): value is MappedSchemaTypes[Type] {
        return getTypeOf(value) === this.options.type;
    }

    public optional() {
        if (this.options.optional)
            throw new Error('This key is already optional');

        this.options.optional = true;

        return this;
    }

    public parse(value: unknown) {
        const { cast } = this.options;

        if (cast) value = cast(value);
        if (!this.isSafe(value)) throw new Error('Invalid key type');

        for (const { effect, message } of this.effects) {
            if (!effect(value))
                throw new Error(message ?? 'Some effect in schema key failed');
        }
    }

    public effect(
        effect: (value: MappedSchemaTypes[Type]) => boolean,
        message?: string
    ) {
        this.effects.push({ effect, message });

        return this;
    }

    public default(fn: () => MappedSchemaTypes[Type]) {
        if (this.options.default)
            throw new Error('Default function value is already defined');

        this.options.default = fn;

        return this;
    }

    public array() {
        return new ArraySchemaKey([this as unknown as MappedSchemaKeys[Type]], {
            type: SchemaTypes.Array,
        });
    }

    public nullable() {
        if (this.options.nullable)
            throw new Error('This schema key is already nullable');

        this.options.nullable = true;

        return this;
    }

    public cast(fn: (value: unknown) => MappedSchemaTypes[Type]) {
        this.options.cast = fn;

        return this;
    }
}
