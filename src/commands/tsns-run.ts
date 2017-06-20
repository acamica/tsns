#!/usr/bin/env node
import * as program from 'commander';
import {tsnsVersion$} from '../utils/package-json';
import {run} from './run/run';
// import {pipeOutput, closeWithErrorWhenStatusCode} from '../utils/rx-exec';

tsnsVersion$
    // Configure the program options
    .map(version =>
        program
            .version(version)
            .description('Run your node app')
            .option('-w, --watch', 'Watch for changes')
            // .option('-D, --debug [port]', 'Debug your typescript app')
            .option('--no-build', 'Don\'t build the project before running it')
            .parse(process.argv)
    )
    // Build and Run the program
    .switchMap((programConfiguration) => run(programConfiguration as any))
    // .do(process => pipeOutput(process))
    // .switchMap(process => closeWithErrorWhenStatusCode(process.close$))
    .subscribe(
        () => {},
        err => {
            console.error('There was an error running the program:', err);
            process.exit(1);
        }
    );
