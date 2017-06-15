#!/usr/bin/env node
import * as program from 'commander';
import {IPackageJson} from '../package.json';
import {resolve, join} from 'path';
import {run} from './run/run';

import {readJSON} from '../utils/promise-fs';

const root = resolve(__dirname, '../../');

// Function to read the project package json
const readPackageJSON = () => readJSON<IPackageJson>(join(root, 'package.json'));

readPackageJSON()
    .then(packageJson => {
        program
            .version(packageJson.version)
            .description('Run your node app')
            // .option('-w, --watch', 'Watch for changes')
            // .option('-D, --debug [port]', 'Debug your typescript app')
            .option('--no-build', 'Don\'t build the project before running it')
            .parse(process.argv);
        run(<any>program);

    }
    )
    .catch(err => console.error('There was an error running the program', err));

