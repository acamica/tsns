#!/usr/bin/env node
import * as program from 'commander';
import {IPackageJson} from '../package.json';
import {resolve, join} from 'path';
import {build} from './build/build';
import {pipeOutput, closeWithErrorWhenStatusCode} from '../utils/rx-exec';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {readJSON} from '../utils/promise-fs';

const root = resolve(__dirname, '../../');

// Function to read the project package json
const readPackageJSON = () => Observable.fromPromise(readJSON<IPackageJson>(join(root, 'package.json')));

const begin = moment();

readPackageJSON()

    // Configure the program options
    .map(packageJson =>
        program
            .version(packageJson.version)
            .description('Builds your app using the tsc from your node modules')
            .option('-w, --watch', 'Watch for changes')
            .option('--no-unused-locals')
            .parse(process.argv)
    )
    // Build the project
    .switchMap((programConfiguration) => build(programConfiguration as any))
    // .do(process => {
    //     Observable.merge(
    //         process.message$.map(value => ({name: 'message', value: value})),
    //    `    process.error$.map(value => ({name: 'error', value: value})),
    //         process.exit$.map(value => ({name: 'exit', value: value})),
    //         process.close$.map(value => ({name: 'close', value: value})),
    //         process.disconnect$.map(value => ({name: 'disconnect', value: value})),
    //     ).subscribe(x => console.log(x.name, x.value));
    // })
    // Pipe child process stderr and stdout to corresponding parents
    .do(process => pipeOutput(process))
    .switchMap(process => closeWithErrorWhenStatusCode(process.close$))
    .first()
    .subscribe(
        process => {}, // console.log('finish?'),
        err => {
            console.error('There was an error building the program:', err);
            process.exit(1);
        },
        () => console.log(`Compiled in ${moment().diff(begin, 'second', true)}s`)
    );

// process.stdin.resume(); // so the program will not close instantly

