import { AnyObject } from '../types/utils';
import { dirname } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

export class JSONDriver<S extends AnyObject> {
    public constructor(public readonly path: string) {
        if (!path.endsWith('.json'))
            throw new Error('Invalid path', { cause: path });
        if (!existsSync(path)) {
            const dir = dirname(path);
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true }); // Cria o diretório recursivamente
            }
            writeFileSync(path, '{}', 'utf8');
        }
    }

    public read() {
        const stringifiedData = readFileSync(this.path, 'utf8');

        return <Record<string, S>>JSON.parse(stringifiedData);
    }

    public update(fn: (data: Record<string, S>) => unknown) {
        const data = this.read();

        fn(data);

        writeFileSync(this.path, JSON.stringify(data, null, '\t') + '\n');

        return this;
    }
}
