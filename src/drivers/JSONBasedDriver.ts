import { basename } from 'path';
import { DriverError } from '../errors/DriverError';
import { writeFileSync, readFileSync, existsSync } from 'fs';

export class JSONBasedDriver<
    T extends Record<string, unknown> = Record<string, unknown>,
> {
    public constructor(public readonly path: string) {
        if (!path.endsWith('.json'))
            throw new DriverError('Invalid path', this);
        if (!existsSync(path)) writeFileSync(path, '{}');
    }

    protected getPathName() {
        return basename(this.path, '.json');
    }

    public get data() {
        const data = readFileSync(this.path, 'utf8');

        return <T>JSON.parse(data);
    }

    public update(fn: (data: T) => T) {
        const data = fn(this.data);

        writeFileSync(this.path, JSON.stringify(data, null, '\t'));

        return this;
    }
}
