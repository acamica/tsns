// import {exec, rm} from 'shelljs';
import {exec} from '../../utils/rx-exec';

export interface IBuildOptions {
    watch: true | undefined;
}

export function build (options: IBuildOptions) {
    // rm('-rf', './dist'); // TODO: Try to delete only the generated files by this build
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
    // return exec(`./node_modules/.bin/tsc ${optionString}`, {async: true});
    return exec(`./node_modules/.bin/tsc ${optionString}`);
}
