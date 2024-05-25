import {
    Constraint,
    MappedSchemaTypes,
    SchemaKeyFlags,
    SchemaKeyOptions,
    Types,
} from '../../types/schema';
import { getType } from '../../utils/getType';

export abstract class SchemaKey<Type extends Types> {
    protected constraints = <Constraint<Type>[]>[];

    public constructor(public options: SchemaKeyOptions<Type>) {}

    public get type() {
        return this.options.type;
    }

    public get required() {
        return !this.options.flags.includes(SchemaKeyFlags.Optional);
    }

    public nullable() {
        const { flags } = this.options;

        if (flags.includes(SchemaKeyFlags.Nullable)) return this;

        flags.push(SchemaKeyFlags.Nullable);

        return this;
    }

    public optional() {
        const { flags } = this.options;

        if (flags.includes(SchemaKeyFlags.Optional)) return this;

        flags.push(SchemaKeyFlags.Optional);

        return this;
    }

    public effect(
        effect: (value: MappedSchemaTypes[Type]) => unknown,
        message: string
    ) {
        this.constraints.push({ effect, message });

        return this;
    }

    public parse(value: unknown, key: string) {
        if (getType(value) !== this.type)
            throw new Error(`Invalid value, expected the type "${this.type}"`);

        for (const { effect, message } of this.constraints) {
            // @ts-expect-error Will be fixed as soon as possible
            if (!effect(value)) throw new Error(message.replace('{KEY}', key));
        }
    }
}
