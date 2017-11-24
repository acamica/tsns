#!/usr/bin/env node
import * as program from 'commander';
import { tsnsVersion$ } from '../utils/package-json';
import { init } from './init/init';

tsnsVersion$
    // Configure the program options
    .map(version =>
        program
            .version(version)
            .description('Inits the project (to be runned after instalation)')
            .parse(process.argv)
    )
    // Build and Run the program
    .switchMap(_ => init())
    // .do(process => pipeOutput(process))
    // .switchMap(process => closeWithErrorWhenStatusCode(process.close$))
    .subscribe(
        () => {},
        err => {
            console.error('There was an error running the program:', err);
            process.exit(1);
        }
    );
