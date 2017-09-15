import {rm} from 'shelljs';
import {exec} from '../../utils/rx-exec';

export interface IBuildOptions {
    watch: true | undefined;
    unusedLocals?: boolean;
}

export function build (options: IBuildOptions) {
    rm('-rf', './dist/**/*');
    return tsc(options);
}

/**
 * Calls the TypeScript compiler
 * @param options options to send to the TypeScript compiler
 */
export function tsc (options: IBuildOptions) {
    let optionString = '';
    if (options.watch) {
        optionString += '-w ';
    }
    if (!options.unusedLocals) {
        optionString += '-noUnusedLocals ';
    }
    const command = `./node_modules/.bin/tsc ${optionString}`;
    return exec(command);
}
