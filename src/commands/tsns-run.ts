#!/usr/bin/env node
import {Observable} from 'rxjs';
import * as program from 'commander';
import {IPackageJson} from '../package.json';
import {resolve, join} from 'path';
import {run} from './run/run';
// import {pipeOutput, closeWithErrorWhenStatusCode} from '../utils/rx-exec';


import {readJSON} from '../utils/promise-fs';

const root = resolve(__dirname, '../../');

// Function to read the project package json
const readPackageJSON = () => Observable.fromPromise(readJSON<IPackageJson>(join(root, 'package.json')));


readPackageJSON()
    // Configure the program options
    .map(packageJson =>
        program
            .version(packageJson.version)
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
