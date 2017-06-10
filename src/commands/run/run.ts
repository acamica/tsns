import {exec} from 'shelljs';

export interface IRunOptions {
    watch: true | undefined;
}

export function run (options: IRunOptions) {
    exec('node dist/src/index.js');
}
