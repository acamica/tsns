import { IBuildOptions } from '../build/build';
import {rm} from 'shelljs';
import {exec} from '../../utils/rx-exec';
import { Observable } from 'rxjs/Observable';
import { pipeOutput, closeWithErrorWhenStatusCode } from '../../utils/rx-exec';

export const buildAndPipeOutput = (options: IBuildOptions) =>
    build(options)
        .do(pipeOutput) // TODO: Shouldn't do side effect here
        .switchMap(process => closeWithErrorWhenStatusCode(process.close$))
        // Finish the chain once the process has finished
        .first();
export interface IBuildOptions {
    watch: true | undefined;
    unusedLocals?: boolean;
}

export function build (options: IBuildOptions) {
    return Observable
        .of(null)
        .do(_ => rm('-r', './dist/**/*.{js,map,ts}'))
        .switchMap(_ => tsc(options))
    ;
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
